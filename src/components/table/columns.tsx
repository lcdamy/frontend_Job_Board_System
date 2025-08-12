"use client"
import type { Job, JobApplication, User, Audit } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { mutate } from "swr";

// Extend the Window interface to include onEditJob
declare global {
    interface Window {
        onEditJob?: (job: Job) => void;
    }
}


export const jobColumns: ColumnDef<Job>[] = [
    {
        accessorKey: "title",
        header: "Job Title",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src="/job-icon.png"
                    alt={row.getValue("title")}
                    width={30}
                    height={30}
                    className="text-white"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]">{row.getValue("title")}</span>
                    <span className="text-xs text-[#071C50]/50 font-[300]">
                        {row.original.company || "-"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <span>{row.getValue("location") || "-"}</span>,
    },
    {
        accessorKey: "deadline",
        header: "Deadline",
        cell: ({ row }) => {
            const dateStr = row.getValue("deadline");
            if (!dateStr) return "-";
            const date = new Date(dateStr as string);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type");
            let bg = "";
            let text = "";
            switch (type) {
                case "full-time":
                    bg = "bg-[#FFF4B5]";
                    text = "text-[#B87333]";
                    break;
                case "part-time":
                    bg = "bg-[#DDEAFB]";
                    text = "text-[#071C50]";
                    break;
                case "contract":
                    bg = "bg-[#F7AC25]/20";
                    text = "text-[#F7AC25]";
                    break;
                case "internship":
                    bg = "bg-[#B5B5F7]/20";
                    text = "text-[#4B4BFF]";
                    break;
                case "freelance":
                    bg = "bg-[#FFD6D6]";
                    text = "text-[#B00020]";
                    break;
                default:
                    bg = "bg-gray-100";
                    text = "text-gray-500";
            }
            return (
                <span className={`py-1 px-2 rounded-md inline-block w-38 text-center ${bg} ${text}`}>
                    {(type as string) || "-"}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Posted",
        cell: ({ row }) => {
            const dateStr = row.original.createdAt || row.getValue("createdAt");
            if (!dateStr) return "-";
            const date = new Date(dateStr as string);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return "Today";
            if (diffDays === 1) return "1 day ago";
            if (diffDays < 30) return `${diffDays} days ago`;
            const diffMonths = Math.floor(diffDays / 30);
            if (diffMonths === 1) return "1 month ago";
            if (diffMonths < 12) return `${diffMonths} months ago`;
            const diffYears = Math.floor(diffMonths / 12);
            if (diffYears === 1) return "1 year ago";
            return `${diffYears} years ago`;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("status") === "open"
                    ? "bg-[#B0F1B6] text-[#087213]"
                    : "bg-[#FFD6D6] text-[#B00020]"
                    }`}
            >
                {row.getValue("status") || "-"}
            </span>
        ),
    },
    {
        accessorKey: "applications",
        header: "Applications",
        cell: ({ row }) => {
            const applications = row.original.applications;
            const count = Array.isArray(applications) ? applications.length : 0;
            return <span>{count}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { data: session } = useSession();
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="sr-only">Open menu</span>
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.onEditJob) {
                                        window.onEditJob(row.original);
                                    }
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={async () => {
                                    // Create dialog and center it
                                    const dialog = document.createElement("dialog");
                                    dialog.className =
                                        "rounded-lg p-6 bg-white shadow-lg flex flex-col items-center justify-center z-[9999]";
                                    dialog.style.position = "fixed";
                                    dialog.style.top = "50%";
                                    dialog.style.left = "50%";
                                    dialog.style.transform = "translate(-50%, -50%)";
                                    dialog.style.margin = "0";
                                    dialog.innerHTML = `
                                        <div>
                                            <h2 class="text-lg font-semibold mb-2">Delete Job?</h2>
                                            <p class="mb-4">Are you sure you want to delete this job? This action cannot be undone.</p>
                                            <div class="flex justify-end gap-2">
                                                <button id="cancel-btn" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
                                                <button id="confirm-btn" class="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
                                            </div>
                                        </div>
                                    `;
                                    document.body.appendChild(dialog);
                                    dialog.showModal();

                                    dialog.querySelector("#cancel-btn")?.addEventListener("click", () => {
                                        dialog.close();
                                        dialog.remove();
                                    });

                                    dialog.querySelector("#confirm-btn")?.addEventListener("click", async () => {
                                        const accessToken = session?.user?.token;
                                        if (!accessToken) {
                                            console.error("No access token found");
                                            dialog.close();
                                            dialog.remove();
                                            return;
                                        }

                                        try {
                                            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                                            const response = await fetch(
                                                `${apiUrl}/api/v1/job/delete/${row.original.id}`,
                                                {
                                                    method: "DELETE",
                                                    headers: {
                                                        Authorization: `Bearer ${accessToken}`,
                                                    },
                                                }
                                            );

                                            if (!response.ok) {
                                                throw new Error("Failed to delete job");
                                            }

                                            toast.success("The job was deleted successfully.");
                                            // Refresh the job list using SWR mutate
                                            mutate((key) =>
                                                typeof key === "string" && key.includes("/api/v1/job/list")
                                            );
                                        } catch (error) {
                                            if (typeof window !== "undefined") {
                                                // @ts-ignore
                                                if (window.toast) {
                                                    // @ts-ignore
                                                    window.toast({
                                                        title: "Error",
                                                        description: "Failed to delete job.",
                                                        variant: "destructive",
                                                    });
                                                } else {
                                                    alert("Failed to delete job.");
                                                }
                                            }
                                            console.error("Error deleting job", error);
                                        } finally {
                                            dialog.close();
                                            dialog.remove();
                                        }
                                    });
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const applicationColumns: ColumnDef<JobApplication>[] = [
    {
        accessorKey: "names",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src="/default-avatar.png"
                    alt={row.getValue("names")}
                    width={30}
                    height={30}
                    className="text-white rounded-full"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]">{row.getValue("names")}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span>{row.getValue("email") || "-"}</span>,
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => <span>{row.getValue("phoneNumber") || "-"}</span>,
    },
    {
        accessorKey: "jobTitle",
        header: "Job Title",
        cell: ({ row }) => <span>{row.getValue("jobTitle") || "-"}</span>,
    },
    {
        accessorKey: "appliedAt",
        header: "Applied On",
        cell: ({ row }) => {
            const dateStr = row.getValue("appliedAt");
            if (!dateStr) return "-";
            const date = new Date(dateStr as string);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${
                    row.getValue("status") === "pending"
                        ? "bg-yellow-100"
                        : row.getValue("status") === "under-review"
                        ? "bg-blue-100"
                        : row.getValue("status") === "interview-scheduled"
                        ? "bg-purple-100"
                        : row.getValue("status") === "offer-made"
                        ? "bg-green-100"
                        : row.getValue("status") === "rejected"
                        ? "bg-red-100"
                        : row.getValue("status") === "accepted"
                        ? "bg-emerald-100"
                        : "bg-gray-100"
                }`}
            >
                {row.getValue("status") || "-"}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="sr-only">Open menu</span>
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/applications/${row.original.id}`);
                                }}
                            >
                                view
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: "names",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src="/default-avatar.png"
                    alt={row.getValue("names")}
                    width={30}
                    height={30}
                    className="text-white rounded-full"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]">{row.getValue("names")}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span>{row.getValue("email")}</span>,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("type") === "admin"
                    ? "bg-[#B0F1B6] text-[#087213]"
                    : row.getValue("type") === "job-seeker"
                        ? "bg-[#DDEAFB] text-[#071C50]"
                        : "bg-[#FFD6D6] text-[#B00020]"
                    }`}
            >
                {row.getValue("type")}
            </span>
        ),
    },
    {
        accessorKey: "registrationType",
        header: "Registration Type",
        cell: ({ row }) => <span>{row.getValue("registrationType")}</span>,
    },
    {
        accessorKey: "userStatus",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("userStatus") === "active"
                    ? "bg-[#B0F1B6] text-[#087213]"
                    : "bg-[#FFD6D6] text-[#B00020]"
                    }`}
            >
                {row.getValue("userStatus")}
            </span>
        ),
    },
];

export const auditColumns: ColumnDef<Audit>[] = [
    {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ row }) => <span>{row.getValue("timestamp")}</span>,
    },

    {
        accessorKey: "doneBy",
        header: "Done By",
        cell: ({ row }) => <span>{row.getValue("doneBy")}</span>,
    },
    {
        accessorKey: "ipAddress",
        header: "IP Address",
        cell: ({ row }) => <span>{row.getValue("ipAddress")}</span>,
    },
    {
        accessorKey: "activity",
        header: "Activity",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("activity") === "GET"
                    ? "text-[#087213]"
                    : row.getValue("activity") === "POST"
                        ? "text-[#F7AC25]"
                        : row.getValue("activity") === "DELETE"
                            ? "text-[#B00020]"
                            : ""
                    }`}
            >
                {row.getValue("activity")}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("status") === "success"
                    ? "bg-[#B0F1B6] text-[#087213]"
                    : "bg-[#FFD6D6] text-[#B00020]"
                    }`}
            >
                {row.getValue("status")}
            </span>
        ),
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => <span>{row.getValue("details")}</span>,
    },

];