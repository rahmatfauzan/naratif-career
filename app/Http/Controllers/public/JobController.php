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
        $filters['skill_ids'] = collect(explode(',', (string) ($filters['skill_id'] ?? '')))
            ->filter(fn($id) => is_numeric($id))
            ->map(fn($id) => (int) $id)
            ->values()
            ->all();

        $jobs = $service->getExploreJobs($filters);
        $filterOptions = $service->getExploreFilters();

        return Inertia::render('Public/explore', [
            'jobs' => $jobs,
            'departments' => $filterOptions['departments'],
            'skills' => $filterOptions['skills'],
            'jobTypes' => $filterOptions['jobTypes'],
            'locations' => $filterOptions['locations'],
            'filters' => $filters,
        ]);
    }

    public function show(string $slug, JobDiscoveryService $service): Response
    {
        $job = $service->getJobDetail($slug);

        $similarJobs = $service->getSimilarJobs($job->id, $job->department_id);

        return Inertia::render('Public/jobDetail', [
            'job' => $job,
            'relatedJobs' => $similarJobs,
        ]);
    }
}
