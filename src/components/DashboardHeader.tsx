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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState, useRef, useEffect } from "react"
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { addNewJobSchema } from "@/lib/validation"
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';


// New: Accepts optional jobToEdit and onEditJob callback props
function DashboardHeader({ jobToEdit = null, onEditJob = null }: { jobToEdit?: any, onEditJob?: any }) {
  const [loadingJob, setLoadingJob] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const accessToken = session?.user?.token;


  // Local state for form fields to support controlled components and prefill
  const [formState, setFormState] = useState({
    title: '',
    company: '',
    location: '',
    deadline: '',
    type: '',
  });

  // Tiptap editor for description
  const [description, setDescription] = useState('');
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    immediatelyRender: false, // Fix SSR hydration error
  });

  // When jobToEdit changes, prefill form
  useEffect(() => {
    if (jobToEdit) {
      setFormState({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        location: jobToEdit.location || '',
        deadline: jobToEdit.deadline ? jobToEdit.deadline.slice(0, 10) : '',
        type: jobToEdit.type || '',
      });
      setDescription(jobToEdit.description || '');
      if (editor) editor.commands.setContent(jobToEdit.description || '');
      setDialogOpen(true);
    } else {
      setFormState({
        title: '',
        company: '',
        location: '',
        deadline: '',
        type: '',
      });
      setDescription('');
      if (editor) editor.commands.setContent('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobToEdit, editor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingJob(true);

    const { title, company, location, deadline, type } = formState;
    // Use description from Tiptap
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
      let response;
      if (jobToEdit && jobToEdit.id) {
        // Edit mode: update job
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/job/update/${jobToEdit.id}`,
          {
            method: 'PUT',
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
              status: jobToEdit.status || 'open',
            }),
          });
      } else {
        // Add mode: create job
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/job/create`, {
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
      }

      const data = await response.json();
      if (data.status === 'success') {
        toast.success(jobToEdit ? 'Job updated successfully!' : 'Job added successfully!');
        mutate((key) => typeof key === 'string' && key.includes('/api/v1/job/list'));
        setFormState({
          title: '',
          company: '',
          location: '',
          deadline: '',
          type: '',
        });
        setDescription('');
        if (editor) editor.commands.setContent('');
        if (formRef.current) formRef.current.reset();
        setDialogOpen(false);
        if (onEditJob) onEditJob(null); // clear edit state in parent
      } else {
        toast.error(data.message || (jobToEdit ? 'Failed to update job' : 'Failed to add job'));
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoadingJob(false);
    }
  };

  const handleOpenAdd = () => {
    setDialogOpen(true);
    setFormState({
      title: '',
      company: '',
      location: '',
      deadline: '',
      type: '',
    });
    setDescription('');
    if (editor) editor.commands.setContent('');
    if (onEditJob) onEditJob(null); // clear edit state in parent
  };

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between md:mb-4 gap-2">
      <div className="flex-1" />
      <Button
        type="button"
        className="bg-[#4B93E7] cursor-pointer text-white hover:bg-[#082777] transition-colors duration-200 w-full sm:w-auto"
        onClick={handleOpenAdd}
      >
        <CirclePlus className="mr-2" /> Add Job
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <DialogContent className="sm:max-w-[650px] bg-[#E6EEF8]">
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            <DialogHeader className="mb-12">
              <span className='border-b-4 border-[#F7AC25]'>
                {jobToEdit ? 'Edit Job' : 'Add new Job'}
              </span>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                  placeholder=""
                  required
                  value={formState.title}
                  onChange={handleChange}
                />
                <Label
                  htmlFor="title"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Job Title
                </Label>
              </div>

              <div className="relative">
                <div
                  className="block px-2 pb-2 pt-3 w-full min-h-[160px] max-h-[240px] overflow-y-auto text-xs text-gray-900 bg-[#DDEAFB] border border-gray-300 appearance-none dark:text-white dark:border-gray-600 placeholder:text-[#082777] rounded-lg"
                >
                  <EditorContent editor={editor} />
                </div>
                <Label
                  htmlFor="description"
                  className="absolute text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Description
                </Label>
              </div>


              <div className="relative">
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                  placeholder=""
                  required
                  value={formState.company}
                  onChange={handleChange}
                />
                <Label
                  htmlFor="company"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Company
                </Label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                  placeholder=""
                  required
                  value={formState.location}
                  onChange={handleChange}
                />
                <Label
                  htmlFor="location"
                  className="absolute text-xs text-[#082777] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
                >
                  Location
                </Label>
              </div>
              <div className="relative">
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                  placeholder=""
                  required
                  value={formState.deadline}
                  onChange={handleChange}
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
                  className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                  required
                  value={formState.type}
                  onChange={handleChange}
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
                  className="cursor-pointer"
                  type="button"
                  onClick={() => {
                    setFormState({
                      title: '',
                      company: '',
                      location: '',
                      deadline: '',
                      type: '',
                    });
                    setDescription('');
                    if (formRef.current) formRef.current.reset();
                    setDialogOpen(false);
                    if (onEditJob) onEditJob(null);
                  }}
                  disabled={loadingJob}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)] cursor-pointer"
                disabled={loadingJob}
              >
                {loadingJob ? (jobToEdit ? "Saving..." : "Saving...") : (jobToEdit ? "Update" : "Save")}
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