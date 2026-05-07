<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Training;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Training>
 */
class TrainingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-2 years', '-1 month');
        return [
            'candidate_id' => Candidate::factory(),
            'title' => 'Training ' . $this->faker->words(2, true),
            'institution' => $this->faker->company() . ' Academy',
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $this->faker->dateTimeBetween($startDate, '+1 month')->format('Y-m-d'),
            'description' => $this->faker->paragraph(),
            'document_id' => null,
        ];
    }
}
