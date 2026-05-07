import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Head } from '@inertiajs/react';

import { JobDetailType, JobCardType } from '@/types/job';
import { JobDetailHeader } from './components/JobDetailHeader';
import { JobDetailContent } from './components/JobDetailContent';
import { JobDetailSidebar } from './components/JobDetailSidebar';
import { RelatedJobs } from './components/RelatedJobs';
import { JobDetailSkeleton } from './components/JobDetailSkeleton';

export default function JobDetail({
    job,
    relatedJobs,
}: {
    job: JobDetailType | { data: JobDetailType };
    relatedJobs: JobCardType[] | { data: JobCardType[] };
}) {
    const [isLoading, setIsLoading] = useState(true);

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    useEffect(() => {
        // Simulasi loading jika dibutuhkan, atau bisa dihilangkan karena Inertia sudah fetch data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [job]);

    if (isLoading) {
        return <JobDetailSkeleton />;
    }

    const jobData = 'data' in job ? job.data : job;
    const relatedJobsData = Array.isArray(relatedJobs)
        ? relatedJobs
        : relatedJobs?.data || [];

    return (
        <div className="mt-16">
            <Head title={`${jobData.title} | Karir`} />

            {/* --- HEADER PEKERJAAN --- */}
            <JobDetailHeader jobData={jobData} fadeUp={fadeUp} />

            {/* --- KONTEN UTAMA --- */}
            <section className="px-6 pb-16 text-black md:pb-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto max-w-6xl "
                >
                    {/* --- LAYOUT UTAMA --- */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* BAGIAN KIRI: Deskripsi Pekerjaan, Skills, Kualifikasi, & Benefit */}
                        <JobDetailContent jobData={jobData} fadeUp={fadeUp} />

                        {/* BAGIAN KANAN: Sticky Card (Ringkasan & Deadline) */}
                        <JobDetailSidebar jobData={jobData} fadeUp={fadeUp} />
                    </div>

                    {/* --- LOWONGAN PEKERJAAN LAINNYA --- */}
                    <RelatedJobs relatedJobs={relatedJobsData} />
                </motion.div>
            </section>
        </div>
    );
}
