<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\JobController;
use Illuminate\Support\Facades\Route;

// Route::get('/', [HomeController::class, 'index'])->name('public.home');
Route::get('/', [HomeController::class, 'index'])->name('home');

// Rute Pencarian & Detail Job
Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'explore'])->name('public.jobs.explore');
    Route::get('/{slug}', [JobController::class, 'show'])->name('public.jobs.show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
