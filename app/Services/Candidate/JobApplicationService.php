<?php

namespace App\Services\Candidate;

use App\Models\JobPost;
use App\Models\JobApplication;
use App\Models\CandidateDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JobApplicationService
{
    /**
     * @throws ValidationException
     */
    public function apply(JobPost $jobPost, array $data): JobApplication
    {
        $candidate = auth()->user()->candidate;

        // Validasi duplikasi lamaran
        $hasApplied = JobApplication::where('job_post_id', $jobPost->id)
            ->where('candidate_id', $candidate->id)
            ->exists();

        if ($hasApplied) {
            throw ValidationException::withMessages([
                'job_post_id' => 'Anda sudah melamar untuk lowongan ini.'
            ]);
        }

        // Ambil stage pertama dari pipeline loker ini
        $firstStage = null;
        if ($jobPost->pipeline) {
            $firstStage = $jobPost->pipeline->stages()->orderBy('order')->first();
        }

        // Validasi kepemilikan CV
        $cv = CandidateDocument::where('id', $data['cv_document_id'])
            ->where('candidate_id', $candidate->id)
            ->first();

        if (!$cv) {
            throw ValidationException::withMessages([
                'cv_document_id' => 'Dokumen CV tidak ditemukan atau bukan milik Anda.'
            ]);
        }

        return DB::transaction(function () use ($jobPost, $candidate, $firstStage, $data) {
            // 1. Simpan Job Application
            $application = JobApplication::create([
                'job_post_id' => $jobPost->id,
                'candidate_id' => $candidate->id,
                'current_stage_id' => $firstStage ? $firstStage->id : null,
                'cv_document_id' => $data['cv_document_id'],
                'internal_notes' => $data['cover_letter'] ?? null, // Menyimpan cover letter sementara di internal notes jika tidak ada kolom khusus
            ]);

            // 2. Simpan Jawaban Pertanyaan (jika ada)
            if (!empty($data['answers'])) {
                foreach ($data['answers'] as $answerData) {
                    $answerPayload = [
                        'job_question_id' => $answerData['job_question_id'],
                        'answer_text' => $answerData['answer_text'] ?? null,
                    ];

                    // Jika jawaban berupa file, kita perlu mengunggahnya
                    // Karena tabel job_application_answers mendukung candidate_document_id,
                    // kita bisa upload file tersebut sebagai dokumen kandidat bertipe 'other'
                    if (isset($answerData['file']) && $answerData['file'] instanceof \Illuminate\Http\UploadedFile) {
                        $file = $answerData['file'];
                        $path = $file->store('candidate_documents', 'local');
                        
                        $document = CandidateDocument::create([
                            'candidate_id' => $candidate->id,
                            'document_type' => 'other',
                            'document_name' => 'Attachment: ' . $file->getClientOriginalName(),
                            'file_path' => $path,
                            'file_type' => $file->getClientMimeType(),
                            'file_size' => $file->getSize(),
                        ]);

                        $answerPayload['candidate_document_id'] = $document->id;
                    }

                    $application->answers()->create($answerPayload);
                }
            }

            return $application;
        });
    }
}
