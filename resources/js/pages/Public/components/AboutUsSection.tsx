import LogoIcon from '@/components/icon/LogoIcon';

export default function AboutUsSection() {
    return (
        <section className="relative overflow-hidden px-6 py-[10vh]">
            <div
                className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
                style={{ backgroundImage: "url('/assets/images/dot.png')" }}
            />

            <div className="relative container mx-auto">
                <div className="mx-auto mb-[10vh] flex max-w-4xl flex-col items-center text-center">
                    <h2 className="mb-6 text-4xl font-bold text-[#06334E] md:text-5xl lg:text-6xl">
                        Siapa Kami
                    </h2>
                    <p className="text-base leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                        Berfokus pada desain, pengembangan web, dan storytelling
                        digital, Naratif hadir sebagai agensi kreatif yang
                        membantu setiap brand membangun identitas kuat dan
                        pengalaman digital yang berdampak.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="relative flex min-h-75 flex-col justify-center overflow-hidden rounded-2xl bg-black p-8 text-white shadow-lg md:p-12 lg:col-span-12">
                        <img
                            src="assets/images/dot.png"
                            alt=""
                            className="absolute"
                        />
                        <div className="absolute top-0 left-0 h-12 w-12 bg-[#055587]" />
                        <div className="absolute bottom-0 left-0 h-12 w-12 bg-[#CFF24A]" />

                        <img
                            src="assets/images/creative.png"
                            className="absolute -right-20 opacity-50 md:-right-10 lg:right-10 lg:opacity-80"
                            alt="Creative Design"
                        />

                        <div className="relative z-10 max-w-2xl">
                            <h3 className="mb-4 text-3xl font-bold lg:text-4xl">
                                Creative Design
                            </h3>
                            <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
                                Membangun visual yang kuat dan identitas brand
                                yang konsisten. Kami memastikan setiap elemen
                                desain tidak hanya indah dipandang, tetapi juga
                                memiliki fungsi dan makna yang mendalam bagi
                                audiens Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <div className="relative flex min-h-75 flex-1 flex-col overflow-hidden rounded-2xl bg-[#e3e3e3] p-8 shadow-md">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
                                style={{
                                    backgroundImage:
                                        "url('/assets/images/dot.png')",
                                }}
                            />

                            <img
                                src="assets/images/story.png"
                                className="absolute -right-6 -bottom-6 h-64 origin-bottom-right scale-150"
                                alt="Storytelling"
                            />

                            <div className="absolute top-8 right-8 h-8 w-8 rounded-full bg-[#FC73A0]" />

                            <div className="z-10 flex flex-1 flex-col">
                                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                                    Storytelling & Content
                                </h3>
                                <p className="max-w-50 text-lg leading-relaxed text-gray-700">
                                    Mengemas pesan brand menjadi narasi yang
                                    engaging.
                                </p>
                            </div>

                            <div className="z-10 flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <LogoIcon key={i} className="h-8" />
                                ))}
                            </div>
                        </div>

                        <div className="relative flex min-h-75 flex-1 items-end justify-end overflow-hidden rounded-2xl bg-[#FC73A0] p-4 text-white shadow-md">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('/assets/images/strategy.png')",
                                }}
                            />
                            <div className="absolute inset-0 bg-black/10" />
                            <div
                                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                                style={{
                                    backgroundImage:
                                        "url('/assets/images/dot.png')",
                                }}
                            />

                            <div className="relative z-10 max-w-3xs">
                                <h3 className="mb-2 text-2xl font-bold">
                                    Digital Strategy
                                </h3>
                                <p className="text-lg leading-relaxed text-white/95">
                                    Membantu brand tumbuh dengan strategi yang
                                    tepat.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex min-h-156 flex-col justify-end overflow-hidden rounded-2xl bg-[#0d5986] p-8 text-white shadow-lg lg:col-span-7">
                        <img
                            src="/assets/images/web.png"
                            alt="Web Development"
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div
                            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                            style={{
                                backgroundImage:
                                    "url('/assets/images/dot.png')",
                            }}
                        />
                        <img
                            src="/assets/images/web-dot.png"
                            alt=""
                            className="absolute top-8 right-8"
                        />

                        <div className="relative z-10 max-w-md">
                            <h3 className="mb-3 text-3xl font-bold lg:text-4xl">
                                Web Development
                            </h3>
                            <p className="text-lg leading-relaxed text-gray-200">
                                Mengembangkan website modern, cepat, interaktif,
                                dan scalable. Kami membangun fondasi digital
                                yang tangguh untuk bisnis Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
