<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Education;

class EducationService
{
    public function store(Candidate $candidate, array $data): Education
    {
        return $candidate->educations()->create($data);
    }

    public function update(Education $education, array $data): Education
    {
        $education->update($data);
        return $education;
    }

    public function destroy(Education $education): bool
    {
        return $education->delete();
    }
}
