<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\EducationRequest;
use App\Models\Education;
use App\Services\Candidate\EducationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function __construct(protected EducationService $service) {}

    public function store(EducationRequest $request): RedirectResponse
    {
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();
        $this->service->store($candidate, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pendidikan berhasil ditambahkan.',
        ]);

        return back();
    }

    public function update(EducationRequest $request, Education $education): RedirectResponse
    {
        $this->service->update($education, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pendidikan berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(Education $education): RedirectResponse
    {
        $this->service->destroy($education);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pendidikan berhasil dihapus.',
        ]);

        return back();
    }
}
