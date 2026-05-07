import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function FaqSection() {
    // State untuk melacak index FAQ mana yang sedang terbuka
    // null berarti semua tertutup. Hanya satu yang bisa terbuka di satu waktu.
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Animasi masuk (Fade Up) saat section di-scroll
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

    // Data FAQ
    const faqs = [
        {
            question: 'Apakah Naratif menerima fresh graduate?',
            answer: 'Tentu! Kami selalu mencari talenta muda yang bersemangat, memiliki kemauan belajar yang tinggi, dan berani mengeksplorasi ide-ide baru. Portofolio dan pola pikir jauh lebih penting bagi kami daripada sekadar pengalaman kerja bertahun-tahun.',
        },
        {
            question: 'Apakah sistem kerja di Naratif remote atau WFO?',
            answer: 'Kami mengadopsi sistem Hybrid (kombinasi WFO dan WFH) untuk sebagian besar posisi, terutama yang berbasis di Jakarta. Namun, untuk beberapa peran spesifik, kami sangat terbuka dengan sistem full-remote.',
        },
        {
            question: 'Bagaimana tahapan proses rekrutmen di sini?',
            answer: 'Proses standar kami meliputi: 1) Screening CV & Portofolio, 2) Interview santai dengan HR untuk melihat kecocokan budaya, 3) Technical Test / Case Study sesuai bidang, dan 4) Final Interview dengan User/Head of Department.',
        },
        {
            question: 'Berapa lama waktu yang dibutuhkan hingga pengumuman?',
            answer: 'Kami berusaha untuk bergerak cepat. Biasanya, seluruh proses rekrutmen dari pengiriman lamaran hingga offering letter memakan waktu sekitar 2 hingga maksimal 3 minggu.',
        },
        {
            question: 'Apakah ada fasilitas pengembangan diri untuk karyawan?',
            answer: 'Ada! Setiap talenta di Naratif mendapatkan alokasi budget tahunan yang bisa digunakan untuk membeli buku, mengikuti kelas online, sertifikasi, atau menghadiri konferensi yang relevan dengan bidangnya.',
        },
    ];

    const toggleFAQ = (index: number) => {
        // Jika yang diklik sudah terbuka, maka tutup (set ke null)
        // Jika yang diklik berbeda, buka yang baru
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        // Menggunakan background putih agar kontras dengan section Job sebelumnya yang agak abu-abu
        <section className="px-6 py-24 text-black md:py-32">
            <motion.div
                className="container mx-auto max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* --- HEADER FAQ --- */}
                <motion.div
                    variants={fadeUp}
                    className="mb-12 text-center md:mb-16"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Hal-hal yang paling sering ditanyakan oleh kandidat
                        kami.
                    </p>
                </motion.div>

                {/* --- ACCORDION LIST --- */}
                <div className="flex flex-col border-t border-black/10">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                className="border-b border-black/10"
                            >
                                {/* TOMBOL PERTANYAAN */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full cursor-pointer items-center justify-between py-6 text-left transition-colors hover:text-gray-600"
                                >
                                    <span className="text-xl font-semibold md:text-2xl">
                                        {faq.question}
                                    </span>

                                    {/* IKON PLUS/MINUS BERANIMASI */}
                                    <div className="ml-6 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black/20 text-black">
                                        <motion.svg
                                            animate={{
                                                rotate: isOpen ? 45 : 0,
                                            }} // Berputar jadi 'X' saat terbuka
                                            transition={{
                                                duration: 0.3,
                                                ease: 'easeInOut',
                                            }}
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </motion.svg>
                                    </div>
                                </button>

                                {/* KONTEN JAWABAN (ANIMATE PRESENCE) */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.16, 1, 0.3, 1],
                                            }} // Spring-like ease
                                            className="overflow-hidden"
                                        >
                                            <p className="pr-12 pb-6 text-lg leading-relaxed text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
