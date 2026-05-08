import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { getDaysAgo } from '@/lib/formatter';
import { JobCardType } from '@/types/job';

interface RelatedJobsProps {
    relatedJobs: JobCardType[];
}

export function RelatedJobs({ relatedJobs }: RelatedJobsProps) {
    if (!relatedJobs || relatedJobs.length === 0) return null;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                },
            }}
            className="mt-24 border-t border-black/10 pt-16"
        >
            <h3 className="mb-8 text-3xl font-bold text-gray-900">
                Lowongan Terkait
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {relatedJobs.map((relatedJob: any) => (
                    <Link
                        key={relatedJob.id}
                        href={`/jobs/${relatedJob.slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-[#0d5986] hover:shadow-lg"
                    >
                        <div>
                            <div className="mb-4">
                                <span className="mb-2 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                    {relatedJob.department?.name}
                                </span>
                                <h4 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#0d5986]">
                                    {relatedJob.title}
                                </h4>
                            </div>
                            {/* Menambahkan Deskripsi (potongan) */}
                            {relatedJob.description && (
                                <div className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-600">
                                    {typeof relatedJob.description ===
                                    'string' ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: relatedJob.description,
                                            }}
                                        />
                                    ) : relatedJob.description?.blocks?.[0]
                                          ?.data?.text ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: relatedJob.description
                                                    .blocks[0].data.text,
                                            }}
                                        />
                                    ) : relatedJob.description?.data?.text ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: relatedJob.description
                                                    .data.text,
                                            }}
                                        />
                                    ) : null}
                                </div>
                            )}

                            <div className="mb-8 flex flex-wrap gap-2">
                                {relatedJob.skills &&
                                    relatedJob.skills.length > 0 &&
                                    relatedJob.skills
                                        .slice(0, 3)
                                        .map((skill: any) => (
                                            <span
                                                key={skill.id}
                                                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-black capitalize">
                                    {relatedJob.type?.replace('-', ' ')}
                                </span>
                                <span>•</span>
                                <span className="capitalize">
                                    {relatedJob.location}
                                </span>
                                <span>•</span>
                                <span>
                                    {getDaysAgo(relatedJob.created_at || '')}
                                </span>
                            </div>
                            <span className="font-medium text-[#0d5986] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Lihat Detail &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
