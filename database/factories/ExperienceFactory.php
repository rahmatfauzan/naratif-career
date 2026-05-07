<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Experience>
 */
class ExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isCurrent = $this->faker->boolean(20);
        $startDate = $this->faker->dateTimeBetween('-5 years', '-1 year');

        return [
            'candidate_id' => Candidate::factory(),
            'company_name' => $this->faker->company(),
            'position' => $this->faker->jobTitle(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $isCurrent ? null : $this->faker->dateTimeBetween($startDate, 'now')->format('Y-m-d'),
            'is_current' => $isCurrent,
            'description' => $this->faker->paragraph(),
            'document_id' => null,
        ];
    }
}
