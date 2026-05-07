import React from 'react';
import { motion, Variants } from 'framer-motion';
import { JobDetailType } from '@/types/job';

interface JobDetailContentProps {
    jobData: JobDetailType;
    fadeUp: Variants;
}

export function JobDetailContent({ jobData, fadeUp }: JobDetailContentProps) {
    // Fungsi sederhana untuk merender HTML dari string editor (sementara lib/editor-renderer belum ada)
    const renderHtml = (content: string) => {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8"
        >
            <div className="prose prose-lg prose-headings:text-gray-900 prose-li:marker:text-[#CFF24A] max-w-none text-gray-600">
                {jobData.description && (
                    <>
                        <h3 className="mb-4 text-2xl font-bold">
                            Tentang Peran Ini
                        </h3>
                        <div className="mb-8 leading-relaxed">
                            {renderHtml(jobData.description)}
                        </div>
                    </>
                )}

                {jobData.skills && jobData.skills.length > 0 && (
                    <>
                        <h3 className="mb-4 text-2xl font-bold">
                            Keahlian yang Dibutuhkan
                        </h3>
                        <div className="mb-8 flex flex-wrap gap-3">
                            {jobData.skills.map((skill: any) => (
                                <span
                                    key={skill.id}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {jobData.requirements && jobData.requirements.length > 0 && (
                    <>
                        <h3 className="mb-4 text-2xl font-bold">Persyaratan</h3>
                        <div className="mb-8">
                            <ul className="list-disc pl-5">
                                {jobData.requirements.map((req, index) => (
                                    <li key={index} className="mb-2">
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {jobData.nice_to_have && jobData.nice_to_have.length > 0 && (
                    <>
                        <h3 className="mb-4 text-2xl font-bold">
                            Nilai Plus (Nice to Have)
                        </h3>
                        <div className="mb-8">
                            <ul className="list-disc pl-5">
                                {jobData.nice_to_have.map((nice, index) => (
                                    <li key={index} className="mb-2">
                                        {nice}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {jobData.benefits && jobData.benefits.length > 0 && (
                    <>
                        <h3 className="mb-4 text-2xl font-bold">
                            Keuntungan & Fasilitas
                        </h3>
                        <div className="mb-8">
                            <ul className="list-disc pl-5">
                                {jobData.benefits.map((benefit, index) => (
                                    <li key={index} className="mb-2">
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
