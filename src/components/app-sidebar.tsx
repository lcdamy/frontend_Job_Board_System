"use client"
import * as React from "react"
import Image from 'next/image';
import { usePathname } from "next/navigation";
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { tabs } from '@/lib/constants'

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar className="bg-[#082777]">
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel className="flex flex-col gap-2 items-center mt-4 mb-16">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-6 justify-center ">
              {tabs.map((tab) => (
                <Link href={tab.url} key={tab.title} className='relative'>
                  <SidebarMenuItem
                    className={cn(
                      "flex flex-col items-center justify-center group/item",
                      pathName === tab.url && 'active-side-tab'
                    )}
                  >
                    <Image
                      src={tab.icon}
                      alt={`${tab.title} icon`}
                      width={24}
                      height={24}
                      className={cn(
                        'opacity-50 group-hover/item:opacity-100',
                        pathName === tab.url && 'opacity-100'
                      )}
                    />
                    <span
                      className={cn(
                        'mt-3 text-[rgba(255,255,255,0.5)] group-hover/item:text-white',
                        pathName === tab.url && 'text-white',
                        'hidden sm:inline' // Hide on small screens, show on >=sm
                      )}
                    >
                      {tab.title}
                    </span>
                  </SidebarMenuItem>
                </Link>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
