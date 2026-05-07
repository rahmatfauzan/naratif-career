<?php

namespace App\Services\Job;

use App\Enums\JobLocation;
use App\Enums\JobType;
use App\Models\Department;
use App\Models\JobPost;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Builder;

class JobDiscoveryService
{
    public function getJobCatalog(array $filters = [], int $limit = 4)
    {
        $jobs = JobPost::query()
            ->select('id', 'title', 'slug', 'department_id', 'type', 'location')
            ->with(['department:id,name,slug', 'skills:id,name,slug'])
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('deadline', '>=', now())
                    ->orWhereNull('deadline');
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->take($limit)
            ->get();
        return $jobs;
    }

    public function getExploreJobs(array $filters = [], int $limit = 12)
    {
        return $this->basePublishedQuery()
            ->select('id', 'title', 'slug', 'department_id', 'type', 'location', 'salary', 'deadline', 'experience_level', 'created_at')
            ->with([
                'department:id,name,slug',
                'skills:id,name,slug'
            ])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', '%' . $search . '%')
                        ->orWhereHas('department', function ($deptQuery) use ($search) {
                            $deptQuery->where('name', 'ilike', '%' . $search . '%');
                        });
                });
            })
            ->when($filters['department_id'] ?? null, function ($query, $departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->when($filters['skill_ids'] ?? null, function ($query, $skillIds) {
                $query->whereHas('skills', function ($skillQuery) use ($skillIds) {
                    $skillQuery->whereIn('skills.id', $skillIds);
                });
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($filters['location'] ?? null, function ($query, $location) {
                $query->where('location', $location);
            })
            ->when($filters['sort'] ?? null, function ($query, $sort) {
                match ($sort) {
                    'salary_high'       => $query->orderBy('salary', 'desc'),
                    'salary_low'        => $query->orderBy('salary', 'asc'),
                    'deadline_closest'  => $query->orderBy('deadline', 'asc'),
                    'deadline_furthest' => $query->orderBy('deadline', 'desc'),
                    'oldest'            => $query->oldest(),
                    default             => $query->latest(),
                };
            }, function ($query) {
                $query->latest();
            })
            ->paginate($limit)
            ->withQueryString();
    }

    public function getExploreFilters(): array
    {
        $departmentIds = $this->basePublishedQuery()
            ->select('department_id')
            ->distinct()
            ->pluck('department_id');

        $departments = Department::query()
            ->select('id', 'name', 'slug')
            ->whereIn('id', $departmentIds)
            ->orderBy('name')
            ->get();

        $skills = Skill::query()
            ->select('skills.id', 'skills.name', 'skills.slug')
            ->whereExists(function ($query) {
                $query->selectRaw('1')
                    ->from('job_skills')
                    ->join('job_posts', 'job_posts.id', '=', 'job_skills.job_post_id')
                    ->whereColumn('job_skills.skill_id', 'skills.id')
                    ->where('job_posts.status', 'published')
                    ->where(function ($deadlineQuery) {
                        $deadlineQuery->where('job_posts.deadline', '>=', now())
                            ->orWhereNull('job_posts.deadline');
                    });
            })
            ->orderBy('skills.name')
            ->get();

        $jobTypes = collect(JobType::options())
            ->map(fn(array $type) => [
                'id' => $type['value'],
                'name' => $type['label'],
            ])
            ->values();

        $locations = collect(JobLocation::options())
            ->map(fn(array $location) => [
                'id' => $location['value'],
                'name' => $location['label'],
            ])
            ->values();

        return [
            'departments' => $departments,
            'skills' => $skills,
            'jobTypes' => $jobTypes,
            'locations' => $locations,
        ];
    }

    public function getSimilarJobs(int $jobId, int $departmentId, int $limit = 4)
    {
        return JobPost::query()
            ->select('id', 'title', 'slug', 'department_id', 'type', 'location', 'salary', 'experience_level', 'created_at')
            ->with([
                'department:id,name,slug',
                'skills:id,name,slug'
            ])
            ->where('id', '!=', $jobId)
            ->where('department_id', $departmentId)
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('deadline', '>=', now())
                    ->orWhereNull('deadline');
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getJobDetail(string $slug)
    {
        return JobPost::query()
            ->select(
                'id',
                'title',
                'slug',
                'department_id',
                'type',
                'location',
                'salary',
                'description',
                'requirements',
                'nice_to_have',
                'benefits',
                'experience_level',
                'team_size',
                'deadline',
                'created_at'
            )
            ->with([
                'department:id,name,slug',
                'skills:id,name,slug'
            ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('deadline', '>=', now())
                    ->orWhereNull('deadline');
            })
            ->firstOrFail();
    }

    private function basePublishedQuery(): Builder
    {
        return JobPost::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('deadline', '>=', now())
                    ->orWhereNull('deadline');
            });
    }
}
