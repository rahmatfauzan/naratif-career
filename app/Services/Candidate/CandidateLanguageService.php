<?php

namespace App\Services\Candidate;

use App\Models\Candidate;

class CandidateLanguageService
{
    /**
     * Menambahkan language baru atau mengupdate proficiency language yang sudah ada
     * tanpa menghapus language lain di tabel pivot.
     */
    public function addOrUpdateLanguages(Candidate $candidate, array $languagesToSync): void
    {
        $candidate->languages()->syncWithoutDetaching($languagesToSync);
    }

    /**
     * Menghapus language spesifik dari kandidat.
     */
    public function removeLanguage(Candidate $candidate, $languageId): void
    {
        $candidate->languages()->detach($languageId);
    }
}
