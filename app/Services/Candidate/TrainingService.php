<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Training;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class TrainingService
{
    public function __construct(protected CandidateDocumentService $documentService)
    {
    }

    public function store(Candidate $candidate, array $data): Training
    {
        return DB::transaction(function () use ($candidate, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($candidate, $data['file'], 'training', 'documents/trainings');
                $data['document_id'] = $document->id;
            }

            return $candidate->trainings()->create($data);
        });
    }

    public function update(Training $training, array $data): Training
    {
        return DB::transaction(function () use ($training, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($training->candidate, $data['file'], 'training', 'documents/trainings');
                $data['document_id'] = $document->id;

                if ($training->document_id) {
                    $this->documentService->delete($training->document);
                }
            }

            $training->update($data);
            return $training;
        });
    }

    public function destroy(Training $training): bool
    {
        return DB::transaction(function () use ($training) {
            if ($training->document_id) {
                $this->documentService->delete($training->document);
            }
            return $training->delete();
        });
    }
}
