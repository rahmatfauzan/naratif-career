import { Skeleton } from '@/components/ui/skeleton';

export function JobListItemSkeleton() {
    return (
        <div className="group flex flex-col justify-between gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div className="flex-1">
                {/* Badges Skeleton */}
                <div className="mb-3 flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Title Skeleton */}
                <Skeleton className="mb-3 h-7 w-3/4 max-w-sm" />
                
                {/* Description Skeleton */}
                <div className="mb-5 space-y-2 md:pr-12">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Metadata Skeleton */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {/* Location */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    {/* Skills */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    {/* Salary */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
            </div>

            {/* Right side Skeleton (Date & Button) */}
            <div className="flex flex-row items-center justify-between border-t border-gray-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <Skeleton className="h-3 w-20 md:mb-4" />
                <Skeleton className="hidden h-5 w-24 md:block" />
            </div>
        </div>
    );
}
