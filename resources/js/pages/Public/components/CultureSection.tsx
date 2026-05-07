export default function CultureSection() {
    return (
        <section className="relative overflow-hidden py-[10vh]">
            <div className="container mx-auto">
                <div className="mx-auto mb-[20vh] flex max-w-3xl flex-col items-center text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        Budaya Kerja
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
                        Lingkungan yang mendukung pertumbuhan, kolaborasi, dan
                        eksplorasi ide tanpa batas.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:h-225 md:grid-cols-2 md:grid-rows-5">
                    <div className="group relative flex h-100 overflow-hidden rounded-2xl md:row-span-5 md:h-full md:rounded-none">
                        <img
                            src="assets/images/gambar-2.png"
                            alt="Kolaboratif"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                        <div className="absolute right-8 bottom-8 left-8 z-10 text-white">
                            <h3 className="mb-1 text-2xl font-bold md:text-3xl">
                                Kolaboratif
                            </h3>
                            <p className="text-gray-200 md:text-lg">
                                Bekerja bersama antar tim
                            </p>
                        </div>
                    </div>

                    <div className="group relative flex h-87.5 overflow-hidden rounded-2xl md:row-span-3 md:h-full md:rounded-none">
                        <img
                            src="assets/images/gambar-3.png"
                            alt="Inovatif"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                        <div className="absolute right-8 bottom-8 left-8 z-10 text-white">
                            <h3 className="mb-1 text-2xl font-bold md:text-3xl">
                                Inovatif
                            </h3>
                            <p className="text-gray-200 md:text-lg">
                                Eksplorasi ide tanpa batas
                            </p>
                        </div>
                    </div>

                    <div className="group relative flex h-62.5 overflow-hidden rounded-2xl md:row-span-2 md:h-full md:rounded-none">
                        <img
                            src="assets/images/gambar-4.png"
                            alt="Berkembang"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                        <div className="absolute right-8 bottom-8 left-8 z-10 text-white">
                            <h3 className="mb-1 text-2xl font-bold md:text-3xl">
                                Berkembang
                            </h3>
                            <p className="text-gray-200 md:text-lg">
                                Berbagi dan belajar bersama
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
