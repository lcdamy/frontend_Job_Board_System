'use client'
import React, { useLayoutEffect } from 'react'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "@/components/AppHeader"
import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2Icon, SlashIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { usePathname, useParams } from 'next/navigation';

interface props {
  children: React.ReactNode
}


function layout({ children }: props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const pathname = usePathname();
  const params = useParams();
  const breadcrumbs = getBreadcrumbs(pathname, params);

  useLayoutEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  if (status == 'loading' || status == undefined) {
    return (<div className='min-h-screen flex flex-col items-center justify-center'>
      <Loader2Icon className='animate-spin rotate ' />
    </div>)
  } else if (status == 'authenticated') {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Breadcrumb className='m-4'>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {idx === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage aria-current="page">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator>
                      <SlashIcon />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider >
    )
  }


}

function getBreadcrumbs(pathname: string, params: any) {
  const crumbs = [
    {
      label: 'Home',
      href: '/dashboard',
    },
  ];

  if (pathname.startsWith('/applications')) {
    crumbs.push({
      label: 'Applications',
      href: '/applications',
    });
    if (params?.id) {
      crumbs.push({
        label: `Application ${params.id}`,
        href: `/applications/${params.id}`,
      });
    }
  } else if (pathname.startsWith('/parameters')) {
    crumbs.push({
      label: 'Parameters',
      href: '/parameters',
    });
  } else if (params?.id) {
    // For job detail from Home
    crumbs.push({
      label: `Job ${params.id}`,
      href: `/${params.id}`,
    });
  }

  return crumbs;
}

export default layout