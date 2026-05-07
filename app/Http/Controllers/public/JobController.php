<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ExploreJobRequest;
use App\Services\Job\JobDiscoveryService;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    /**
     * Menampilkan halaman Explore Jobs beserta filternya.
     */
    public function explore(ExploreJobRequest $request, JobDiscoveryService $service): Response
    {
        $filters = $request->validated();

        $jobs = $service->getExploreJobs($filters);

        return Inertia::render('Public/Explore', [
            'jobs' => $jobs,
            'filters' => $filters, 
        ]);
    }

    public function show(string $slug, JobDiscoveryService $service): Response
    {
        $job = $service->getJobDetail($slug);

        $similarJobs = $service->getSimilarJobs($job->id, $job->department_id);

        return Inertia::render('Public/JobDetail', [
            'job' => $job,
            'similarJobs' => $similarJobs,
        ]);
    }
}
