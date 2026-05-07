<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Certification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Certification>
 */
class CertificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issuedDate = $this->faker->dateTimeBetween('-3 years', 'now');
        $expiredDate = $this->faker->boolean(70) ? clone $issuedDate->modify('+3 years') : null;

        return [
            'candidate_id' => Candidate::factory(),
            'name' => $this->faker->words(3, true) . ' Certification',
            'issuer' => $this->faker->company(),
            'credential_id' => strtoupper($this->faker->bothify('CERT-####-????')),
            'credential_url' => $this->faker->url(),
            'issued_date' => $issuedDate->format('Y-m-d'),
            'expired_date' => $expiredDate ? $expiredDate->format('Y-m-d') : null,
            'document_id' => null,
        ];
    }
}
