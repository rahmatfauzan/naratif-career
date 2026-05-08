<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            DepartmentSeeder::class,
            SkillSeeder::class,
            PipelineSeeder::class,
            JobPostSeeder::class,
            CandidateSeeder::class,
            JobQuestionSeeder::class,
        ]);
    }
}
