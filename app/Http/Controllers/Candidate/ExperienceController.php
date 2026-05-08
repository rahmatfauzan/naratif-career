<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\ExperienceRequest;
use App\Models\Experience;
use App\Services\Candidate\ExperienceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function __construct(protected ExperienceService $service) {}

    public function store(ExperienceRequest $request): RedirectResponse
    {
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();
        $this->service->store($candidate, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengalaman kerja berhasil ditambahkan.',
        ]);

        return back();
    }

    public function update(ExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $this->service->update($experience, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengalaman kerja berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        $this->service->destroy($experience);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengalaman kerja berhasil dihapus.',
        ]);

        return back();
    }
}
