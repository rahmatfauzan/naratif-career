<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ExploreJobRequest;
use App\Services\Job\JobDiscoveryService;
use Illuminate\Support\Facades\Auth;
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

        // Memuat relasi jobQuestions secara manual karena kita tidak menyimpannya di select bawaan getJobDetail
        $job->load('jobQuestions');

        $similarJobs = $service->getSimilarJobs($job->id, $job->department_id);

        $authCandidate = null;
        if (Auth::check() && Auth::user()->candidate) {
            // Ubah 'cvs' menjadi 'documents' lalu filter hanya tipe 'cv'
            $authCandidate = Auth::user()->candidate->load(['documents' => function ($query) {
                $query->where('document_type', 'cv');
            }]);

            // Memetakan documents ke properti 'cvs' untuk frontend
            $authCandidate->cvs = $authCandidate->documents;

            // Menambahkan informasi apakah kandidat sudah melamar
            $job->has_applied = \App\Models\JobApplication::where('job_post_id', $job->id)
                ->where('candidate_id', $authCandidate->id)
                ->exists();
        }

        return Inertia::render('Public/jobDetail', [
            'job' => $job,
            'relatedJobs' => $similarJobs,
            'authCandidate' => $authCandidate,
        ]);
    }
}
