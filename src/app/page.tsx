'use client'
import React from "react"
import { useGetPublicJobs } from "@/hooks/useGetPublicJobs";
import { Button } from "@/components/ui/button";
import Link from 'next/link'

type Job = {
    id: string | number;
    title: string;
    company: string;
    location: string;
    description: string;
};

export default function JobListPage() {
    const page = 1;
    const pageSize = 10;
    const { jobs, isLoading, error } = useGetPublicJobs(page, pageSize);

    if (isLoading) {
        return <div>Loading jobs...</div>;
    }

    if (error) {
        return <div>Error loading jobs.</div>;
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
                    <div className="ml-auto">
                        <Link href="/login" passHref>
                            <Button
                                type="button"
                                className="bg-[#4B93E7] text-white hover:bg-[#082777] hover:cursor-pointer transition-colors duration-200 ease-in-out"
                            >
                                Go to dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <ul className="space-y-6">
                    {jobList.map((job: Job) => (
                        <li key={job.id} className="border p-4 rounded-md bg-accent flex flex-col justify-between items-start relative">
                            <div>
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <p className="text-gray-600">{job.company} - {job.location}</p>
                                <p className="mt-2">{job.description}</p>
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
            </div>

        </div>

    );
}
