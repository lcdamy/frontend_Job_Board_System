'use client'
import { Suspense, useLayoutEffect, useState } from 'react'
import { LoginForm } from '@/components/login-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2Icon } from 'lucide-react'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const { status } = useSession()
  const router = useRouter()

  useLayoutEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  const images =
    activeTab === 'login'
      ? ['/Vector-login-2.png', '/Vector-login-1.png']
      : ['/Vector-signup-2.png', '/Vector-signup-1.png']

  return (
    <div className="relative bg-[#E5EDF9] flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      {/* Animated background images */}
      <AnimatePresence mode="wait">
        {/* Left image (from top-left to center) */}
        <motion.img

          src={images[0]}
          alt=""
          initial={{ x: '-100%', y: '-100%', opacity: 0 }}
          animate={{ x: '-50%', y: '-50%', opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 left-1/2 h-[70%] object-contain pointer-events-none select-none z-0"
        />

        <motion.img
          src={images[1]}
          alt=""
          initial={{ x: '100%', y: '-100%', opacity: 0 }}
          animate={{ x: '-50%', y: '-50%', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute top-1/2 left-1/2 h-[80%] object-contain pointer-events-none select-none z-0"
        />
      </AnimatePresence>

      {/* Form section */}
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div className='min-h-screen flex flex-col items-center justify-center'>
          <Loader2Icon className='animate-spin rotate ' />
        </div>}>
          <LoginForm activeTab={activeTab} onTabChange={setActiveTab} />
        </Suspense>
      </div>
    </div>
  )
}
