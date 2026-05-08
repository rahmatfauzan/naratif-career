<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Services\Candidate\CvService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CvController extends Controller
{
    public function __construct(private CvService $cvService) {}

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120'], // Max 5MB PDF
        ], [
            'file.mimes' => 'CV harus berformat PDF.',
            'file.max' => 'Ukuran CV maksimal 5MB.',
            'file.required' => 'File CV wajib diunggah.',
        ]);

        try {
            $this->cvService->uploadCv($request->user()->candidate, $request->file('file'));
            return Redirect::back()->with('success', 'CV berhasil diunggah.');
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['file' => $e->getMessage()]);
        }
    }

    public function setPrimary(Request $request, $cv)
    {
        $this->cvService->setPrimaryCv($request->user()->candidate, $cv);
        return Redirect::back()->with('success', 'CV utama berhasil diatur.');
    }

    public function destroy(Request $request, $cv)
    {
        $this->cvService->deleteCv($request->user()->candidate, $cv);
        return Redirect::back()->with('success', 'CV berhasil dihapus.');
    }
}
