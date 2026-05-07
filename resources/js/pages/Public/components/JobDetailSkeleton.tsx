import { motion } from 'framer-motion';

export function JobDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl bg-[#f6f6f4] px-6 py-32 md:py-40">
            {/* Header Skeleton */}
            <div className="mb-12 animate-pulse border-b border-black/10 pb-12">
                <div className="mb-4 h-4 w-24 rounded bg-gray-200"></div>
                <div className="mb-6 h-12 w-3/4 rounded-lg bg-gray-200 md:w-1/2"></div>
                <div className="flex flex-wrap gap-3">
                    <div className="h-8 w-24 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-32 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-28 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-40 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Kiri: Body Skeleton */}
                <div className="animate-pulse lg:col-span-8">
                    {/* Tentang Peran */}
                    <div className="mb-6 h-8 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-full rounded bg-gray-200"></div>
                    <div className="mb-12 h-4 w-5/6 rounded bg-gray-200"></div>

                    {/* Skeleton Skills */}
                    <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
                    <div className="mb-12 flex flex-wrap gap-2">
                        <div className="h-8 w-20 rounded-lg bg-gray-200"></div>
                        <div className="h-8 w-24 rounded-lg bg-gray-200"></div>
                        <div className="h-8 w-16 rounded-lg bg-gray-200"></div>
                        <div className="h-8 w-28 rounded-lg bg-gray-200"></div>
                        <div className="h-8 w-24 rounded-lg bg-gray-200"></div>
                    </div>

                    {/* Kualifikasi Ideal */}
                    <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="mb-12 h-4 w-2/3 rounded bg-gray-200"></div>

                    {/* Nilai Plus */}
                    <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-2/3 rounded bg-gray-200"></div>
                    <div className="mb-12 h-4 w-1/2 rounded bg-gray-200"></div>

                    {/* Benefit */}
                    <div className="mb-6 h-8 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-full rounded bg-gray-200"></div>
                    <div className="mb-3 h-4 w-4/5 rounded bg-gray-200"></div>
                </div>

                {/* Kanan: Card Skeleton */}
                <div className="animate-pulse lg:col-span-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
                        <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-8">
                            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                            <div>
                                <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                                <div className="h-3 w-16 rounded bg-gray-200"></div>
                            </div>
                        </div>
                        <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                        <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                        <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                        <div className="mb-8 h-4 w-2/3 rounded bg-gray-200"></div>
                        <div className="h-14 w-full rounded-lg bg-gray-200"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton Lowongan Lainnya */}
            <div className="mt-24 animate-pulse border-t border-black/10 pt-16">
                <div className="mb-8 h-8 w-64 rounded bg-gray-200"></div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="h-48 rounded-xl bg-gray-200"></div>
                    <div className="h-48 rounded-xl bg-gray-200"></div>
                </div>
            </div>
        </div>
    );
}
