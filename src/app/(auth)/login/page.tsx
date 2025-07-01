"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { LoginSchema, LoginType } from "@/src/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { login } from "@/src/services/auth";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailSignInLoading, setEmailSignInLoading] = useState(false);
  const methods = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });
  const { register, handleSubmit, formState } = methods;
  const { errors } = formState;
  const router = useRouter();

  const signIn = handleSubmit(async (data: LoginType) => {
    setEmailSignInLoading(true);
    try {
      const validation = LoginSchema.safeParse(data);
      if (!validation.success) {
        throw new Error(`Input validation failed: ${validation.error.errors}`);
      }
      const response = await login({
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (response?.error) {
        toast.error(response.error);
        setEmailSignInLoading(false);
        return;
      }

      const session = await getSession();

      if (!session) {
        toast.error("Invalid Credentials");
        setEmailSignInLoading(false);
        return;
      }

      toast.success("Welcome Back");
      router.push("/");
    } catch (error) {
      setEmailSignInLoading(false);
      console.log(error);
    }
  });

  return (
    <div className='w-full space-y-8 sm:max-w-lg'>
      {/* Header */}
      <div className='text-center lg:text-left'>
        <h1 className='mb-4 text-3xl font-semibold -tracking-[3%] text-primary lg:text-4xl'>Welcome Back! 👋</h1>
        <p className='text-sm tracking-[0%] text-text-muted'>
          Glad to have you here! Log in to explore exclusive real estate opportunities and manage your investments with
          ease.
        </p>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={signIn} className='w-2/3 space-y-4'>
          <div className='relative'>
            <Input
              id='email'
              type='email'
              {...register("email")}
              placeholder='Email'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.email && <p className='text-xs text-red-500 sm:text-sm'>{errors.email.message}</p>}
          </div>

          <div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder='Password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.password && <p className='text-xs text-red-500 sm:text-sm'>{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            loading={emailSignInLoading}
            className={`w-full rounded-md bg-[#D9D9D9] py-6 text-sm font-medium text-[#5F646A] hover:bg-primary hover:text-white ${formState.isValid && "bg-primary text-white"} disabled:pointer-events-auto disabled:cursor-not-allowed`}
          >
            Login
          </Button>

          <div className='flex justify-end'>
            {/* Forgot Password */}
            <Link href='/forgot-password' className='text-sm text-black underline'>
              Forgot Password?
            </Link>
          </div>
        </form>
      </FormProvider>

      {/* Mobile Image */}
      <div className='mt-8 hidden'>
        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <Image
              src='/images/building.png'
              alt='Modern residential building'
              width={400}
              height={300}
              className='h-48 w-full object-cover'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
