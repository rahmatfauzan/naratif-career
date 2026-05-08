<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\UpdateProfileRequest;
use App\Services\Candidate\CandidateService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(protected CandidateService $service)
    {
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $this->service->updateProfile($request->user(), $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil berhasil diperbarui.',
        ]);

        return to_route('profile.index');
    }
}
