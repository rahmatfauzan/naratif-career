<?php

namespace App\Services\Candidate;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\UploadedFile;

class CandidateService
{
    /**
     * Get complete candidate profile with all relationships.
     */
    public function getCompleteProfile(User $user)
    {
        $candidate = $user->candidate()->with([
            'address',
            'educations' => function ($query) {
                $query->orderBy('start_year', 'desc')->orderBy('end_year', 'desc');
            },
            'experiences' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
            'experiences.document',
            'skills',
            'languages',
            'achievements.document',
            'trainings' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
            'trainings.document',
            'certifications' => function ($query) {
                $query->orderBy('issued_date', 'desc');
            },
            'certifications.document',
            'documents',
        ])->first();

        // Jika belum ada data kandidat, kita bisa mengembalikan array kosong atau format default
        if (!$candidate) {
            return null;
        }

        return $candidate;
    }

    /**
     * Pre-load regional data (provinces, regencies, districts, villages)
     * based on the candidate's existing region_code to save FE from multiple API calls.
     */
    public function getRegionData(?string $regionCode): array
    {
        $base = 'https://wilayah.id/api';

        // 1. Selalu load data provinsi di awal
        $provinces = Http::get("$base/provinces.json")->json('data') ?? [];

        $regencies = [];
        $districts = [];
        $villages = [];

        // 2. Jika user sudah punya region_code, langsung siapkan list bawahnya
        if ($regionCode) {
            $parts = explode('.', $regionCode);

            $provCode = $parts[0] ?? null;
            $regCode = isset($parts[1]) ? $parts[0] . '.' . $parts[1] : null;
            $disCode = isset($parts[2]) ? $parts[0] . '.' . $parts[1] . '.' . $parts[2] : null;

            if ($provCode) {
                $regencies = Http::get("$base/regencies/{$provCode}.json")->json('data') ?? [];
            }
            if ($regCode) {
                $districts = Http::get("$base/districts/{$regCode}.json")->json('data') ?? [];
            }
            if ($disCode) {
                $villages = Http::get("$base/villages/{$disCode}.json")->json('data') ?? [];
            }
        }

        return compact('provinces', 'regencies', 'districts', 'villages');
    }

    /**
     * Update user, candidate profile, and address in a single transaction.
     */
    public function updateProfile(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            // 1. Update User (e.g. name)
            if (isset($data['name'])) {
                $user->update(['name' => $data['name']]);
            }

            // 2. Update Candidate Profile
            $candidate = $user->candidate ?? $user->candidate()->create();

            $candidateData = [];
            $candidateFields = [
                'phone',
                'date_of_birth',
                'gender',
                'nik',
                'linkedin_url',
                'portfolio_url',
                'summary'
            ];

            foreach ($candidateFields as $field) {
                if (array_key_exists($field, $data)) {
                    $candidateData[$field] = $data[$field];
                }
            }

            // Handle Avatar Upload
            if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
                if ($candidate->avatar_url) {
                    Storage::disk('public')->delete($candidate->avatar_url);
                }
                $candidateData['avatar_url'] = $data['avatar']->store('avatars', 'public');
            }

            if (!empty($candidateData)) {
                $candidate->update($candidateData);
            }

            // 3. Update Address
            if (isset($data['address']) && is_array($data['address'])) {
                $address = $candidate->address ?? $candidate->address()->create();

                $addressData = [];
                $addressFields = ['region_code', 'full_address', 'postal_code'];

                foreach ($addressFields as $field) {
                    if (array_key_exists($field, $data['address'])) {
                        $addressData[$field] = $data['address'][$field];
                    }
                }

                if (!empty($addressData)) {
                    $address->update($addressData);
                }
            }

            return $candidate->fresh(['user', 'address']);
        });
    }
}
