<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\CandidateLanguageRequest;
use App\Services\Candidate\CandidateLanguageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateLanguageController extends Controller
{
    public function __construct(protected CandidateLanguageService $service) {}

    // Fungsi untuk menambah / update language
    public function store(CandidateLanguageRequest $request): RedirectResponse
    {
        // Ambil atau buat relasi candidate
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();

        // Format array agar sesuai dengan bawaan pivot Laravel
        $languagesToSync = collect($request->validated('languages'))->mapWithKeys(function ($item) {
            return [$item['language_id'] => ['proficiency' => $item['proficiency']]];
        })->toArray();

        $this->service->addOrUpdateLanguages($candidate, $languagesToSync);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kemampuan bahasa berhasil disimpan.',
        ]);

        return back();
    }

    // Fungsi untuk menghapus satu language
    public function destroy(Request $request, $languageId): RedirectResponse
    {
        $candidate = $request->user()->candidate;

        if ($candidate) {
            $this->service->removeLanguage($candidate, $languageId);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Kemampuan bahasa berhasil dihapus.',
            ]);
        }

        return back();
    }
}

