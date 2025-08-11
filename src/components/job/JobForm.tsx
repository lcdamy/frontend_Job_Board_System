"use client"
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useGetJob } from "@/hooks/useGetJob";
import type { Job } from "@/lib/types";

interface JobFormProps {
  jobId?: string;
  onClose?: () => void;
}

export default function JobForm({ jobId, onClose }: JobFormProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Job>();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch job data if editing
  const { job, isLoading } = jobId ? useGetJob(jobId) : { job: null, isLoading: false };

  useEffect(() => {
    if (jobId && job) {
      reset(job); // Populate form with job data
    }
  }, [jobId, job, reset]);

  const onSubmit = async (data: Job) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const accessToken = session?.user?.token;
    if (!accessToken) {
      toast.error("No access token found.");
      return;
    }
    try {
      const url = jobId
        ? `${apiUrl}/api/v1/job/update/${jobId}`
        : `${apiUrl}/api/v1/job/create`;
      const method = jobId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save job");
      toast.success(jobId ? "Job updated successfully" : "Job created successfully");
      mutate((key) => typeof key === "string" && key.includes("/api/v1/job/list"));
      if (onClose) onClose();
      else router.push("/dashboard/jobs");
    } catch (e) {
      toast.error("Failed to save job");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Title</label>
        <input {...register("title", { required: true })} className="input" />
      </div>
      <div>
        <label className="block mb-1">Company</label>
        <input {...register("company", { required: true })} className="input" />
      </div>
      <div>
        <label className="block mb-1">Location</label>
        <input {...register("location", { required: true })} className="input" />
      </div>
      <div>
        <label className="block mb-1">Deadline</label>
        <input type="date" {...register("deadline", { required: true })} className="input" />
      </div>
      <div>
        <label className="block mb-1">Type</label>
        <select {...register("type", { required: true })} className="input">
          <option value="">Select type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select {...register("status", { required: true })} className="input">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {jobId ? "Update Job" : "Add Job"}
      </button>
    </form>
  );
}