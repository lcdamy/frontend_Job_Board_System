'use client'
import React from "react"
import { useGetPublicJobs } from "@/hooks/useGetPublicJobs";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"

type Job = {
    id: string | number;
    title: string;
    company: string;
    location: string;
    description: string;
    deadline?: string; // Added deadline property as optional
};

export default function JobListPage() {
    const page = 1;
    const pageSize = 10;
    const { jobs, isLoading, error } = useGetPublicJobs(page, pageSize);

    if (isLoading) {
        return (
            <div className="bg-[#E5EDF9] min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* company logo skeleton */}
                    <div className="flex items-center mb-8">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-8 w-40" />
                        </div>
                        <div className="ml-auto">
                            <Skeleton className="h-10 w-36 rounded-md" />
                        </div>
                    </div>

                    <ul className="space-y-6">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <li
                                key={idx}
                                className="border p-4 rounded-md bg-accent flex flex-col justify-between items-start relative"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                    <Skeleton className="w-[70px] h-[70px] rounded-full border-2 border-[#4B93E7] mb-4 md:mb-0 p-2" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-full mt-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
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
                    <span className="text-red-600 font-light text-lg">Error loading jobs</span>
                    <span className="text-gray-500 mt-1 text-sm">Please try refreshing the page or check your connection.</span>
                </div>
            </div>
        );
    }


    // jobs.data is the array of Job
    const jobList: Job[] = jobs.data ?? [];

    return (
        <div className="bg-[#E5EDF9] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* company logo */}
                <div className="flex items-center mb-8">
                    <Link href="/" passHref className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Company Logo" className="h-10" />
                        <h1 className="text-2xl font-bold">Job Board system</h1>
                    </Link>
                </div>

                {jobList.length >= 1 ? (
                    <ul className="space-y-6">
                        {jobList.map((job: Job) => (
                            <li
                                key={job.id}
                                className="border p-4 rounded-md bg-accent flex flex-col justify-between items-start relative transition-shadow duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-[#4B93E7] hover:bg-[#f3f8fd]"
                            >
                                <div className="flex *:flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                    <Image
                                        src={`/Illustrations-1.png`}
                                        alt={job.title}
                                        width={70}
                                        height={70}
                                        className="object-cover rounded-full border-2 border-[#4B93E7] mb-4 md:mb-0 p-2 bg-[#E6EEF8]"
                                        style={{ width: 70, height: 70, borderRadius: "50%" }}
                                    />

                                    <div>
                                        <h2 className="text-xl font-semibold">{job.title}</h2>
                                        <p className="text-gray-600">{job.company} - {job.location}</p>
                                        <div
                                            className="mt-2 prose prose-sm max-w-none line-clamp-3 overflow-hidden text-sm text-gray-500"
                                            dangerouslySetInnerHTML={{
                                                __html: job.description.replace(/<[^>]+>/g, '').slice(0, 150) + (job.description.replace(/<[^>]+>/g, '').length > 150 ? '...' : '')
                                            }}
                                        />
                                        {job.deadline && (
                                            <p className="text-xs text-[#4B93E7] mt-2">
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={`/apply/${job.id}`}
                                    className="text-[#4B93E7] hover:text-[#082777] text-sm no-underline hover:underline flex items-center gap-2 absolute bottom-4 right-4"
                                >
                                    <span>Read More</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Image
                            src="/empty-state.png"
                            alt="No jobs"
                            width={120}
                            height={120}
                            className="mb-4"
                        />
                        <h2 className="text-lg font-semibold mb-2">No jobs found</h2>
                        <p className="text-gray-500 text-sm">There are currently no job postings available. Please check back later.</p>
                    </div>
                )}
            </div>

        </div>

    );
}
