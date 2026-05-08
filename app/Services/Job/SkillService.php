<?php

namespace App\Services\Job;

use App\Models\Skill;

class SkillService
{
    public function getSkills($search = null)
    {
        return \App\Models\Skill::when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
            ->limit(20) // Batasi misal 20 hasil teratas biar JSON nggak bengkak
            ->get();
    }
}
