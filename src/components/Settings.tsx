'use client'
import React, { useRef, useState } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import DashboardAudits from "@/components/DashboardAudits";
import DashboardUsers from "@/components/DashboardUsers";
import { registerSchema } from '@/lib/validation'
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
);

function Settings() {
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingRegister(true);

        const form = e.currentTarget;
        const names = (form.elements.namedItem('names') as HTMLInputElement)?.value.trim();
        const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim();
        const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
        const re_password = (form.elements.namedItem('re_password') as HTMLInputElement)?.value;

        const { error } = registerSchema.validate({
            names,
            email,
            password,
            confirmPassword: re_password
        });
        if (error) {
            toast.error(error.message);
            setLoadingRegister(false);
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    names,
                    email,
                    password,
                    type: 'admin',
                    registrationType: 'manual',
                    profilePictureURL: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            toast.success('Registration successful!');
            formRef.current?.reset();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error happened');
        } finally {
            setLoadingRegister(false);
        }
    };

    return (
        <div className="mt-4">
            <Tabs defaultValue="jobs">
                <TabsList className="flex flex-wrap gap-2 bg-transparent">
                    <TabsTrigger
                        value="jobs"
                        className="cursor-pointer shadow-none outline-none ring-0 rounded-none border-b-4 border-transparent data-[state=inactive]:text-[#071C50]/50 font-[400] data-[state=active]:font-[600] data-[state=inactive]:font-[400] data-[state=active]:border-b-[#F7AC25] data-[state=active]:shadow-none transition-colors data-[state=inactive]:hover:text-[#071C50]/70"
                    >
                        Users
                    </TabsTrigger>
                    <TabsTrigger
                        value="candidates"
                        className="cursor-pointer shadow-none outline-none ring-0 rounded-none border-b-4 border-transparent data-[state=inactive]:text-[#071C50]/50 font-[400] data-[state=active]:font-[600] data-[state=inactive]:font-[400] data-[state=active]:border-b-[#F7AC25] data-[state=active]:shadow-none transition-colors data-[state=inactive]:hover:text-[#071C50]/70"
                    >
                        Audit logs
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="jobs">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 min-w-0">
                                <DashboardUsers />
                            </div>
                            <Card className="w-full md:w-[380px]">
                                <CardHeader className="text-lg font-semibold pb-2">
                                    <span className='border-b-4 border-[#F7AC25]'> Add a new admin</span>

                                </CardHeader>
                                <CardContent>
                                    <form ref={formRef} onSubmit={handleSubmitRegister} className="w-full" autoComplete="off">
                                        <div className="flex flex-col gap-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="signup-names"
                                                    name="names"
                                                    className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                    placeholder=""
                                                    required
                                                />
                                                <label
                                                    htmlFor="signup-names"
                                                    className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Names
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="signup-email"
                                                    name="email"
                                                    className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                    placeholder=""
                                                    required
                                                />
                                                <label
                                                    htmlFor="signup-email"
                                                    className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Email
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="signup-password"
                                                    name="password"
                                                    className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                    placeholder=""
                                                    required
                                                />
                                                <label
                                                    htmlFor="signup-password"
                                                    className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                                    <EyeIcon open={showPassword} />
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="signup-confirm-password"
                                                    name="re_password"
                                                    className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                                                    placeholder=""
                                                    required
                                                />
                                                <label
                                                    htmlFor="signup-confirm-password"
                                                    className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Confirm Password
                                                </label>
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    <EyeIcon open={showConfirmPassword} />
                                                </button>
                                            </div>
                                            <Button type="submit" className="w-full cursor-pointer bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)]" disabled={loadingRegister}>
                                                {loadingRegister ? "Signing up..." : "Sign Up"}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                            <Toaster position="top-right" />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="candidates">
                    <DashboardAudits />
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Settings
