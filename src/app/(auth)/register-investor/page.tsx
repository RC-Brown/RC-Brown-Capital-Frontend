"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent } from "@/src/components/ui/card";
import { RegisterInvestorSchema, RegisterInvestorType } from "@/src/types/forms";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { redirectToGoogleOAuth } from "@/src/lib/utils";
import { signUpInvestor } from "@/src/services/auth";
import countries from "@/src/data/countries.json";

export default function InvestorSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const methods = useForm<RegisterInvestorType>({
    resolver: zodResolver(RegisterInvestorSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });
  const { register, handleSubmit, formState, setValue } = methods;
  const { errors } = formState;

  const countryList = countries as Array<{
    id: number;
    name: string;
    iso2: string;
    phone_code: string;
    emoji: string;
  }>;
  const defaultCountry = countryList.find((c) => c.iso2 === "NG") ?? countryList[0];
  const [code, setCode] = useState("+" + defaultCountry.phone_code);

  const handleCountryChange = (countryName: string) => {
    const c = countryList.find((x) => x.name === countryName)!;
    setCode("+" + c.phone_code);
    setValue("country", countryName);
  };
  const handlePhoneCodeChange = (countryName: string) => {
    const c = countryList.find((x) => x.name === countryName)!;
    setCode("+" + c.phone_code);
  };

  const router = useRouter();

  const signUpEmail = handleSubmit(async (data: RegisterInvestorType) => {
    setEmailLoading(true);

    try {
      const response = await signUpInvestor({
        ...data,
        phoneNumber: code + data.phoneNumber,
      });

      setEmailLoading(false);
      if (response.error) {
        const { error } = response;
        toast.error(error);
        return;
      }

      if (response.success) toast.success(response.success);

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      const session = await getSession();

      if (!session) {
        throw new Error("Session not found");
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
      setEmailLoading(false);
    }
  });

  return (
    <div className='w-full space-y-8 sm:max-w-lg'>
      {/* Header */}
      <div className='text-center lg:text-left'>
        <h1 className='mb-4 text-2xl font-light -tracking-[3%] text-primary lg:text-3xl'>
          Let&apos;s create your perfect portfolio.
        </h1>
        <p className='text-sm tracking-[0%] text-text-muted'>
          Explore exclusive real estate investing opportunities by registering for free on the top investment platform.
        </p>
      </div>

      <FormProvider {...methods}>
        {/* Form */}
        <form onSubmit={signUpEmail} className='w-2/3 space-y-4'>
          {/* First Name */}
          <div className='relative'>
            <Input
              id='firstName'
              {...register("firstName")}
              placeholder='First name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.firstName && <p className='text-xs text-red-500 sm:text-sm'>{errors.firstName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='lastName'
              {...register("lastName")}
              placeholder='Last name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.lastName && <p className='text-xs text-red-500 sm:text-sm'>{errors.lastName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='email'
              {...register("email")}
              placeholder='Email'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.email && <p className='text-xs text-red-500 sm:text-sm'>{errors.email.message}</p>}
          </div>
          <div className='flex gap-2'>
            <Select onValueChange={handlePhoneCodeChange}>
              <SelectTrigger className='w-24 bg-white' id='phoneInput'>
                <SelectValue placeholder='+234'>{code}</SelectValue>
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {countryList.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    <span className='flex items-center gap-2'>
                      <span>{c.emoji}</span>
                      {c.name} (+{c.phone_code})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex-1'>
              <Input
                type='tel'
                placeholder='Phone number'
                {...register("phoneNumber")}
                className='bg-white text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              {errors.phoneNumber && <p className='text-xs text-red-500 sm:text-sm'>{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <Select {...register("country")} onValueChange={handleCountryChange}>
            <SelectTrigger className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'>
              <SelectValue
                placeholder='Select country'
                className='text-text-muted/80 placeholder:text-sm placeholder:text-text-muted/80'
              />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {countryList.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  <span className='flex items-center gap-2'>
                    <span>{c.emoji}</span>
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className='text-xs text-red-500 sm:text-sm'>{errors.country.message}</p>}

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
          <div>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder='Confirm password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className='text-xs text-red-500 sm:text-sm'>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className='flex items-start space-x-2'>
              <Controller
                control={methods.control}
                name='agreeToTerms'
                render={({ field }) => (
                  <Checkbox
                    id='terms'
                    checked={field.value}
                    className='mt-1 size-[14px] h-[14px] w-[14px] rounded-[4px] border-2 border-black/60 text-white'
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <Label htmlFor='terms' className='text-sm leading-relaxed text-black'>
                I have read and accept the{" "}
                <a href='#' className='text-[#55A2F0] underline'>
                  terms and condition
                </a>
              </Label>
            </div>
            {errors.agreeToTerms && <p className='text-xs text-red-500 sm:text-sm'>{errors.agreeToTerms.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            loading={emailLoading}
            className={`w-full rounded-md bg-[#D9D9D9] py-6 text-sm font-medium text-[#5F646A] ${formState.isValid && "bg-primary text-white"} hover:bg-primary hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed`}
          >
            Sign Up & Explore
          </Button>

          <div className='hidden w-full items-center gap-2'>
            {/* Divider */}
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm text-text-muted/80'>
              Or
            </div>

            {/* Google Sign Up */}
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-full border-0 bg-white py-[22px] text-sm text-text-muted/80'
              onClick={() => redirectToGoogleOAuth("Investor")}
            >
              <span className='flex w-auto items-center gap-1'>
                <Image src='/icons/google.svg' alt='Google' width={24} height={24} />
                Continue with Google
              </span>
            </Button>
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
