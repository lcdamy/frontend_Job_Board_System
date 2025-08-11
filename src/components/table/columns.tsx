"use client"
import type { Job, Candidate, Onboarding } from "@/lib/types"
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


export const jobColumns: ColumnDef<Job>[] = [
    {
        accessorKey: "position",
        header: "",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src="/job-icon.png"
                    alt={row.getValue("position")}
                    width={30}
                    height={30}
                    className="text-white"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]"> {row.getValue("position")} </span>
                    <span className="text-xs text-[#071C50]/50 font-[300]">
                        {(() => {
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
                        })()}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "positionLeft",
        header: "Positions Left",
        cell: ({ row }) => <span className="font-[600]">{row.getValue("positionLeft")}</span>,
    },
    {
        accessorKey: "applicants",
        header: "Applicants",
        cell: ({ row }) => <span>{row.getValue("applicants")}</span>,
    },
    {
        accessorKey: "interviewed",
        header: "Interviewed",
        cell: ({ row }) => <span>{row.getValue("interviewed")}</span>,
    },
    {
        accessorKey: "rejected",
        header: "Rejected",
        cell: ({ row }) => <span>{row.getValue("rejected")}</span>,
    },
    {
        accessorKey: "feedbackPending",
        header: "Feedback Pending",
        cell: ({ row }) => <span>{row.getValue("feedbackPending")}</span>,
    },
    {
        accessorKey: "offered",
        header: "Offered",
        cell: ({ row }) => <span className="font-[600]">{row.getValue("offered")}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => (
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
                            onClick={() => console.log("Edit job", row.original)}
                        > Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log("Delete job", row.original)}
                        > Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];

export const candidateColumns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "names",
        header: "",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src={row.original.profileURL || "/default-avatar.png"}
                    alt={row.getValue("names")}
                    width={30}
                    height={30}
                    className="text-white rounded-full"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]">{row.getValue("names")}</span>
                    <span className="text-xs text-[#071C50]/50 font-[300]">
                        {row.original.title || "-"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Onboarding On",
        cell: ({ row }) =>
            <span>
                {(() => {
                    const dateStr = row.getValue("createdAt");
                    if (!dateStr) return "-";
                    const date = new Date(dateStr as string);
                    return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    });
                })()}
            </span>
    },

    {
        accessorKey: "tranings",
        header: "Training",
        cell: ({ row }) => <span>{row.getValue("tranings") || "-"}</span>,
    },
    {
        accessorKey: "documentation",
        header: "Documentation",
        cell: ({ row }) => <span>{row.getValue("tranings") || "-"}</span>,
    },
    {
        accessorKey: "supervisor",
        header: "Supervisor",
        cell: ({ row }) => {
            const supervisor = row.getValue("supervisor");
            return supervisor ? (
                <div className="flex justify-center">
                    <span className="flex items-center gap-2 py-1 px-2 rounded-md w-38 bg-[#DDEAFB] text-[#071C50]">
                        <Image
                            src={row.original.supervisorProfile || "/default-avatar.png"}
                            alt={row.getValue("supervisor")}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                        {row.getValue("supervisor")}
                    </span>
                </div>
            ) : (
                <div className="flex justify-center">
                    <span className="py-1 px-2 rounded-md inline-block w-38 bg-[#FFD6D6] text-[#B00020]">
                        Not Provided
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "project",
        header: "Project",
        cell: ({ row }) =>
            <span
                className={`py-1 px-2 rounded-md inline-block w-38 text-center ${row.getValue("project")
                    ? "bg-[#B0F1B6] text-[#087213]"
                    : "bg-[#FFD6D6] text-[#B00020]"
                    }`}
            >
                {row.getValue("project") || "Not Allocated"}
            </span>
    },
    {
        id: "actions",
        cell: ({ row }) => (
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
                            onClick={() => console.log("Edit candidate", row.original)}
                        > Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log("Delete candidate", row.original)}
                        > Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];

export const onboardingColumns: ColumnDef<Onboarding>[] = [
    {
        accessorKey: "name",
        header: "",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <Image
                    src={"/default-avatar.png"}
                    alt={row.getValue("name")}
                    width={30}
                    height={30}
                    className="text-white rounded-full"
                />
                <div className="flex flex-col items-start gap-2">
                    <span className="text-[#071C50] font-[600] text-[14px]">{row.getValue("name")}</span>
                    <span className="text-xs text-[#071C50]/50 font-[300]">
                        {row.original.title || "-"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "AppliedOn",
        header: "Applied On",
        cell: ({ row }) => <span>{row.getValue("AppliedOn")}</span>,
    },
    {
        accessorKey: "interviewRound",
        header: "Interview Round",
        cell: ({ row }) => <span>{row.getValue("interviewRound")}</span>,
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => {
            const assignedTo = row.getValue("assignedTo");
            return assignedTo ? (
                <div className="flex justify-center">
                    <span className="flex items-center gap-2 py-1 px-2 w-38 rounded-md bg-[#DDEAFB] text-[#071C50]">
                        <Image
                            src="/default-avatar.png"
                            alt={row.getValue("assignedTo")}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                        {row.getValue("assignedTo")}
                    </span>
                </div>
            ) : (
                <div className="flex justify-center">
                    <span className="py-1 px-2 rounded-md inline-block w-38 bg-[#FFD6D6] text-[#B00020]">
                        Not Provided
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => <span>{row.getValue("score")}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => (
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
                            onClick={() => console.log("Edit onboarding", row.original)}
                        > Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log("Delete onboarding", row.original)}
                        > Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];