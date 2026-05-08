<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\CandidateSkillRequest;
use App\Services\Candidate\CandidateSkillService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateSkillController extends Controller
{
    public function __construct(protected CandidateSkillService $service) {}

    // Fungsi untuk menambah / update skill
    public function store(CandidateSkillRequest $request): RedirectResponse
    {
        // Ambil atau buat relasi candidate
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();

        // Format array agar sesuai dengan bawaan pivot Laravel
        $skillsToSync = collect($request->validated('skills'))->mapWithKeys(function ($item) {
            return [$item['skill_id'] => ['level' => $item['level']]];
        })->toArray();

        // Panggil Service
        $this->service->addOrUpdateSkills($candidate, $skillsToSync);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Keahlian berhasil disimpan.',
        ]);

        return back();
    }

    // Fungsi untuk menghapus skill
    public function destroy(Request $request, $skillId): RedirectResponse
    {
        $candidate = $request->user()->candidate;

        if ($candidate) {
            // Panggil Service
            $this->service->removeSkill($candidate, $skillId);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Keahlian berhasil dihapus.',
        ]);

        return back();
    }
}
