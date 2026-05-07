<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\Language;
use App\Models\Candidate;
use App\Models\Experience;
use App\Models\Achievement;
use App\Models\Training;
use App\Models\Certification;
use App\Models\CandidateDocument;
use App\Models\CandidateAddress;
use App\Models\Education;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada role candidate (opsional jika menggunakan Spatie)
        // Kita akan membuat 20 kandidat

        // Setup Languages
        $languages = ['English', 'Indonesian', 'Mandarin', 'Japanese', 'Spanish'];
        foreach ($languages as $lang) {
            Language::firstOrCreate(['name' => $lang]);
        }
        $languageIds = Language::pluck('id')->toArray();
        $skillIds = Skill::pluck('id')->toArray();

        // Generate Candidates
        Candidate::factory(20)->create()->each(function ($candidate) use ($languageIds, $skillIds) {

            // 1. Buat Dokumen (CV, dll)
            $cv = CandidateDocument::factory()->create([
                'candidate_id' => $candidate->id,
                'document_type' => 'cv'
            ]);

            // Set CV Utama
            $candidate->update(['default_cv_id' => $cv->id]);

            // Buat Alamat Dummy
            CandidateAddress::create([
                'candidate_id' => $candidate->id,
                'region_code' => '31.74.09.1002',
                'postal_code' => '12640',
                'full_address' => 'Jl. Srengseng Sawah Raya No. 1, Jakarta Selatan, Indonesia'
            ]);

            // 2. Buat Edukasi
            Education::factory(rand(1, 2))->create([
                'candidate_id' => $candidate->id
            ]);

            // 3. Buat Pengalaman Kerja
            Experience::factory(rand(1, 3))->create([
                'candidate_id' => $candidate->id
            ]);

            // 4. Buat Achievement, Training, Certification (Opsional)
            if (rand(0, 1)) {
                Achievement::factory(rand(1, 2))->create(['candidate_id' => $candidate->id]);
            }
            if (rand(0, 1)) {
                Training::factory(rand(1, 2))->create(['candidate_id' => $candidate->id]);
            }
            if (rand(0, 1)) {
                Certification::factory(rand(1, 2))->create(['candidate_id' => $candidate->id]);
            }

            // 5. Attach Skills (Pivot)
            if (!empty($skillIds)) {
                $randomSkills = array_rand(array_flip($skillIds), rand(2, 5));
                $randomSkills = is_array($randomSkills) ? $randomSkills : [$randomSkills];

                foreach ($randomSkills as $skillId) {
                    $candidate->skills()->attach($skillId, [
                        'level' => collect(['Beginner', 'Intermediate', 'Advanced', 'Expert'])->random()
                    ]);
                }
            }

            // 6. Attach Languages (Pivot)
            if (!empty($languageIds)) {
                $randomLangs = array_rand(array_flip($languageIds), rand(1, 3));
                $randomLangs = is_array($randomLangs) ? $randomLangs : [$randomLangs];

                foreach ($randomLangs as $langId) {
                    $candidate->languages()->attach($langId, [
                        'proficiency' => collect(['Native', 'Fluent', 'Professional', 'Conversational'])->random()
                    ]);
                }
            }
        });
    }
}
