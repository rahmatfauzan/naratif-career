<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Achievement;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class AchievementService
{
    public function __construct(protected CandidateDocumentService $documentService) {}

    public function store(Candidate $candidate, array $data): Achievement
    {
        return DB::transaction(function () use ($candidate, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($candidate, $data['file'], 'achievement', 'documents/achievements');
                $data['document_id'] = $document->id;
            }

            return $candidate->achievements()->create($data);
        });
    }

    public function update(Achievement $achievement, array $data): Achievement
    {
        return DB::transaction(function () use ($achievement, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $document = $this->documentService->upload($achievement->candidate, $data['file'], 'achievement', 'documents/achievements');
                $data['document_id'] = $document->id;

                if ($achievement->document_id) {
                    $this->documentService->delete($achievement->document);
                }
            }

            $achievement->update($data);
            return $achievement;
        });
    }

    public function destroy(Achievement $achievement): bool
    {
        return DB::transaction(function () use ($achievement) {
            if ($achievement->document_id) {
                $this->documentService->delete($achievement->document);
            }
            return $achievement->delete();
        });
    }
}
