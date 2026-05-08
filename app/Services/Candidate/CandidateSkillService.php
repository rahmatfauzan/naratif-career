<?php

namespace App\Services\Candidate;

use App\Models\Candidate;

class CandidateSkillService
{
    /**
     * Menambahkan skill baru atau mengupdate level skill yang sudah ada
     * tanpa menghapus skill lain di tabel pivot.
     */
    public function addOrUpdateSkills(Candidate $candidate, array $skillsToSync): void
    {
        $candidate->skills()->syncWithoutDetaching($skillsToSync);
    }

    /**
     * Menghapus skill spesifik dari kandidat.
     */
    public function removeSkill(Candidate $candidate, $skillId): void
    {
        $candidate->skills()->detach($skillId);
    }
}
