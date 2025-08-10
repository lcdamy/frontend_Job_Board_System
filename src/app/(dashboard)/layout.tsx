'use client'
import React,{useLayoutEffect} from 'react'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "@/components/AppHeader"
import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react'


interface props {
  children: React.ReactNode
}

function layout({ children }: props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useLayoutEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  if(status=='loading' ||status==undefined){    
    return (<div className='min-h-screen flex flex-col items-center justify-center'>
      <Loader2Icon className='animate-spin rotate '/>
    </div>)
  }else if(status=='authenticated'){
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider >
    )
  }

 
}

export default layout