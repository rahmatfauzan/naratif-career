<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\CandidateAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CandidateAddress>
 */
class CandidateAddressFactory extends Factory
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
            'region_code' => $this->faker->numerify('##.##.##.####'),
            'full_address' => $this->faker->address(),
            'postal_code' => $this->faker->postcode(),
        ];
    }
}
