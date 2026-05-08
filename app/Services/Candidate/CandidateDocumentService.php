<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\CandidateDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CandidateDocumentService
{
    /**
     * Upload a file and create a CandidateDocument record.
     */
    public function upload(Candidate $candidate, UploadedFile $file, string $type, string $folder): CandidateDocument
    {
        // Simpan file ke disk 'local' agar tidak bisa diakses langsung via URL publik
        $filePath = $file->store($folder, 'local');

        return $candidate->documents()->create([
            'document_type' => $type,
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
        ]);
    }

    /**
     * Delete the document file from storage and remove its record.
     */
    public function delete(?CandidateDocument $document): void
    {
        if ($document && $document->file_path) {
            // Hapus dari disk 'local' (atau 'public' jika file lama)
            if (Storage::disk('local')->exists($document->file_path)) {
                Storage::disk('local')->delete($document->file_path);
            } elseif (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }
            
            $document->delete();
        }
    }
}
