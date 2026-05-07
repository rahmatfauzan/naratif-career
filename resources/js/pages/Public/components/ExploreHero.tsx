import React from 'react';

interface ExploreHeroProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

export function ExploreHero({
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
}: ExploreHeroProps) {
    return (
        <div className="relative mb-12 h-[60vh] w-full overflow-hidden">
            <img
                src="/assets/images/gambar-5.png"
                alt="Karir Naratif"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 mt-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Karir di Naratif
                </h1>
                <p className="mb-8 max-w-2xl text-base text-white/90 md:text-lg">
                    Bergabunglah dengan tim kreatif dan berdedikasi kami untuk
                    membangun solusi digital yang berdampak.
                </p>

                <form onSubmit={onSearchSubmit} className="w-full max-w-3xl">
                    <div className="relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari posisi, atau kata kunci..."
                            className="w-full rounded-lg bg-white/95 py-3 pr-4 pl-12 text-gray-900 shadow-lg placeholder:text-gray-400"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
