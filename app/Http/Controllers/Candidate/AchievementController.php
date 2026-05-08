<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\AchievementRequest;
use App\Models\Achievement;
use App\Services\Candidate\AchievementService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function __construct(protected AchievementService $service) {}

    public function store(AchievementRequest $request): RedirectResponse
    {
        $candidate = $request->user()->candidate ?? $request->user()->candidate()->create();
        $this->service->store($candidate, $request->validated());
        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pencapaian berhasil ditambahkan.',
        ]);

        return back();
    }

    public function update(AchievementRequest $request, Achievement $achievement): RedirectResponse
    {
        $this->service->update($achievement, $request->validated());
        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pencapaian berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(Achievement $achievement): RedirectResponse
    {
        $this->service->destroy($achievement);
        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pencapaian berhasil dihapus.',
        ]);

        return back();
    }
}
