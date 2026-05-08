<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use App\Http\Requests\Candidate\StoreJobApplicationRequest;
use App\Services\Candidate\JobApplicationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class JobApplicationController extends Controller
{
    public function __construct(private JobApplicationService $jobApplicationService) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobApplicationRequest $request, JobPost $jobPost): RedirectResponse
    {
        try {
            $this->jobApplicationService->apply($jobPost, $request->validated());

            return redirect()->back()->with('success', 'Lamaran Anda berhasil dikirim!');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.')->withInput();
        }
    }
}
