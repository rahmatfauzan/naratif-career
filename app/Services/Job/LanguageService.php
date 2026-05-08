<?php

namespace App\Services\Job;

use App\Models\Language;

class LanguageService
{
    public function getLanguages($search = null)
    {
        return Language::when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
            ->limit(20)
            ->get();
    }
}
