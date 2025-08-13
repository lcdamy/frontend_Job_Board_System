'use client'
import { JobApplication } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { MdAlternateEmail } from "react-icons/md";
import { FaArrowLeft, FaDownload, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link';

export default function Page() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [jobApplication, setjobApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const accessToken = session?.user?.token;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchJobApplication = async (applicationId: string): Promise<JobApplication | null> => {
    const res = await fetch(`${apiUrl}/api/v1/application/detail/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    return res.json();
  };

  useEffect(() => {
    if (!applicationId) return;
    fetchJobApplication(applicationId)
      .then((res) => {
        if (res && (res as any).data) {
          setjobApplication((res as any).data);
        } else {
          setjobApplication(null);
        }
      })
      .catch(() => {
        toast.error("Failed to load application details");
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
        {/* Candidate Info Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <span className="h-4 border-l border-gray-300 mx-2" aria-hidden="true"></span>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-28 rounded" />
          </div>
        </div>

        {/* Toaster placeholder */}
        <div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Resume Download Skeleton */}
        <div>
          <div className="mt-2 flex flex-row gap-4 flex-wrap">
            <Skeleton className="h-8 w-40 rounded" />
            <Skeleton className="h-8 w-40 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
      <div className="flex flex-col w-full">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
          {/* Candidate Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{jobApplication?.names}</span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                  Candidate
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <MdAlternateEmail />
                  <span>{jobApplication?.email}</span>
                </div>
                <span className="h-4 border-l border-gray-300 mx-2" aria-hidden="true"></span>
                <div className="flex items-center gap-1">
                  <FaPhoneAlt />
                  <span>{jobApplication?.phoneNumber}</span>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 ">
                <FaLinkedin />
                <span className="text-xs text-gray-600">{jobApplication?.linkedInProfile}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {jobApplication?.jobTitle}
              </span>
              <span className="text-xs"><b>Applied on:</b> {jobApplication?.appliedAt ? new Date(jobApplication.appliedAt).toLocaleString() : ""}</span>
              <select
                className={`text-xs text-gray-600 border py-0.5 min-w-[80px] rounded ${jobApplication?.status === "pending"
                  ? "bg-yellow-100"
                  : jobApplication?.status === "under-review"
                    ? "bg-blue-100"
                    : jobApplication?.status === "interview-scheduled"
                      ? "bg-purple-100"
                      : jobApplication?.status === "offer-made"
                        ? "bg-green-100"
                        : jobApplication?.status === "rejected"
                          ? "bg-red-100"
                          : jobApplication?.status === "accepted"
                            ? "bg-emerald-100"
                            : "bg-gray-100"
                  }`}
                defaultValue={jobApplication?.status ?? ""}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  if (!jobApplication) return;
                  try {
                    const res = await fetch(`${apiUrl}/api/v1/application/update/${jobApplication.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                      body: JSON.stringify({ status: newStatus }),
                    });
                    if (!res.ok) throw new Error("Failed to update status");
                    setjobApplication({ ...jobApplication, status: newStatus as JobApplication["status"] });
                    toast.success("Status updated");
                  } catch {
                    toast.error("Failed to update status");
                  }
                }}
              >
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="interview-scheduled">Interview Scheduled</option>
                <option value="offer-made">Offer Made</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>

          <div>
            <Toaster position="top-right" />
          </div>

          {/* Resume Download */}
          <div>
            <div className="mt-2 flex flex-row gap-4 flex-wrap">
              <a
                href={jobApplication?.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border rounded px-2 py-1 text-gray-700 bg-white transition-all duration-200 hover:bg-blue-50 hover:text-gray-700 hover:shadow-md hover:scale-105 group"
              >
                <Image
                  src={
                    jobApplication?.resumeURL && jobApplication.resumeURL.endsWith('docx')
                      ? '/word.png'
                      : '/pdf.png'
                  }
                  alt="Resume file"
                  width={15}
                  height={15}
                  className="transition-transform duration-200 group-hover:scale-125"
                />
                <span className="text-xs transition-colors duration-200 group-hover:underline group-hover:font-semibold">
                  Resume
                </span>
                <FaDownload />
              </a>
              <a
                href={jobApplication?.coverLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border rounded px-2 py-1 text-gray-700 bg-white transition-all duration-200 hover:bg-blue-50 hover:text-gray-700 hover:shadow-md hover:scale-105 group"
              >
                <Image
                  src={
                    jobApplication?.coverLetter && jobApplication.coverLetter.endsWith('docx')
                      ? '/word.png'
                      : '/pdf.png'
                  }
                  alt="Cover Letter file"
                  width={15}
                  height={15}
                />
                <span className="text-xs transition-colors duration-200 group-hover:underline group-hover:font-semibold">Cover Letter</span>
                <FaDownload />
              </a>
            </div>
          </div>
        </div>
        {/* Back button at the bottom */}
        <div className="mt-16 flex items-center justify-center">
          <Link href="/applications" className="w-48 flex items-center gap-2 border rounded px-2 py-1 text-gray-700 bg-white transition-all duration-200 hover:bg-blue-50 hover:text-gray-700 hover:shadow-md hover:scale-105 group">
            <FaArrowLeft />
            <span className="text-xs transition-colors duration-200 group-hover:underline group-hover:font-semibold">Back to Applications</span>
          </Link>
        </div>
      </div>
    </div>

  )
}