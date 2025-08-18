"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const TAB_CONTENT = {
  add: {
    title: "Add Project Milestones",
    description:
      "You can request an adjustment here, all changes will be approved by the admin before they take effect.",
  },
  edit: {
    title: "Edit Existing Item",
    description:
      "You can request an adjustment here, all changes will be approved by the admin before they take effect.",
  },
};
import AddProjectMilestonesTabComponent from "./tabComponent";

export default function HeaderMilestonesCard() {
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_CONTENT>("add");
  return (
    <div
      className='relative w-[48%] rounded-md bg-primary px-7 py-8'
      style={{
        backgroundImage: "url(/images/squiggly-lines.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className='relative z-10'>
        <div className='invisible text-sm font-medium capitalize leading-[100%] -tracking-[3%] text-[#E6E6E6]'>
          Hi there
        </div>
        <div className='oxy text-2xl font-bold capitalize leading-[100%] -tracking-[3%] text-white'>
          Add Project Milestones
        </div>
        <div className='mt-4 flex items-center text-white'>
          <div className='flex-1'>
            <p className='flex-1 text-sm -tracking-[3%]'>
              Have you noticed a missing or incorrect item in
              <br className='hidden' /> your submitted budget?
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='mt-3 w-1/2 rounded-md bg-white text-sm font-semibold text-primary hover:bg-white hover:text-primary'>
                  Add Milestones
                  <PlusIcon className='size-4 stroke-[3px]' />
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-white p-4 sm:rounded-md xl:max-w-4xl' hideCloseButton>
                <DialogHeader
                  className='relative flex flex-row items-center gap-5 rounded-md bg-primary px-10 py-5'
                  style={{
                    backgroundImage: "url(/images/squiggly-lines.svg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundBlendMode: "multiply",
                  }}
                >
                  <div className='flex flex-1 flex-col gap-2'>
                    <DialogTitle className='oxy text-2xl font-bold -tracking-[3%] text-white'>
                      {TAB_CONTENT[activeTab].title}
                    </DialogTitle>
                    <DialogDescription className='text-sm -tracking-[3%] text-[#E6E6E6]'>
                      {TAB_CONTENT[activeTab].description}
                    </DialogDescription>
                  </div>
                  <Image src='/images/chart-archery.svg' alt='charts' width={115} height={115} />
                  <DialogClose asChild className='right-0 top-0 !h-0 !px-0 !py-0'>
                    <Button variant='ghost' className='absolute right-2 top-2'>
                      <XMarkIcon className='size-4 stroke-[3px] text-white' />
                    </Button>
                  </DialogClose>
                </DialogHeader>
                <AddProjectMilestonesTabComponent
                  onTabChange={(tab) => setActiveTab(tab as keyof typeof TAB_CONTENT)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Image src='/images/chart-archery.svg' alt='charts' width={115} height={115} />
        </div>
      </div>
    </div>
  );
}
