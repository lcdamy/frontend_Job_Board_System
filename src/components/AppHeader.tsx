'use client'
import React, { useEffect } from 'react';
import { Separator } from "@/components/ui/separator"
import Image from 'next/image';
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from 'lucide-react';
import { signOut, signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton"

function AppHeader() {
  const router = useRouter()
  const logout = () => {
    signOut({ callbackUrl: '/login' })
  }
  const { data: session, status } = useSession();

  useEffect(() => {
    registerUser();
  }, [session, status]);

  const registerUser = async () => {
    if (status === 'authenticated' && !session?.user?.token) {
      try {
        await signIn("credentials", {
          redirect: false,
          email: session.user.email,
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ')[1] || '',
          mode: 'silent'
        });//refresh the session to get the token
      } catch (error) {
        console.error('Error silence login user:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <header className="flex h-16 w-full bg-white border-b border-[#0827773D]/24 shadow-md shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          {/* Sidebar trigger skeleton */}
          <Skeleton className="w-8 h-8 rounded" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center justify-between w-full gap-2">
            {/* Search bar skeleton */}
            <Skeleton className="h-8 w-40" />
            <div className="flex-1" />
            {/* Avatar skeleton */}
            <Skeleton className="w-8 h-8 rounded-full" />
            {/* Name skeleton */}
            <Skeleton className="h-6 w-24 ml-2 hidden md:inline-block" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-16 w-full bg-white border-b border-[#0827773D]/24 shadow-md shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-2 sm:px-4">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center border bg-[#E5EDF970] rounded-md px-2 py-1 w-30 sm:w-40 md:w-89 focus-within:ring-2 focus-within:ring-primary">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* Spacer to push avatar to the right */}
          <div className="flex-1" />

          {/* Avatar with dropdown on the right */}
          <div className="relative">
            <details className="group">
              <summary className="list-none cursor-pointer flex items-center gap-2">
                <Image
                  width={32}
                  height={32}
                  src='https://rci-files.lon1.digitaloceanspaces.com/rci-files/1750843685670-149071.png'
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="hidden md:inline text-[#071C50] font-[600] text-sm"> {session?.user?.name} </span>
                <ChevronDown className='text-[#071C50]/50' />
              </summary>
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 ">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push('#')}
                >
                  <span className="hidden md:block">
                    Profile
                  </span>
                    <span className="block md:hidden">{session?.user?.name}</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader