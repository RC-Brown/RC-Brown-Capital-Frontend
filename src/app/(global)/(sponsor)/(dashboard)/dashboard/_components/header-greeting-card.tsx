"use client";

import { useTimeBasedGreeting } from "@/src/lib/hooks/use-time-based-greeting";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function HeaderGreetingCard() {
  const session = useSession();
  const greeting = useTimeBasedGreeting();
  const fullName = session.data?.user.name;

  return (
    <div
      className='relative w-[52%] rounded-md bg-primary px-7 py-8'
      style={{
        backgroundImage: "url(/images/squiggly-lines.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className='relative z-10'>
        <div className='text-sm font-medium capitalize leading-[100%] -tracking-[3%] text-[#E6E6E6]'>
          Hi {fullName ?? "There"}
        </div>
        <div className='oxy mt-1 text-2xl font-bold capitalize leading-[100%] -tracking-[3%] text-white'>
          {greeting}
        </div>
        <div className='flex items-center gap-4 text-white'>
          <p className='flex-1 text-sm -tracking-[3%]'>
            Empowering your financial journey. Explore your dashboard
            <br className='hidden' /> for insights, portfolio updates, and investment
            <br className='hidden' /> opportunities.
          </p>
          <Image src='/images/speedometer.svg' alt='speedometer' width={115} height={115} />
        </div>
      </div>
    </div>
  );
}
