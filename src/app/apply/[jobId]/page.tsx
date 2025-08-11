'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
};

const fetchJob = async (jobId: string): Promise<Job | null> => {
    // Replace with your actual API endpoint
    const res = await fetch(`/api/jobs/${jobId}`);
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
            .then(setJob)
            .catch(() => setError("Failed to load job details"))
            .finally(() => setLoading(false));
    }, [jobId]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        // Replace with your actual API endpoint
        const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
        if (res.ok) setApplied(true);
        else setError("Failed to apply for the job");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!job) return <div>Job not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="mb-2 text-gray-600">
                {job.company} &middot; {job.location}
            </div>
            <div className="mb-4">{job.description}</div>
            <h2 className="font-semibold mb-1">Requirements:</h2>
            <ul className="list-disc list-inside mb-4">
                {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                ))}
            </ul>
            {applied ? (
                <div className="text-green-600 font-semibold">You have applied for this job!</div>
            ) : (
                <form onSubmit={handleApply}>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Apply Now
                    </button>
                </form>
            )}
        </div>
    );
}