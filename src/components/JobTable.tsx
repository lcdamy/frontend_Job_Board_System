import React from "react";
import DashboardJobs from "@/components/DashboardJobs";
import DashboardCandidates from "@/components/DashboardApplication"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


function Job() {
    return (
        <div className="mt-4">
            <h1 className="text-[#071C50] font-[600] text-[22px] mb-4">Require Attention</h1>
            <Tabs defaultValue="jobs">
                <TabsList className="flex flex-wrap gap-2 bg-transparent">
                    <TabsTrigger
                        value="jobs"
                        className="cursor-pointer shadow-none outline-none ring-0 rounded-none border-b-4 border-transparent data-[state=inactive]:text-[#071C50]/50 font-[400] data-[state=active]:font-[600] data-[state=inactive]:font-[400] data-[state=active]:border-b-[#F7AC25] data-[state=active]:shadow-none transition-colors data-[state=inactive]:hover:text-[#071C50]/70"
                    >
                        Jobs
                    </TabsTrigger>
                    <TabsTrigger
                        value="candidates"
                        className="cursor-pointer shadow-none outline-none ring-0 rounded-none border-b-4 border-transparent data-[state=inactive]:text-[#071C50]/50 font-[400] data-[state=active]:font-[600] data-[state=inactive]:font-[400] data-[state=active]:border-b-[#F7AC25] data-[state=active]:shadow-none transition-colors data-[state=inactive]:hover:text-[#071C50]/70"
                    >
                        Candidates
                    </TabsTrigger>
                    <TabsTrigger
                        value="onboarding"
                        className="cursor-pointer shadow-none outline-none ring-0 rounded-none border-b-4 border-transparent data-[state=inactive]:text-[#071C50]/50 font-[400] data-[state=active]:font-[600] data-[state=inactive]:font-[400] data-[state=active]:border-b-[#F7AC25] data-[state=active]:shadow-none transition-colors data-[state=inactive]:hover:text-[#071C50]/70"
                    >
                        Onboarding
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="jobs">
                    <DashboardJobs />
                </TabsContent>
                <TabsContent value="candidates">
                    <DashboardCandidates />
                </TabsContent>
     
            </Tabs>
        </div>
    )
}
export default Job