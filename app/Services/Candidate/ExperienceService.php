<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Experience;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ExperienceService
{
    public function __construct(protected CandidateDocumentService $documentService) {}

    public function store(Candidate $candidate, array $data): Experience
    {
        return DB::transaction(function () use ($candidate, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($candidate, $data['file'], 'paklaring', 'documents/experiences');
                $data['document_id'] = $document->id;
            }

            return $candidate->experiences()->create($data);
        });
    }

    public function update(Experience $experience, array $data): Experience
    {
        return DB::transaction(function () use ($experience, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($experience->candidate, $data['file'], 'paklaring', 'documents/experiences');
                $data['document_id'] = $document->id;

                if ($experience->document_id) {
                    $this->documentService->delete($experience->document);
                }
            }

            $experience->update($data);
            return $experience;
        });
    }

    public function destroy(Experience $experience): bool
    {
        return DB::transaction(function () use ($experience) {
            if ($experience->document_id) {
                $this->documentService->delete($experience->document);
            }
            return $experience->delete();
        });
    }
}
