import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { JOB_TYPES, JobCardType, JobType } from '@/types/job';
import { home } from '@/routes';

type JobFilter = JobType | 'all';

type PageProps = {
    featuredJobs?: JobCardType[];
    jobType?: JobFilter;
};

const formatJobType = (value: string) => {
    switch (value) {
        case 'full-time':
            return 'Full-time';
        case 'internship':
            return 'Internship';
        case 'contract':
            return 'Contract';
        case 'part-time':
            return 'Part-time';
        case 'freelance':
            return 'Freelance';
        default:
            return value;
    }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

export default function JobSection() {
    const { featuredJobs = [], jobType = 'all' } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<JobFilter>(jobType);

    const handleTabChange = (value: JobFilter) => {
        if (value === activeTab) return;
        setActiveTab(value);
        router.get(
            home.url(),
            { type: value === 'all' ? undefined : value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['featuredJobs', 'jobType'],
            },
        );
    };

    const tabs = [
        { label: 'Semua', value: 'all' as JobFilter },
        ...JOB_TYPES.map((type) => ({
            label: formatJobType(type),
            value: type as JobFilter,
        })),
    ];

    const filteredJobs =
        activeTab === 'all'
            ? featuredJobs
            : featuredJobs.filter((job) => job.type === activeTab);

    return (
        <section className="bg-[#f6f6f4] px-6 py-24 text-black md:py-32">
            <motion.div
                className="container mx-auto max-w-5xl"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
            >
                {/* Header */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
                    <motion.div variants={fadeUp} className="max-w-xl">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                            Bergabung Bersama Kami
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-600">
                            Temukan peran yang cocok dengan keahlianmu dan mari
                            ciptakan sesuatu yang luar biasa bersama Naratif.
                        </p>
                    </motion.div>
                </div>

                {/* Filter Tabs */}
                <motion.div
                    variants={fadeUp}
                    className="mb-8 flex flex-wrap gap-2 border-b border-black/10 pb-6"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                                activeTab === tab.value
                                    ? 'text-white'
                                    : 'border border-black/20 bg-transparent text-gray-600 hover:border-black hover:text-black'
                            }`}
                        >
                            {activeTab === tab.value && (
                                <motion.div
                                    layoutId="activeFilterTab"
                                    className="absolute inset-0 z-0 rounded-full bg-black"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Job List */}
                <div className="flex min-h-[300px] flex-col">
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job) => (
                            <motion.a
                                key={job.id}
                                href={`/job/${job.slug}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    filter: 'blur(4px)',
                                }}
                                transition={{ duration: 0.4 }}
                                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden border-b border-black/10 px-4 py-8 sm:flex-row sm:items-center md:px-8"
                            >
                                {/* Hover bg naik dari bawah */}
                                <div className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-black transition-transform duration-700 ease-in-out group-hover:scale-y-100" />

                                <div className="relative z-10 flex w-full flex-col justify-between sm:flex-row sm:items-center">
                                    <div className="mb-4 flex flex-col gap-2 transition-transform duration-700 ease-in-out group-hover:translate-x-2 sm:mb-0">
                                        <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-500 group-hover:text-white md:text-3xl">
                                            {job.title}
                                        </h3>
                                        <span className="text-sm font-medium tracking-wider text-gray-500 uppercase transition-colors duration-500 group-hover:text-gray-400">
                                            {job.department.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 transition-transform duration-700 ease-in-out group-hover:-translate-x-2 md:gap-12">
                                        <div className="flex flex-col text-sm text-gray-600 transition-colors duration-500 group-hover:text-gray-300 sm:text-right">
                                            <span className="font-bold text-black transition-colors duration-500 group-hover:text-white">
                                                {formatJobType(job.type)}
                                            </span>
                                            <span className="capitalize">
                                                {job.location}
                                            </span>
                                        </div>

                                        {/* Arrow icon */}
                                        <div className="relative hidden h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-transparent transition-colors duration-700 ease-in-out group-hover:border-white sm:flex">
                                            <svg
                                                className="absolute h-5 w-5 text-black transition-transform duration-700 ease-in-out group-hover:translate-x-full group-hover:-translate-y-full"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                            <svg
                                                className="absolute h-5 w-5 -translate-x-full translate-y-full text-white transition-transform duration-700 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>

                    {/* Empty state */}
                    <AnimatePresence>
                        {filteredJobs.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="py-12 text-center text-gray-500"
                            >
                                Belum ada lowongan untuk kategori ini.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
}
