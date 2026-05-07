import LogoIcon from '@/components/icon/LogoIcon';
import { motion, Variants } from 'framer-motion';

export default function FooterSection() {
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

    return (
        <footer className="relative overflow-hidden bg-black px-6 pt-24 text-white md:pt-32">
            {/* GLOBAL NOISE BACKGROUND TEMA GELAP */}
            <div
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                style={{ backgroundImage: "url('/assets/images/dot.png')" }}
            />

            <motion.div
                className="relative z-10 container mx-auto flex flex-col"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {/* --- BAGIAN ATAS: CTA (Call to Action) --- */}
                <motion.div
                    variants={fadeUp}
                    className="mb-20 flex flex-col items-start justify-between gap-8 border-b border-white/20 pb-12 md:flex-row md:items-end"
                >
                    <div className="max-w-2xl">
                        <h2 className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                            Siap menciptakan
                            <br />
                            cerita baru bersama kami?
                        </h2>
                        <a
                            href="mailto:career@naratif.agency"
                            className="text-xl text-gray-400 transition-colors duration-300 hover:text-[#CFF24A] md:text-2xl"
                        >
                            career@naratif.agency
                        </a>
                    </div>

                    {/* Tombol Back to Top yang Elegan */}
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:bg-white"
                        aria-label="Back to top"
                    >
                        <svg
                            className="h-6 w-6 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                </motion.div>

                {/* --- BAGIAN TENGAH: LINK NAVIGASI --- */}
                <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
                    {/* Kolom 1: Brand Info */}
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col lg:col-span-2"
                    >
                        <div className="mb-6 flex items-center gap-2">
                            <LogoIcon />
                            <span className="text-3xl font-semibold tracking-wide">
                                naratif
                            </span>
                        </div>
                        <p className="max-w-sm leading-relaxed text-gray-400">
                            Agensi kreatif yang berfokus pada desain,
                            pengembangan web, dan storytelling digital untuk
                            membangun pengalaman yang berdampak.
                        </p>
                    </motion.div>

                    {/* Kolom 2: Menu Utama */}
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col gap-4"
                    >
                        <h4 className="mb-2 font-bold tracking-widest text-[#055587] uppercase">
                            Perusahaan
                        </h4>
                        <a
                            href="/"
                            className="text-gray-300 transition-colors hover:text-white"
                        >
                            Home
                        </a>
                        <a
                            href="/tentang-kami"
                            className="text-gray-300 transition-colors hover:text-white"
                        >
                            Tentang Kami
                        </a>
                        <a
                            href="/tim-kami"
                            className="text-gray-300 transition-colors hover:text-white"
                        >
                            Tim Kami
                        </a>
                        <a
                            href="/budaya"
                            className="text-gray-300 transition-colors hover:text-white"
                        >
                            Budaya
                        </a>
                    </motion.div>

                    {/* Kolom 3: Sosial Media */}
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col gap-4"
                    >
                        <h4 className="mb-2 font-bold tracking-widest text-[#055587] uppercase">
                            Terhubung
                        </h4>
                        <a
                            href="#"
                            className="text-gray-300 transition-colors hover:text-[#CFF24A]"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 transition-colors hover:text-[#CFF24A]"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 transition-colors hover:text-[#CFF24A]"
                        >
                            Dribbble
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 transition-colors hover:text-[#CFF24A]"
                        >
                            Behance
                        </a>
                    </motion.div>
                </div>

                {/* --- BAGIAN BAWAH: COPYRIGHT & GIANT TYPOGRAPHY --- */}
                <motion.div
                    variants={fadeUp}
                    className="flex flex-col items-center justify-between border-t border-white/20 pt-8 pb-4 sm:flex-row"
                >
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Naratif Agency. All
                        rights reserved.
                    </p>
                    <div className="mt-4 flex gap-6 text-sm text-gray-500 sm:mt-0">
                        <a href="#" className="hover:text-white">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white">
                            Terms of Service
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            {/* GIANT TYPOGRAPHY DI BACKGROUND BAWAH */}
            {/* Teks "NARATIF" raksasa yang dipotong di bagian bawah untuk estetika */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="pointer-events-none mt-10 flex w-full justify-center overflow-hidden select-none"
            ></motion.div>
        </footer>
    );
}
