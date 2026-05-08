<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateDocument;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Menampilkan atau mengunduh dokumen secara aman.
     */
    public function show(CandidateDocument $document)
    {
        $user = Auth::user();

        // Otorisasi:
        // 1. Apakah user ini adalah pemilik dokumen?
        // (Nantinya Anda bisa menambahkan kondisi: OR $user->role === 'admin' OR $user->isRecruiterOf($candidate))
        if ($document->candidate->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke dokumen ini.');
        }

        // Cek apakah file ada di disk 'local' (Private)
        if (Storage::disk('local')->exists($document->file_path)) {
            return response()->file(Storage::disk('local')->path($document->file_path));
        }

        // Fallback: Jika file tersebut diunggah sebelum sistem private dibuat (masih di public)
        if (Storage::disk('public')->exists($document->file_path)) {
            return response()->file(Storage::disk('public')->path($document->file_path));
        }

        abort(404, 'Dokumen tidak ditemukan di server.');
    }
}
