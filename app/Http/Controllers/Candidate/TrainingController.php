<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\TrainingRequest;
use App\Models\Training;
use App\Services\Candidate\TrainingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function __construct(protected TrainingService $service) {}

    public function store(TrainingRequest $request): RedirectResponse
    {
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();
        $this->service->store($candidate, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pelatihan berhasil ditambahkan.',
        ]);

        return back();
    }

    public function update(TrainingRequest $request, Training $training): RedirectResponse
    {
        $this->service->update($training, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pelatihan berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(Training $training): RedirectResponse
    {
        $this->service->destroy($training);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Riwayat pelatihan berhasil dihapus.',
        ]);

        return back();
    }
}
