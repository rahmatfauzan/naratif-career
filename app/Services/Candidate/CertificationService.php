<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Certification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CertificationService
{
    public function __construct(protected CandidateDocumentService $documentService) {}

    public function store(Candidate $candidate, array $data): Certification
    {
        return DB::transaction(function () use ($candidate, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($candidate, $data['file'], 'certification', 'documents/certifications');
                $data['document_id'] = $document->id;
            }

            return $candidate->certifications()->create($data);
        });
    }

    public function update(Certification $certification, array $data): Certification
    {
        return DB::transaction(function () use ($certification, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($certification->candidate, $data['file'], 'certification', 'documents/certifications');
                $data['document_id'] = $document->id;

                if ($certification->document_id) {
                    $this->documentService->delete($certification->document);
                }
            }

            $certification->update($data);
            return $certification;
        });
    }

    public function destroy(Certification $certification): bool
    {
        return DB::transaction(function () use ($certification) {
            if ($certification->document_id) {
                $this->documentService->delete($certification->document);
            }
            return $certification->delete();
        });
    }
}
