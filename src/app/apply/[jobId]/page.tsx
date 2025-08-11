'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { MoveLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Job = {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
    deadline: string;
    status: string;
    type: string;
    postedBy: number;
    createdAt: string;
    updatedAt: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchJob = async (jobId: string): Promise<Job | null> => {
    const res = await fetch(`${apiUrl}/api/v1/job/detail/${jobId}`);
    if (!res.ok) return null;
    return res.json();
};

export default function JobDetailPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) return;
        fetchJob(jobId)
            .then((res) => {
                // The API response has a "data" property with the job object
                if (res && (res as any).data) {
                    setJob((res as any).data);
                } else {
                    setJob(null);
                }
            })
            .catch(() => setError("Failed to load job details"))
            .finally(() => setLoading(false));
    }, [jobId]);

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        resume: "",
        coverLetter: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${apiUrl}/api/v1/job/${jobId}/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setApplied(true);
            } else {
                const data = await res.json();
                setError(data?.message || "Failed to apply for the job");
            }
        } catch (err) {
            setError("Failed to apply for the job");
        }
    };

    if (loading) return (
        <div className="bg-[#E5EDF9] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* company logo skeleton */}
                <div className="flex items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-8 w-40" />
                    </div>
                    <div className="ml-auto">
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>

                {/* Accordion skeleton */}
                <div className="w-full">
                    {/* Job Details Card Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Main Info Skeleton */}
                        <div className="md:col-span-2 bg-[#f3f8fd] rounded-lg shadow-md p-6 flex flex-col justify-between">
                            <div>
                                <Skeleton className="h-8 w-48 mb-2" />
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <Skeleton className="h-6 w-20 rounded" />
                                    <Skeleton className="h-6 w-20 rounded" />
                                    <Skeleton className="h-6 w-32 rounded" />
                                    <Skeleton className="h-6 w-24 rounded" />
                                </div>
                                <Skeleton className="h-5 w-28 mb-1" />
                                <Skeleton className="h-4 w-32 mb-4" />
                                <Skeleton className="h-5 w-36 mb-1" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                            <div className="mt-6 flex flex-col md:flex-row gap-2 text-sm text-gray-500">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        {/* Sidebar Info Skeleton */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Application Form Skeleton */}
                    <div className="w-full bg-[#f3f8fd] shadow-md rounded-lg p-6 mt-4">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Right column */}
                            <div className="flex flex-col gap-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Buttons */}
                            <div className="md:col-span-2 flex gap-2 justify-end mt-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="container mx-auto flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <span className="text-red-600 font-light text-lg">Error loading job</span>
                    <span className="text-gray-500 mt-1 text-sm">Please try refreshing the page or check your connection.</span>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container mx-auto flex flex-col justify-center items-center h-80 bg-[#f3f8fd] rounded-lg shadow-md mt-12">
                <svg className="w-14 h-14 text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xl font-semibold text-gray-700 mb-1">Job Not Found</span>
                <span className="text-gray-500 mb-2">We couldn't find the job you're looking for.</span>
                <a
                    href="/jobs"
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Back to Jobs
                </a>
            </div>
        );
    }

    return (
        <div className="bg-[#E5EDF9] min-h-screen">
            <div className="container mx-auto px-4 py-8">

                {/* company logo */}
                <div className="flex items-center mb-8">
                    <Link href="/" passHref className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Company Logo" className="h-10" />
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                    </Link>
                    <div className="ml-auto">
                        <Link href="/" passHref>
                            <div className="flex items-center hover:underline gap-2 text-xs text-[#071C50]/70 cursor-pointer hover:text-[#071C50] transition-colors data-[state=active]:bg-[#F3F8FF]">
                                <MoveLeft />
                                Go Back
                            </div>
                        </Link>
                    </div>
                </div>


                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                >

                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-semibold">Job Details</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                            {/* Job Details Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                {/* Main Info */}
                                <div className="md:col-span-2 bg-[#f3f8fd] rounded-lg shadow-md p-6 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                                        <div className="flex flex-wrap items-center gap-4 mb-4">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                                                {job.type}
                                            </span>
                                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                                                {job.location}
                                            </span>
                                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded">
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </span>

                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Company</h3>
                                        <p className="text-gray-700 mb-4">{job.company}</p>
                                        <h3 className="text-lg font-semibold mb-1">Job Description</h3>
                                        <div
                                            className="text-gray-700 prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: job.description }}
                                        />
                                    </div>
                                    <div className="mt-6 flex flex-col md:flex-row gap-2 text-sm text-gray-500">
                                        <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                        <span>Last updated: {new Date(job.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {/* Sidebar Info */}
                                <div className="flex flex-col gap-4">
                                    <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                        <h4 className="font-semibold text-gray-700 mb-1">Type</h4>
                                        <span className="text-blue-700">{job.type}</span>
                                    </div>
                                    <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                        <h4 className="font-semibold text-gray-700 mb-1">Location</h4>
                                        <span className="text-green-700">{job.location}</span>
                                    </div>
                                    <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                        <h4 className="font-semibold text-gray-700 mb-1">Deadline</h4>
                                        <span className="text-gray-800">{new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="bg-[#f3f8fd] rounded-lg shadow p-4">
                                        <h4 className="font-semibold text-gray-700 mb-1">Status</h4>
                                        <span className="text-yellow-700">{job.status}</span>
                                    </div>
                                </div>
                            </div>

                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="font-semibold">Apply for {job.title}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                            {/* apply form */}
                            <Card className="w-full border-[#4B93E7] bg-[#f3f8fd] shadow-md rounded-lg p-6">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold border-b-4 border-[#F7AC25]">
                                        Application Form
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    {applied ? (
                                        <div className="flex flex-col items-center space-y-2">
                                            <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <path d="M8 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="text-green-700 font-semibold text-lg">Application submitted!</span>
                                            <span className="text-gray-500 text-sm">Thank you for applying. We will contact you soon.</span>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left column */}
                                            <div className="flex flex-col gap-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="fullname"
                                                        name="fullname"
                                                        className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                        placeholder=""
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="fullname"
                                                        className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                                                    >
                                                        Full Name
                                                    </label>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                        placeholder=""
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="email"
                                                        className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                                                    >
                                                        Email
                                                    </label>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                        placeholder=""
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="phoneNumber"
                                                        className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                                                    >
                                                        Phone Number
                                                    </label>
                                                </div>
                                            </div>
                                            {/* Right column */}
                                            <div className="flex flex-col gap-4">
                                                {/* Resume Upload Button */}
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        name="resume"
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={async (e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file = e.target.files[0];
                                                                const formData = new FormData();
                                                                formData.append("file", file);

                                                                try {
                                                                    const res = await fetch(`${apiUrl}/api/v1/upload`, {
                                                                        method: "POST",
                                                                        body: formData,
                                                                    });
                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            resume: data.url,
                                                                        }));
                                                                    } else {
                                                                        setError("Failed to upload resume");
                                                                    }
                                                                } catch {
                                                                    setError("Failed to upload resume");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="resume"
                                                        className="block w-full"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="bg-[#DDEAFB]"
                                                            onClick={() => document.getElementById("resume")?.click()}
                                                        >
                                                            {form.resume ? "Re-upload Resume" : "Upload Resume"}
                                                        </Button>
                                                    </label>
                                                    {form.resume && (
                                                        <div className="text-xs text-green-700 mt-1 break-all">
                                                            Uploaded: <a href={form.resume} target="_blank" rel="noopener noreferrer" className="underline">{form.resume}</a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Cover Letter Upload Button */}
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="coverLetter"
                                                        name="coverLetter"
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={async (e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file = e.target.files[0];
                                                                const formData = new FormData();
                                                                formData.append("file", file);

                                                                try {
                                                                    const res = await fetch(`${apiUrl}/api/v1/upload`, {
                                                                        method: "POST",
                                                                        body: formData,
                                                                    });
                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        setForm((prev) => ({
                                                                            ...prev,
                                                                            coverLetter: data.url,
                                                                        }));
                                                                    } else {
                                                                        setError("Failed to upload cover letter");
                                                                    }
                                                                } catch {
                                                                    setError("Failed to upload cover letter");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="coverLetter"
                                                        className="block w-full"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="bg-[#DDEAFB]"
                                                            onClick={() => document.getElementById("coverLetter")?.click()}
                                                        >
                                                            {form.coverLetter ? "Re-upload Cover Letter" : "Upload Cover Letter"}
                                                        </Button>
                                                    </label>
                                                    {form.coverLetter && (
                                                        <div className="text-xs text-green-700 mt-1 break-all">
                                                            Uploaded: <a href={form.coverLetter} target="_blank" rel="noopener noreferrer" className="underline">{form.coverLetter}</a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        id="linkedInProfile"
                                                        name="linkedInProfile"
                                                        className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                        placeholder=""
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="linkedInProfile"
                                                        className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                                                    >
                                                        LinkedIn Profile (URL)
                                                    </label>
                                                </div>
                                            </div>
                                            {/* Error and submit button (full width) */}
                                            <div className="md:col-span-2 flex flex-col gap-2">
                                                {error && (
                                                    <div className="text-red-600 text-sm">{error}</div>
                                                )}
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className=""
                                                        onClick={() => setForm({
                                                            fullname: "",
                                                            email: "",
                                                            resume: "",
                                                            coverLetter: ""
                                                        })}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)] cursor-pointer"
                                                    >
                                                        Apply Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </div>
    )
}