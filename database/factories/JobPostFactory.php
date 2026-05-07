<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Pipeline;
use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobPostFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->jobTitle();

        return [
            'title' => $title,

            'slug' => Str::slug($title . '-' . Str::random(5)),

            'department_id' => Department::inRandomOrder()->value('id'),

            'pipeline_id' => Pipeline::inRandomOrder()->value('id'),

            'created_by' => User::inRandomOrder()->value('id'),

            'type' => $this->faker->randomElement([
                'full-time',
                'part-time',
                'contract',
                'internship',
                'freelance',
            ]),

            'location' => $this->faker->randomElement([
                'onsite',
                'remote',
                'hybrid',
            ]),

            'salary' => $this->faker->numberBetween(5000000, 15000000),

            // longText biasa
            'description' => $this->faker->paragraphs(4, true),

            // array JSON
            'requirements' => [
                'Laravel',
                'REST API',
                'MySQL',
                'Git',
            ],

            'nice_to_have' => [
                'Docker',
                'Redis',
                'AWS',
            ],

            'benefits' => [
                'Remote Working',
                'BPJS Kesehatan',
                'THR',
                'Laptop Support',
            ],

            'experience_level' => $this->faker->randomElement([
                'Entry Level',
                'Mid Level',
                'Senior Level',
                'Lead',
            ]),

            'deadline' => $this->faker
                ->dateTimeBetween('now', '+2 months')
                ->format('Y-m-d'),

            'status' => $this->faker->randomElement([
                'draft',
                'published',
                'closed',
            ]),

            'headcount_target' => $this->faker->numberBetween(1, 5),

            'headcount_filled' => 0,

            'team_size' => $this->faker->numberBetween(5, 50),
        ];
    }
}
