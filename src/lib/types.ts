export type JobApplicationStatus =
    | "under-review"
    | "interview-scheduled"
    | "offer-made"
    | "rejected"
    | "accepted"
    | "pending";

export type JobApplication = {
    id: number;
    jobId: number;
    userId: number;
    coverLetter: string;
    resumeURL: string;
    status: JobApplicationStatus;
    phoneNumber: string;
    email: string;
    linkedInProfile: string;
    jobTitle: string;
    names: string;
    appliedAt: string;
    updatedAt: string;
};

export type Job = {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
    deadline: string;
    status: "open" | "closed";
    type: string;
    postedBy: number;
    createdAt: string;
    updatedAt: string;
    applications: JobApplication[];
};

export type User = {
    id: string | number;
    names: string;
    email: string;
    type: "admin" | "user";
    registrationType: string;
    profilePictureURL?: string;
    createdAt?: string;
    updatedAt?: string;
    userStatus?: string;
}

export type Audit = {
    id: number;
    timestamp: string;
    createdAt: string | null;
    updatedAt: string | null;
    doneBy: string;
    ipAddress: string;
    activity: string;
    details: string;
    status: string;
}

export type Onboarding = {
    id: number
    name: string
    title: string
    AppliedOn: string
    interviewRound: string
    assignedTo: string | null
    score: number
}

export type CardItem = {
    title: string;
    count: number;
    status: string;
    imageSrc: string;
}
