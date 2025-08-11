import { notFound } from "next/navigation";
import JobForm from "@/components/job/JobForm"; // adjust import if your form is elsewhere

interface EditJobPageProps {
  params: { id: string };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  // Optionally, you can validate the id here
  if (!params.id) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <JobForm jobId={params.id} />
    </div>
  );
}
