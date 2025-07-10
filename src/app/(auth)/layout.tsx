import { redirect } from "next/navigation";
import React from "react";
import DynamicAuthImage from "./components/dynamic-auth-image";
import Navbar from "@/src/components/molecules/navbar";
import { auth } from "@/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className=''>
      <Navbar />
      <div className='grid w-full grid-cols-1 items-start gap-6 bg-background-secondary px-12 pb-12 pt-32 sm:gap-12 lg:grid-cols-2'>
        <div className='hidden overflow-hidden rounded-[30px] lg:block'>
          <DynamicAuthImage />
        </div>
        <div className='flex w-full items-center justify-center'>{children}</div>
      </div>
    </div>
  );
}
