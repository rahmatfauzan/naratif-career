<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Skill;
use App\Models\JobPost;
use App\Models\Pipeline;
use App\Models\Department;
use Illuminate\Database\Seeder;

class JobPostSeeder extends Seeder
{
    public function run(): void
    {
        $hr = User::where('email', 'hr@ats.com')->first();
        $department = Department::where('name', 'Engineering')->first();
        $pipeline = Pipeline::where('slug', 'standard-tech-recruitment')->first();
        // Buat 500 data JobPost menggunakan Factory, timpa Foreign Key dengan data yang valid
        JobPost::factory(500)->create([
            'department_id' => $department->id,
            'pipeline_id' => $pipeline->id,
            'created_by' => $hr->id,
        ])->each(function ($job) {
            // Ambil 3 skill secara acak untuk setiap pekerjaan
            $randomSkills = Skill::inRandomOrder()->take(3)->pluck('id');
            // Attach skill random ke setiap Job Post dengan timestamps
            $job->skills()->attach($randomSkills);
        });
    }
}
