<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;

// Controllers for Candidate Profile Management
use App\Http\Controllers\Candidate\ProfileController as CandidateProfileController;
use App\Http\Controllers\Candidate\EducationController;
use App\Http\Controllers\Candidate\ExperienceController;
use App\Http\Controllers\Candidate\CandidateSkillController;
use App\Http\Controllers\Candidate\CandidateLanguageController;
use App\Http\Controllers\Candidate\AchievementController;
use App\Http\Controllers\Candidate\TrainingController;
use App\Http\Controllers\Candidate\CertificationController;
use App\Http\Controllers\Candidate\CvController;

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    // Existing core user profile setting
    Route::get('settings/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    // --- CANDIDATE PROFILE MANAGEMENT ROUTES ---
    Route::prefix('settings/candidate')->name('candidate.')->group(function () {

        // 1. Basic Profile & Address
        Route::patch('profile', [CandidateProfileController::class, 'update'])->name('profile.update');

        // 2. Educations
        Route::post('educations', [EducationController::class, 'store'])->name('educations.store');
        Route::patch('educations/{education}', [EducationController::class, 'update'])->name('educations.update');
        Route::delete('educations/{education}', [EducationController::class, 'destroy'])->name('educations.destroy');

        // 3. Experiences
        Route::post('experiences', [ExperienceController::class, 'store'])->name('experiences.store');
        Route::post('experiences/{experience}', [ExperienceController::class, 'update'])->name('experiences.update'); // Using POST for file uploads
        Route::delete('experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');

        // 4. Skills & Languages
        Route::patch('skills', [CandidateSkillController::class, 'update'])->name('skills.update');
        Route::post('skills', [CandidateSkillController::class, 'store'])->name('skills.store');
        Route::delete('skills/{skill}', [CandidateSkillController::class, 'destroy'])->name('skills.destroy');

        Route::patch('languages', [CandidateLanguageController::class, 'update'])->name('languages.update');
        Route::post('languages', [CandidateLanguageController::class, 'store'])->name('languages.store');
        Route::delete('languages/{language}', [CandidateLanguageController::class, 'destroy'])->name('languages.destroy');
        // 5. Achievements
        Route::post('achievements', [AchievementController::class, 'store'])->name('achievements.store');
        Route::post('achievements/{achievement}', [AchievementController::class, 'update'])->name('achievements.update'); // Using POST for file uploads
        Route::delete('achievements/{achievement}', [AchievementController::class, 'destroy'])->name('achievements.destroy');

        // 6. Trainings
        Route::post('trainings', [TrainingController::class, 'store'])->name('trainings.store');
        Route::post('trainings/{training}', [TrainingController::class, 'update'])->name('trainings.update'); // Using POST for file uploads
        Route::delete('trainings/{training}', [TrainingController::class, 'destroy'])->name('trainings.destroy');

        // 7. Certifications
        Route::post('certifications', [CertificationController::class, 'store'])->name('certifications.store');
        Route::post('certifications/{certification}', [CertificationController::class, 'update'])->name('certifications.update'); // Using POST for file uploads
        Route::delete('certifications/{certification}', [CertificationController::class, 'destroy'])->name('certifications.destroy');

        // 8. CV / Resumes
        Route::post('cvs', [CvController::class, 'store'])->name('cvs.store');
        Route::patch('cvs/{cv}/primary', [CvController::class, 'setPrimary'])->name('cvs.primary');
        Route::delete('cvs/{cv}', [CvController::class, 'destroy'])->name('cvs.destroy');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
