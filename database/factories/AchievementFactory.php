<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Achievement>
 */
class AchievementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'candidate_id' => Candidate::factory(),
            'title' => $this->faker->sentence(3),
            'issuer' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'date' => $this->faker->date('Y-m-d'),
            'document_id' => null,
        ];
    }
}
