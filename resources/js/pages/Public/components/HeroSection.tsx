import { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    // 1. Buat referensi untuk membidik section Hero ini
    const ref = useRef(null);

    // 2. Lacak progress scroll khusus di area section ini
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    // 3. Ubah nilai scroll (0 sampai 1) menjadi pergeseran Y (0% sampai 30%)
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    // --- VARIANTS UNTUK ANIMASI STAGGER ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Jeda waktu kemunculan antar elemen (h1, p, button)
                delayChildren: 0.2, // Jeda sebelum animasi pertama dimulai
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 }, // Elemen bergeser sedikit dari bawah (20px)
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    return (
        <section ref={ref} className="relative h-[90vh] w-full overflow-hidden">
            {/* Background Parallax */}
            <motion.img
                style={{ y: backgroundY }}
                src="assets/images/gambar-1.png"
                alt="Tim Naratif"
                className="absolute inset-0 h-[120%] w-full origin-top object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* --- CENTER CONTENT (DIANIMASIKAN) --- */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
            >
                <motion.h1
                    variants={itemVariants}
                    className="mb-4 text-3xl font-bold md:text-5xl"
                >
                    Naratif Career
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mb-6 max-w-xl text-sm md:text-lg"
                >
                    Tempat pendaftaran resmi untuk bergabung bersama Naratif.
                    Kami mencari individu yang siap berkembang, berkolaborasi,
                    dan menciptakan dampak nyata melalui karya.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <Button className="w-full cursor-pointer bg-[#0d5986] hover:bg-[#0d5986]/90 sm:w-auto">
                        Jadi Bagian Kami
                    </Button>
                    <Button className="w-full cursor-pointer border border-white bg-transparent hover:bg-white/20 sm:w-auto">
                        Lihat Daftar Karir
                    </Button>
                </motion.div>
            </motion.div>

            {/* --- BOTTOM DEPARTMENT (DIANIMASIKAN DENGAN DELAY) --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }} // Muncul setelah teks utama selesai
                className="absolute bottom-25 left-1/2 z-10 w-full -translate-x-1/2 px-6 text-center text-white"
            >
                <div className="text-md font-semibold md:text-lg">
                    Our Department:
                </div>

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden md:block">
                    <img
                        src="assets/images/department.png"
                        className="mx-auto mt-3"
                        alt="Department"
                    />
                </div>

                {/* --- MOBILE VIEW (With Blur/Fade Edge & Infinite Scroll) --- */}
                <div className="mt-3 flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)] md:hidden">
                    <motion.div
                        className="mt-4 flex w-max"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{
                            repeat: Infinity,
                            ease: 'linear',
                            duration: 30,
                        }}
                    >
                        <img
                            src="assets/images/department.png"
                            className="w-auto max-w-none pr-12"
                            alt="Department"
                        />
                        <img
                            src="assets/images/department.png"
                            className="w-auto max-w-none pr-12"
                            alt="Department"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
