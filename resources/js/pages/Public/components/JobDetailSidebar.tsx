import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDate, getDaysAgo } from '@/lib/formatter';
import { Link, usePage } from '@inertiajs/react';
import { JobDetailType } from '@/types/job';
import { PageProps } from '@/types';

interface JobDetailSidebarProps {
    jobData: JobDetailType & { has_applied?: boolean };
    fadeUp: Variants;
    onApplyClick?: () => void;
}

export function JobDetailSidebar({ jobData, fadeUp, onApplyClick }: JobDetailSidebarProps) {
    const user = usePage<PageProps>().props.auth?.user;
    return (
        <div className="lg:col-span-4">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="sticky top-32 rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5"
            >
                <div className="mb-8 flex items-center gap-4 border-b border-black/5 pb-8">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#CFF24A]">
                        <svg
                            className="h-5 w-5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">
                            Ringkasan Posisi
                        </h4>
                        <p className="text-sm text-gray-500">
                            Diposting {getDaysAgo(jobData.created_at || '')}
                        </p>
                    </div>
                </div>

                <div className="mb-8 space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-900">
                            Departemen:
                        </span>
                        <span>{jobData.department?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Tipe:</span>
                        <span className="capitalize">
                            {jobData.type?.replace('-', ' ')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-900">
                            Lokasi:
                        </span>
                        <span className="capitalize">{jobData.location}</span>
                    </div>

                    {jobData.deadline && (
                        <div className="mt-4 flex justify-between rounded-lg bg-red-50 p-3">
                            <span className="font-semibold text-red-900">
                                Batas Lamaran:
                            </span>
                            <span className="font-bold text-red-600">
                                {formatDate(jobData.deadline)}
                            </span>
                        </div>
                    )}
                </div>

                {!user ? (
                    <Button asChild className="h-14 w-full bg-[#0d5986] text-lg font-semibold text-white shadow-md hover:bg-[#0d5986]/90">
                        <Link href="/login">Login untuk Melamar</Link>
                    </Button>
                ) : jobData.has_applied ? (
                    <Button disabled className="h-14 w-full bg-gray-400 text-lg font-semibold text-white shadow-md cursor-not-allowed">
                        Sudah Dilamar
                    </Button>
                ) : (
                    <Button 
                        onClick={onApplyClick}
                        className="h-14 w-full cursor-pointer bg-[#0d5986] text-lg font-semibold text-white shadow-md transition-transform hover:bg-[#0d5986]/90 active:scale-95"
                    >
                        Lamar Sekarang
                    </Button>
                )}

                <p className="mt-4 text-center text-xs text-gray-400">
                    Proses rekrutmen kami bebas biaya.
                </p>
            </motion.div>
        </div>
    );
}
