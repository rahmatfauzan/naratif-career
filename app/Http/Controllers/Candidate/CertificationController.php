<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\CertificationRequest;
use App\Models\Certification;
use App\Services\Candidate\CertificationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CertificationController extends Controller
{
    public function __construct(protected CertificationService $service)
    {
    }

    public function store(CertificationRequest $request): RedirectResponse
    {
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();
        $this->service->store($candidate, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sertifikasi berhasil ditambahkan.',
        ]);

        return back();
    }

    public function update(CertificationRequest $request, Certification $certification): RedirectResponse
    {
        $this->service->update($certification, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sertifikasi berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(Certification $certification): RedirectResponse
    {
        $this->service->destroy($certification);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sertifikasi berhasil dihapus.',
        ]);

        return back();
    }
}
