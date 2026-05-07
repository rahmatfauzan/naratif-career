<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\CandidateDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CandidateDocument>
 */
class CandidateDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['cv', 'cover_letter', 'id_card', 'paklaring', 'certificate'];
        $type = $this->faker->randomElement($types);
        
        return [
            'candidate_id' => Candidate::factory(),
            'document_type' => $type,
            'file_path' => 'documents/' . $this->faker->uuid() . '.pdf',
            'file_name' => ucfirst($type) . '_' . $this->faker->word() . '.pdf',
        ];
    }
}
