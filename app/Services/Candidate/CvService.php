<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CvService
{
    public function __construct(private CandidateDocumentService $documentService) {}

    public function uploadCv(Candidate $candidate, UploadedFile $file)
    {
        // Limit max 3 CVs
        $cvCount = $candidate->documents()->where('document_type', 'cv')->count();
        if ($cvCount >= 3) {
            throw new \Exception('Maksimal 3 CV yang dapat diunggah.');
        }

        $document = $this->documentService->upload($candidate, $file, 'cv', 'documents/cvs');

        // Jika belum ada CV utama, jadikan ini sebagai CV utama
        if (!$candidate->default_cv_id) {
            $candidate->update(['default_cv_id' => $document->id]);
        }

        return $document;
    }

    public function setPrimaryCv(Candidate $candidate, int $documentId)
    {
        $document = $candidate->documents()->where('document_type', 'cv')->findOrFail($documentId);
        $candidate->update(['default_cv_id' => $document->id]);
    }

    public function deleteCv(Candidate $candidate, int $documentId)
    {
        $document = $candidate->documents()->where('document_type', 'cv')->findOrFail($documentId);

        $this->documentService->delete($document);

        // Jika yang dihapus adalah CV utama, set ulang ke CV lain jika ada
        if ($candidate->default_cv_id === $documentId) {
            $anotherCv = $candidate->documents()->where('document_type', 'cv')->first();
            $candidate->update(['default_cv_id' => $anotherCv ? $anotherCv->id : null]);
        }
    }
}
