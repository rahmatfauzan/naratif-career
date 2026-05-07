<?php

namespace App\Services\Job;

use App\Models\JobPost;

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
        return JobPost::query()
            ->select('id', 'title', 'slug', 'department_id', 'type', 'location', 'salary', 'deadline', 'experience_level', 'created_at')
            ->with([
                'department:id,name,slug',
                'skills:id,name,slug'
            ])
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('deadline', '>=', now())
                    ->orWhereNull('deadline');
            })
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
            ->limit($limit)
            ->get();
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
}
