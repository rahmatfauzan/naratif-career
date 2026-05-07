<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Enums\JobType;
use App\Services\Job\JobDiscoveryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Menampilkan Landing Page.
     */
    public function index(Request $request, JobDiscoveryService $service): Response
    {
        $type = $request->query('type');
        $allowedTypes = array_map(fn(JobType $jobType) => $jobType->value, JobType::cases());

        $selectedType = in_array($type, $allowedTypes, true) ? $type : null;
        $featuredJobs = $service->getJobCatalog([
            'type' => $selectedType,
        ]);

        return Inertia::render('Public/index', [
            'featuredJobs' => $featuredJobs,
            'jobType' => $selectedType ?? 'all',
        ]);
    }
}
