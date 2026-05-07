<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Education;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Education>
 */
class EducationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = $this->faker->year();
        return [
            'candidate_id' => Candidate::factory(),
            'school_name' => $this->faker->company() . ' University',
            'degree' => $this->faker->randomElement(['SMA', 'SMK', 'D3', 'S1', 'S2']),
            'field_of_study' => $this->faker->randomElement(['Computer Science', 'Information Technology', 'Business', 'Design']),
            'start_year' => $startYear,
            'end_year' => $startYear + 4,
            'gpa' => $this->faker->randomFloat(2, 2.5, 4.0),
            'max_gpa' => 4.00,
        ];
    }
}
