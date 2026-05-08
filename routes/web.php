<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\JobController;
use App\Http\Controllers\Public\LanguageController;
use App\Http\Controllers\public\SkillController;
use App\Http\Controllers\Candidate\DocumentController;
use App\Http\Controllers\Candidate\JobApplicationController;
use Illuminate\Support\Facades\Route;

// Route::get('/', [HomeController::class, 'index'])->name('public.home');
Route::get('/', [HomeController::class, 'index'])->name('home');

// Rute Pencarian & Detail Job
Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'explore'])->name('public.jobs.explore');
    Route::get('/{slug}', [JobController::class, 'show'])->name('public.jobs.show');
});

// Rute Skill & Language (Public Data)
Route::prefix('skills')->group(function () {
    Route::get('/', [SkillController::class, 'index'])->name('public.skills.index');
});

Route::prefix('languages')->group(function () {
    Route::get('/', [LanguageController::class, 'index'])->name('public.languages.index');
});



Route::middleware(['auth'])->group(function () {
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::post('/jobs/{jobPost}/apply', [JobApplicationController::class, 'store'])->name('candidate.jobs.apply');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/wilayah.php';
