import React from 'react';
import { JobCardType } from '@/types/job';
import { getDaysAgo } from '@/lib/formatter';
import jobsRoutes from '@/routes/public/jobs';

export function JobListItem({ job }: { job: JobCardType }) {
    return (
        <a
            href={jobsRoutes.show.url(job.slug)}
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#0d5986] hover:shadow-md md:flex-row md:items-center"
        >
            <div className="flex-1">
                <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0d5986]">
                        {job.department?.name || 'Department'}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 capitalize">
                        {job.type?.replace('-', ' ')}
                    </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#0d5986]">
                    {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 capitalize">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        {job.location}
                    </div>
                    {/* Keahlian */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            <span className="max-w-[200px] truncate">
                                {job.skills
                                    .slice(0, 3)
                                    .map((s) => s.name)
                                    .join(', ')}
                                {job.skills.length > 3 ? '...' : ''}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-row items-center justify-between border-t border-gray-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <span className="text-xs text-gray-400 md:mb-4">
                    {getDaysAgo(job.created_at || '')}
                </span>
                <span className="flex items-center gap-2 font-semibold text-[#0d5986] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:translate-x-2 md:transition-all md:group-hover:translate-x-0">
                    Lihat Detail
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </span>
            </div>
        </a>
    );
}
