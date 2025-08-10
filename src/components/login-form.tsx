'use client'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { registerSchema, loginSchema, forgotPasswordSchema } from '@/lib/validation'
import toast, { Toaster } from 'react-hot-toast';
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react';


type LoginFormProps = {
  activeTab: 'login' | 'signup'
  onTabChange: (tab: 'login' | 'signup') => void
} & React.ComponentProps<"div">


export function LoginForm({ className, activeTab, onTabChange, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingForget, setLoadingForget] = useState(false);

  const searchParams = useSearchParams();

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      activateAccount(token);
    }
  }, [router]);

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingRegister(true);
    const form = e.currentTarget;
    const firstname = (form.elements.namedItem('firstname') as HTMLInputElement)?.value.trim();
    const lastname = (form.elements.namedItem('lastname') as HTMLInputElement)?.value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const re_password = (form.elements.namedItem('re_password') as HTMLInputElement)?.value;

    const { error } = registerSchema.validate({
      firstname,
      lastname,
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
          firstname,
          lastname,
          email,
          password,
          role: 'hr',
          profilePictureURL: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Registration successful!');
        //switch to login tab after successful registration
        onTabChange('login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error happened');
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingLogin(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email_login') as HTMLInputElement)?.value.trim();
    const password = (form.elements.namedItem('password_login') as HTMLInputElement)?.value;

    const { error } = loginSchema.validate({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      setLoadingLogin(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        mode: 'login',
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      } else {
        toast.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleSubmitForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingForget(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email_forget') as HTMLInputElement)?.value.trim();

    const { error } = forgotPasswordSchema.validate({ email });
    if (error) {
      toast.error(error.message);
      setLoadingForget(false);
      return;
    }

    if (!email) {
      toast.error('Email is required');
      setLoadingForget(false);
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Password reset link sent to your email!');
        setShowForgotPassword(false);
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error happened');
    } finally {
      setLoadingForget(false);
    }
  }

  const activateAccount = async (token: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/activate/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Account activated successfully!');
        router.push('/login');
      } else {
        toast.error(data.message || 'Activation failed');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      toast.error('An unexpected error happened');
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
        className={cn("flex flex-col gap-6", className)}
      >
        <Card className="overflow-hidden px-2 py-6 sm:px-4 sm:py-8 md:p-16 bg-[#E6EEF8] border-0 shadow-[0_10px_40px_10px_rgba(77,147,231,0.25)] w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto">
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
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <div>
                <Toaster position="top-right" />
              </div>
              {!showForgotPassword && (
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => onTabChange(val as 'login' | 'signup')}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-transparent"
                >
                  <TabsList className="w-full flex bg-transparent">
                    <TabsTrigger value="login" className="flex-1 auth-tab relative cursor-pointer focus:border-none focus:outline-none focus:ring-none data-[state=active]:border-none data-[state=active]:text-[#4B93E7] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#9bbff0] data-[state=active]:font-semibold  data-[state=active]:text-[32px] sm:data-[state=active]:text-[40px] font-light text-[20px] sm:text-[24px] bg-none ">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex-1 auth-tab relative cursor-pointer focus:border-none focus:outline-none focus:ring-none  data-[state=active]:border-none data-[state=active]:text-[#4B93E7] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#9bbff0] data-[state=active]:font-semibold  data-[state=active]:text-[32px] sm:data-[state=active]:text-[40px] font-light  text-[20px] sm:text-[24px] bg-none ">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-8 sm:mt-[40px]">
                    <motion.form onSubmit={handleSubmitLogin}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      <div className="flex flex-col gap-6">

                        <div className="relative">
                          <input
                            type="email"
                            id="email_outlined"
                            name="email_login"
                            className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                            placeholder=""
                            required
                          />
                          <label
                            htmlFor="email_outlined"
                            className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            Email
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type={showPasswordLogin ? "text" : "password"}
                            id="password_outlined"
                            name="password_login"
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
                            onClick={() => setShowPasswordLogin((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPasswordLogin ? "Hide password" : "Show password"}
                          >
                            {showPasswordLogin ? (
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

                        <div className="flex items-center justify-between mt-[-16px]">
                          <Label htmlFor="remember" className="text-xs">
                            <input
                              type="checkbox"
                              id="remember"
                              className="leading-tight"
                            />
                            Remember me
                          </Label>
                          <a href="#"
                            className="text-xs text-[#071C50]/70 cursor-pointer hover:text-[#071C50] hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowForgotPassword(true);
                            }}
                          >
                            Forgot password?
                          </a>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer  bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)] text-[#F3F8FF]">
                          {loadingLogin ? "Logging in..." : "Login"}
                        </Button>
                        <Button
                          type="button"
                          className="w-full flex items-center cursor-pointer gap-2 bg-[#4B93E7] hover:bg-accent-foreground text-[#F3F8FF]"
                          onClick={() => signIn('google')}
                        >
                          <span>Login with Google </span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                        </Button>
                      </div>
                    </motion.form>
                  </TabsContent>
                  <TabsContent value="signup" className="mt-8 sm:mt-[40px]">
                    <motion.form onSubmit={handleSubmitRegister}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >

                      <div className="flex flex-col gap-6">

                        <div className="relative">
                          <input
                            type="text"
                            id="signup-first-name"
                            name="firstname"
                            className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                            placeholder=""
                            required
                          />
                          <label
                            htmlFor="signup-first-name"
                            className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            First Name
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            id="signup-last-name"
                            name="lastname"
                            className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                            placeholder=""
                            required
                          />
                          <label
                            htmlFor="signup-last-name"
                            className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            Last Name
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
                        <Button type="submit" className="w-full cursor-pointer bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)]">
                          {loadingRegister ? "Signing up..." : "Sign Up"}
                        </Button>
                        <Button
                          type="button"
                          className="w-full cursor-pointer flex items-center gap-2 bg-[#4B93E7] hover:bg-accent-foreground text-[#F3F8FF]"
                          onClick={() => signIn('google')}
                        >
                          <span>Sign Up with Google</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                        </Button>
                      </div>
                    </motion.form>
                  </TabsContent>

                </Tabs>
              )}

              {showForgotPassword && (
                <div className='flex flex-col items-center w-full'>
                  <h1 className="text-[#4B93E7] font-semibold text-[20px] sm:text-[24px] mb-4 ">
                    Forgot password?
                  </h1>
                  <motion.form onSubmit={handleSubmitForgot}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <div className="flex flex-col gap-6">

                      <div className="relative">
                        <input
                          type="email"
                          id="email_forget"
                          name="email_forget"
                          className="block px-2 pb-2 pt-3 w-full text-xs text-gray-900 bg-[#DDEAFB] rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder:text-[#082777]"
                          placeholder=""
                          required
                        />
                        <label
                          htmlFor="email_forget"
                          className="absolute text-xs text-[#082777] dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] bg-[#DDEAFB] dark:bg-[#DDEAFB] px-1 peer-focus:px-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                          Email
                        </label>
                      </div>
                      <Button type="submit" className="w-full cursor-pointer  bg-[rgba(247,172,37)] hover:bg-[rgba(250,178,37)] text-[#F3F8FF]">
                        {loadingForget ? "Loading..." : "Submit"}
                      </Button>
                      <div className="flex justify-end mt-[-16px] w-full">
                        <div
                          className="flex items-center hover:underline gap-2 text-xs text-[#071C50]/70 cursor-pointer hover:text-[#071C50] transition-colors data-[state=active]:bg-[#F3F8FF]"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowForgotPassword(false);
                          }}
                        >
                          <MoveLeft />
                          Go Back
                        </div>
                      </div>

                    </div>
                  </motion.form>
                </div>
              )}

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
