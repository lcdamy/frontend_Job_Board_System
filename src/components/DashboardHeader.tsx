'use client'
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { mutate } from 'swr';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { addNewJobSchema } from "@/lib/validation"
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

function DashboardHeader() {
  const [loadingJob, setLoadingJob] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const accessToken = session?.user?.token;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingJob(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')?.toString().trim() || '';
    const description = formData.get('description')?.toString().trim() || '';
    const company = formData.get('company')?.toString().trim() || '';
    const location = formData.get('location')?.toString().trim() || '';
    const deadline = formData.get('deadline')?.toString() || '';
    const type = formData.get('type')?.toString() || '';

    const { error } = addNewJobSchema.validate({
      title,
      description,
      company,
      location,
      deadline,
      type
    });

    if (error) {
      toast.error(error.message);
      setLoadingJob(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/job/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title,
          description,
          company,
          location,
          deadline,
          type,
          status: "open"
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Job added successfully!');
        // reload the job list
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("jobListUpdated"));
        }
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/job/list?page=1&limit=10`);
        form.reset();
        setDialogOpen(false);
      } else {
        toast.error(data.message || 'Failed to add job');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoadingJob(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between md:mb-4 gap-2">
      <div className="flex-1" />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="bg-[#4B93E7] text-white hover:bg-[#082777] transition-colors duration-200 w-full sm:w-auto"
          >
            <CirclePlus className="mr-2" /> Add Job
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            <DialogHeader className="mb-12">
              <span className='border-b-4 border-[#F7AC25]'>Add new Job</span>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <div className="relative">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer"
                  placeholder=""
                  required
                  autoFocus
                />
                <Label
                  htmlFor="title"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Job Title
                </Label>
              </div>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  required
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer min-h-[80px]"
                  placeholder=""
                />
                <Label
                  htmlFor="description"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Description
                </Label>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  id="company"
                  name="company"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer"
                  placeholder=""
                  required
                />
                <Label
                  htmlFor="company"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Company
                </Label>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  id="location"
                  name="location"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer"
                  placeholder=""
                  required
                />
                <Label
                  htmlFor="location"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Location
                </Label>
              </div>
              <div className="relative">
                <Input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer"
                  placeholder=""
                  required
                />
                <Label
                  htmlFor="deadline"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Deadline
                </Label>
              </div>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 focus:border-blue-600 peer"
                  required
                  defaultValue=""
                >
                  <option value="" disabled hidden></option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                <Label
                  htmlFor="type"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Type
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    formRef.current?.reset();
                  }}
                  disabled={loadingJob}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)]"
                disabled={loadingJob}
              >
                {loadingJob ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
            <div>
              <Toaster position="top-right" />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardHeader