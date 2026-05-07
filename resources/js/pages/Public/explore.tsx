import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { useDebounce } from 'use-debounce';
import { JobCardType } from '@/types/job';
import { Department } from '@/types/department';
import { Skill } from '@/types/skill';
import { JobListItemSkeleton } from './components/JobListItemSkeleton';
import { JobListItem } from './components/JobListItem';
import { ExploreHero } from './components/ExploreHero';
import { ExploreFilters } from './components/ExploreFilters';
import jobsRoutes from '@/routes/public/jobs';

interface PaginationProps {
    data: JobCardType[];
    links?: {
        next?: string | null;
    };
    next_page_url?: string | null;
}

const getNextUrl = (paginationData: any): string | null => {
    if (!paginationData) return null;
    return paginationData.links?.next || paginationData.next_page_url || null;
};

interface PageProps {
    jobs: PaginationProps;
    departments: Department[];
    skills: Skill[];
    jobTypes: { id: string; name: string }[];
    locations: { id: string; name: string }[];
    filters: {
        search?: string;
        department_id?: string;
        skill_id?: string;
        type?: string;
        location?: string;
    };
}

export default function Careers({
    jobs,
    departments,
    skills,
    jobTypes,
    locations,
    filters,
}: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const [filterDept, setFilterDept] = useState(
        filters?.department_id || 'all',
    );
    const [filterSkill, setFilterSkill] = useState<string[]>(
        filters?.skill_id ? filters.skill_id.split(',') : [],
    );
    const [filterType, setFilterType] = useState(filters?.type || 'all');
    const [filterLocation, setFilterLocation] = useState(
        filters?.location || 'all',
    );

    // State for Infinite Loading
    const [jobList, setJobList] = useState<JobCardType[]>(jobs.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        getNextUrl(jobs),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    const jobTypeOptions = [{ id: 'all', name: 'Semua Tipe' }, ...jobTypes];

    const locationOptions = [{ id: 'all', name: 'Semua Lokasi' }, ...locations];

    // Sync state when props change (e.g. from filter form submission)
    useEffect(() => {
        // Jika request berasal dari filter (bukan load more), reset list
        if (!isLoading) {
            setJobList(jobs.data);
            setIsFiltering(false);
        }
        setNextPageUrl(getNextUrl(jobs));
    }, [jobs]);

    const handleFilter = () => {
        setIsFiltering(true);
        router.get(
            jobsRoutes.explore.url(),
            {
                search: debouncedSearchQuery,
                department_id: filterDept === 'all' ? '' : filterDept,
                skill_id: filterSkill.length > 0 ? filterSkill.join(',') : '',
                type: filterType === 'all' ? '' : filterType,
                location: filterLocation === 'all' ? '' : filterLocation,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['jobs', 'filters'],
                onFinish: () => setIsFiltering(false),
            },
        );
    };

    // Flag to detect initial mount
    const isMounted = React.useRef(false);

    // Auto-filter when dropdown changes or search query changes
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        handleFilter();
    }, [
        filterDept,
        filterSkill,
        filterType,
        filterLocation,
        debouncedSearchQuery,
    ]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    const handleLoadMore = () => {
        if (!nextPageUrl || isLoading) return;

        setIsLoading(true);
        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['jobs'],
                onSuccess: (page) => {
                    // Because Inertia updates the 'jobs' prop with the new page data,
                    // we need to append the new items to our existing list.
                    const newJobsData = (page.props.jobs as PaginationProps)
                        .data;
                    setJobList((prev) => [...prev, ...newJobsData]);
                    setIsLoading(false);
                },
                onError: () => {
                    console.error('Failed to load more jobs');
                    setIsLoading(false);
                },
            },
        );
    };

    const resetFilter = () => {
        setSearchQuery('');
        setFilterDept('all');
        setFilterSkill([]);
        setFilterType('all');
        setFilterLocation('all');
        router.get(jobsRoutes.explore.url());
    };

    return (
        <>
            <Head title="Karir" />
            <section className="min-h-screen bg-[#f6f6f4] pb-20 text-black">
                {/* --- HERO WITH BACKGROUND + CENTERED SEARCH --- */}
                <ExploreHero 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                />

                <div className="container mx-auto">
                    {/* --- FILTERS CARD --- */}
                    <ExploreFilters
                        departments={departments}
                        skills={skills}
                        jobTypeOptions={jobTypeOptions}
                        locationOptions={locationOptions}
                        filterDept={filterDept}
                        setFilterDept={setFilterDept}
                        filterSkill={filterSkill}
                        setFilterSkill={setFilterSkill}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        filterLocation={filterLocation}
                        setFilterLocation={setFilterLocation}
                        onReset={resetFilter}
                    />

                    {/* --- JOB LIST --- */}
                    <div className="min-h-[400px]">
                        <div className="flex flex-col gap-5">
                            {isFiltering ? (
                                // --- FILTERING SKELETON STATE ---
                                <>
                                    <JobListItemSkeleton />
                                    <JobListItemSkeleton />
                                    <JobListItemSkeleton />
                                </>
                            ) : jobList.length > 0 ? (
                                jobList.map((job) => (
                                    <JobListItem key={job.id} job={job} />
                                ))
                            ) : (
                                // --- EMPTY STATE ---
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <svg
                                            className="h-8 w-8 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                                        Pekerjaan Tidak Ditemukan
                                    </h3>
                                    <p className="max-w-md text-gray-500">
                                        Maaf, tidak ada posisi yang cocok dengan
                                        filter pencarian Anda saat ini.
                                    </p>
                                    <button
                                        onClick={resetFilter}
                                        className="mt-6 font-semibold text-[#0d5986] hover:underline"
                                    >
                                        Reset Semua Filter
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* --- LOAD MORE SKELETON --- */}
                        {isLoading && (
                            <div className="mt-5 flex flex-col gap-5">
                                <JobListItemSkeleton />
                                <JobListItemSkeleton />
                                <JobListItemSkeleton />
                            </div>
                        )}

                        {/* --- LOAD MORE BUTTON --- */}
                        {nextPageUrl && !isLoading && !isFiltering && (
                            <div className="mt-12 flex justify-center pb-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="rounded-full border-2 border-[#0d5986] bg-transparent px-8 py-3 font-semibold text-[#0d5986] transition-all hover:bg-[#0d5986] hover:text-white active:scale-95 disabled:opacity-50"
                                >
                                    Muat Lebih Banyak
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
