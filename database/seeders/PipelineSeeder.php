<?php

namespace Database\Seeders;

use App\Models\Pipeline;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class PipelineSeeder extends Seeder
{
    public function run(): void
    {
        $pipeline = Pipeline::create([
            'name' => 'Standard Tech Recruitment',
            'slug' => Str::slug('Standard Tech Recruitment'),
            'description' => 'Pipeline default untuk posisi engineering dan tech.',
        ]);

        $stages = [
            ['name' => 'Screening CV', 'type' => 'screening', 'order' => 1, 'is_final' => false, 'description' => 'Our team reviews your application and portfolio.', 'duration' => '1–2 hari kerja'],
            ['name' => 'Technical Test', 'type' => 'assessment', 'order' => 2, 'is_final' => false, 'description' => 'Take-home assignment (~3 jam) untuk menguji kemampuan teknis.', 'duration' => '3–5 hari kerja'],
            ['name' => 'User Interview', 'type' => 'interview', 'order' => 3, 'is_final' => false, 'description' => 'Sesi diskusi 60 menit bersama Engineering Manager dan satu rekan tim.', 'duration' => '1 minggu'],
            ['name' => 'Final Interview', 'type' => 'interview', 'order' => 4, 'is_final' => false, 'description' => 'Percakapan kultur dan visi bersama Head of Engineering.', 'duration' => '3–5 hari kerja'],
            ['name' => 'Offering', 'type' => 'offer', 'order' => 5, 'is_final' => true, 'description' => 'Penawaran kerja resmi dikirimkan.', 'duration' => '2–3 hari kerja'],
        ];

        foreach ($stages as $stageData) {
            $stage = $pipeline->stages()->create($stageData);

            // Menambahkan kriteria penilaian pada tahap tertentu
            if ($stageData['type'] === 'interview') {
                $stage->criteria()->createMany([
                    ['name' => 'Problem Solving', 'weight' => 40],
                    ['name' => 'Communication', 'weight' => 30],
                    ['name' => 'Culture Fit', 'weight' => 30],
                ]);
            }
        }
    }
}
