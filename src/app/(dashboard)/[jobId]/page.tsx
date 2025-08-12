'use client'
import DashboardJobs from "@/components/DashboardJobs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetJobsAggregates } from "@/hooks/useGetJobsAggregates";


export default function Page() {
  const { aggregates } = useGetJobsAggregates();

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
      <div className="flex flex-col w-full">
        {/* Home page aggregation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Open Jobs */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-start gap-2">
              <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Open Jobs
              </span>
              <CardTitle className="text-2xl mt-2 font-bold text-foreground">{aggregates?.openJobs ?? 0}/{aggregates?.totalJobs ?? 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Since the beginning</p>
            </CardContent>
          </Card>

          {/* Closed Jobs */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-start gap-2">
              <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                Closed Jobs
              </span>
              <CardTitle className="text-2xl mt-2 font-bold text-foreground">{aggregates?.closedJobs ?? 0}/{aggregates?.totalJobs ?? 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Since the beginning</p>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-start gap-2">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                Locations
              </span>
              <CardTitle className="text-2xl mt-2 font-bold text-foreground">{aggregates?.locations ?? 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Since the beginning</p>
            </CardContent>
          </Card>

          {/* Most Demanded Job Type */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-start gap-2">
              <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                Most Demanded Job Type
              </span>
              <CardTitle className="text-2xl font-semibold text-foreground">{aggregates?.mostDemandedJobType ?? "N/A"}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <DashboardJobs />
      </div>
    </div>
  )
}