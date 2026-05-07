import React from 'react';
import { motion, Variants } from 'framer-motion';
import { formatRupiah } from '@/lib/formatter';
import { JobDetailType } from '@/types/job';

interface JobDetailHeaderProps {
    jobData: JobDetailType;
    fadeUp: Variants;
}

export function JobDetailHeader({ jobData, fadeUp }: JobDetailHeaderProps) {
    return (
        <section className="px-6 pt-20 pb-16 text-black md:pt-16 md:pb-18">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <span className="mb-4 block font-semibold tracking-widest text-[#0d5986] uppercase">
                        {jobData.department?.name || 'Department'}
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                        {jobData.title}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        <span className="rounded-full border border-black/20 px-5 py-2 text-sm font-medium capitalize">
                            {jobData.type?.replace('-', ' ')}
                        </span>
                        <span className="rounded-full border border-black/20 px-5 py-2 text-sm font-medium capitalize">
                            {jobData.location}
                        </span>
                        {/* Badge Gaji */}
                        {jobData.salary && (
                            <span className="rounded-full border border-green-200 bg-green-100 px-5 py-2 text-sm font-semibold text-green-800">
                                {formatRupiah(Number(jobData.salary))}
                            </span>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
