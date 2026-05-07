<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = ['Laravel', 'React', 'Inertia.js', 'PostgreSQL', 'Tailwind CSS', 'Go', 'Figma', 'SEO'];

        foreach ($skills as $skill) {
            Skill::create([
                'name' => $skill,
                'slug' => Str::slug($skill),
            ]);
        }
    }
}
