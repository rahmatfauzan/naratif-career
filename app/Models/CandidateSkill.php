<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CandidateSkill extends Pivot
{
    protected $table = 'candidate_skills';

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
