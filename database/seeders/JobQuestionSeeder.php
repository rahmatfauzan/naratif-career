<?php

namespace Database\Seeders;

use App\Models\JobPost;
use App\Models\JobQuestion;
use Illuminate\Database\Seeder;

class JobQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil job post pertama sebagai contoh, jika tidak ada, buat dummy
        $jobPost = JobPost::first();

        if (!$jobPost) {
            $this->command->warn('Tidak ada Job Post yang ditemukan. Membuat satu dummy job post...');
            $jobPost = JobPost::factory()->create([
                'title' => 'Software Engineer (Dummy)',
            ]);
        }

        // 1. Pertanyaan tipe TEXT (Esai Singkat)
        JobQuestion::create([
            'job_post_id' => $jobPost->id,
            'question'    => 'Mengapa Anda tertarik untuk melamar di perusahaan kami?',
            'type'        => 'text',
            'options'     => null,
            'is_required' => true,
        ]);

        // 2. Pertanyaan tipe BOOLEAN (Ya/Tidak)
        JobQuestion::create([
            'job_post_id' => $jobPost->id,
            'question'    => 'Apakah Anda bersedia untuk bekerja di bawah tekanan dan lembur jika diperlukan?',
            'type'        => 'boolean',
            'options'     => null,
            'is_required' => true,
        ]);

        // 3. Pertanyaan tipe MULTIPLE CHOICE (Pilihan Ganda)
        JobQuestion::create([
            'job_post_id' => $jobPost->id,
            'question'    => 'Bahasa pemrograman apa yang paling Anda kuasai?',
            'type'        => 'multiple_choice',
            'options'     => [
                'PHP / Laravel',
                'JavaScript / React / Vue',
                'Python / Django',
                'Java / Spring',
                'Lainnya'
            ],
            'is_required' => true,
        ]);

        // 4. Pertanyaan tipe FILE (Upload Dokumen - Contoh SIM C)
        JobQuestion::create([
            'job_post_id' => $jobPost->id,
            'question'    => 'Silakan unggah scan SIM C Anda (opsional, nilai plus).',
            'type'        => 'file',
            'options'     => [
                'allowed_types' => ['jpg', 'jpeg', 'png', 'pdf'],
                'max_size_mb' => 2
            ],
            'is_required' => false,
        ]);

        $this->command->info('Job Question Seeder berhasil dijalankan untuk Job ID: ' . $jobPost->id);
    }
}
