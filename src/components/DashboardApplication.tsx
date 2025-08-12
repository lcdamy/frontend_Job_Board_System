'use client'
import React, { useState, useEffect } from "react"
import { DataTable } from '@/components/table/data-table'
import { applicationColumns } from '@/components/table/columns'
import { Skeleton } from "@/components/ui/skeleton"
import { useGetApplications } from '@/hooks/useGetApplications'
import { useGetPublicJobs } from '@/hooks/useGetPublicJobs';
import { Label } from "@/components/ui/label";
import { JobApplication } from "@/lib/types";


export default function DashboardApplication() {
    const [selectedjob, setSelectedjob] = React.useState<string>('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { applications, total, error, isLoading, sessionStatus } = useGetApplications(page, pageSize);
    const { jobs } = useGetPublicJobs(1, 100); // Fetch jobs for location filter



    const filteredApplications = applications?.data.filter((application: JobApplication) => {
        // If 'All jobs' is selected, show all applications
        if (!selectedjob) return true;
        return String(application.jobId) === selectedjob;
    });

    if (isLoading || sessionStatus == 'loading') {
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
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <span className="text-red-600 font-light text-lg">Error loading candidates</span>
                    <span className="text-gray-500 mt-1 text-sm">Please try refreshing the page or check your connection.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-end">
                <div className="relative w-44 md:w-68 mb-8">
                    <select
                        id="job"
                        name="job"
                        className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-md border border-blue-500 appearance-none dark:text-white dark:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                        value={selectedjob}
                        onChange={e => setSelectedjob(e.target.value)}
                    >
                        <option value="">All jobs</option>
                        {jobs?.data.map((job: { id: string | number; title: string }) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                    <Label
                        htmlFor="job"
                        className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                    >
                        job
                    </Label>
                </div>
            </div>
            <DataTable
                columns={applicationColumns}
                data={filteredApplications ?? []}
                page={page}
                pageSize={pageSize}
                total={total}
                setPage={setPage}
                setPageSize={setPageSize}
            />
        </div>
    )
}