'use client'
import { DataTable } from '@/components/table/data-table'
import { jobColumns } from '@/components/table/columns'
import { Skeleton } from "@/components/ui/skeleton"
import { useGetJobs } from '@/hooks/useGetJobs';
export default function DashboardJobs() {
    const { jobs, isLoading, error, sessionStatus: status } = useGetJobs()
    if (isLoading || status === 'loading') {
        return (
            <div className="container mx-auto flex justify-center items-center h-64 mt-24">
                <div className="w-full">
                    <div className="border rounded-md overflow-hidden">
                        <div className="flex bg-muted px-4 py-2">
                            {[...Array(7)].map((_, i) => (
                                <Skeleton className="h-5 w-1/7 mr-4 last:mr-0" key={i} />
                            ))}
                        </div>
                        {[...Array(10)].map((_, rowIdx) => (
                            <div className="flex px-4 py-3 border-t" key={rowIdx}>
                                {[...Array(7)].map((_, colIdx) => (
                                    <Skeleton className="h-4 w-1/7 mr-4 last:mr-0" key={colIdx} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                    <span className="text-red-600 font-light text-lg">Error loading jobs</span>
                    <span className="text-gray-500 mt-1 text-sm">Please try refreshing the page or check your connection.</span>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto">
            <DataTable columns={jobColumns} data={jobs?.data?.data || []} />
        </div>
    );
}
