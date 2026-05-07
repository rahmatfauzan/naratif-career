<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Candidate>
 */
class CandidateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Atau bisa di-override saat seeding
            'phone' => $this->faker->phoneNumber(),
            'avatar_url' => null,
            'date_of_birth' => $this->faker->dateTimeBetween('-40 years', '-20 years')->format('Y-m-d'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'nik' => $this->faker->numerify('################'),
            'linkedin_url' => 'https://linkedin.com/in/' . $this->faker->userName(),
            'portfolio_url' => $this->faker->url(),
            'summary' => $this->faker->paragraph(),
            'profile_completeness' => $this->faker->numberBetween(50, 100),
            'profile_level' => $this->faker->numberBetween(1, 5),
            'status' => $this->faker->randomElement(['active', 'hired', 'rejected']),
        ];
    }
}
