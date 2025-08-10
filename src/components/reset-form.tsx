'use client'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema } from '@/lib/validation'
import toast, { Toaster } from 'react-hot-toast';
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'



export function ResetForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [loadingReset, setLoadingReset] = useState(false);

    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const searchParams = useSearchParams()
    const token = searchParams.get('token');

    const handleSubmitReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingReset(true);
        const form = e.currentTarget;
        const password = (form.elements.namedItem('password') as HTMLInputElement)?.value.trim();
        const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value.trim();

        const { error } = resetPasswordSchema.validate({ password, confirmPassword, token });
        if (error) {
            toast.error(error.message);
            setLoadingReset(false);
            return;
        }

        if (!password || !confirmPassword) {
            toast.error('Both password fields are required');
            setLoadingReset(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: password, token }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                toast.success('Password reset successful!');
                router.push('/login');
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('An unexpected error happened:', error);
            toast.error('An unexpected error happened');
        } finally {
            setLoadingReset(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key='login-page'
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "flex flex-col gap-6",
                    "w-full max-w-sm md:max-w-3xl mx-auto px-2 sm:px-4"
                )}
            >
                <Card className="overflow-hidden px-2 py-6 sm:px-4 sm:py-8 md:p-16 bg-[#E6EEF8] border-0 shadow-[0_10px_40px_10px_rgba(77,147,231,0.25)]">
                    <CardHeader className="text-center">
                        <Link href="/login">
                            <div className="flex items-center justify-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                                />
                                <h1 className="text-lg md:text-xl font-semibold">HR Management</h1>
                            </div>
                        </Link>
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-2 p-0">
                        <div className="hidden md:flex items-center justify-center md:border-r md:border-gray-200">
                            <Image
                                src="/login-signup-image.png"
                                alt="Image"
                                width={200}
                                height={200}
                                className="w-40 h-40 md:w-48 md:h-48"
                            />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <div>
                                <Toaster position="top-right" />
                            </div>
                            <div className='flex flex-col items-center w-full'>
                                <h1 className="text-[#4B93E7] font-semibold text-[20px] md:text-[24px] mb-4 ">
                                    Reset Password
                                </h1>
                                <motion.form
                                    onSubmit={handleSubmitReset}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <div className="flex flex-col gap-6">
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password_outlined"
                                                name="password"
                                                className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                placeholder=""
                                                required
                                            />
                                            <label
                                                htmlFor="password_outlined"
                                                className="absolute text-xs text-[#082777] dark:text-gray-400 bg-[#DDEAFB] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg- dark:bg-gray-900 px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                            >
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    // Eye open icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    // Eye closed icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                placeholder=""
                                                required
                                            />
                                            <label
                                                htmlFor="confirmPassword"
                                                className="absolute text-xs text-[#082777] dark:text-gray-400 bg-[#DDEAFB] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg- dark:bg-gray-900 px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                            >
                                                Confirm Password
                                            </label>
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    // Eye open icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    // Eye closed icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <Button type="submit" className="w-full cursor-pointer bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)] text-[#F3F8FF] text-xs md:text-base py-2 md:py-3">
                                            {loadingReset ? "Loading..." : "Submit"}
                                        </Button>
                                        <div className="flex justify-end mt-[-16px] w-full">
                                            <Link
                                                href="/login"
                                                className="flex items-center gap-2 text-xs text-[#071C50]/70 cursor-pointer hover:text-[#071C50] hover:underline transition-colors data-[state=active]:bg-[#F3F8FF]"
                                            >
                                                <MoveLeft />
                                                Go Back
                                            </Link>
                                        </div>
                                    </div>
                                </motion.form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-center text-xs space-y-1 mt-4 text-[#4B93E7]">
                    <div>
                        <a href="#" className="hover:text-primary underline underline-offset-4 transition-colors">
                            Release Notes
                        </a>
                    </div>
                    <div>Version 20.22.11</div>
                    <div>© 2023–24 HRM and Services</div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
