<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\Candidate\CandidateService;
use App\Services\Job\SkillService;
use App\Services\Job\LanguageService;

class ProfileController extends Controller
{
    public function __construct(
        protected CandidateService $candidateService, 
        protected SkillService $skillService,
        protected LanguageService $languageService
    ) {}

    /**
     * Show the user's profile display page.
     */
    public function index(Request $request): Response
    {
        $candidateProfile = $this->candidateService
            ->getCompleteProfile($request->user());

        $regionCode = $candidateProfile?->address?->region_code;

        $regionData = $this->candidateService
            ->getRegionData($regionCode);

        return Inertia::render('settings/profile/index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,

            'status' => $request->session()->get('status'),

            'candidateProfile' => $candidateProfile,

            'regionData' => $regionData,

            // deferred
            'skills' => Inertia::defer(
                fn() =>
                $this->skillService->getSkills()
            ),
            'languages' => Inertia::defer(
                fn() =>
                $this->languageService->getLanguages()
            ),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.index');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
