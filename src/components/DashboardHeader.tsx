import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"


function DashboardHeader() {
  const isLoading = false // Replace with your actual loading state

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-8 gap-2">
        <Skeleton className="h-7 w-32 mb-2 md:mb-0" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between md:mb-8 gap-2">
      <div className="flex-1" />
      <Button
      type="button"
      className="bg-[#4B93E7] text-white hover:bg-[#082777] hover:cursor-pointer transition-colors duration-200 ease-in-out w-full sm:w-auto"
      >
      <CirclePlus /> <span>Add Job</span>
      </Button>
    </div>
  )
}

export default DashboardHeader