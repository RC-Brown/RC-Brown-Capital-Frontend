import { Input } from "@/src/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { CalendarIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ProjectTrackingTabComponent() {
  return (
    <div>
      <div className='rounded-md bg-white p-5 pt-6'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>Project Tracking</h2>
          <div className='relative'>
            <Input
              placeholder='Project name'
              className='h-[41px] rounded-md border-black/10 pl-8 text-sm text-text-muted shadow-none placeholder:text-sm placeholder:text-text-muted focus-visible:ring-0'
            />
            <MagnifyingGlassIcon className='absolute left-2 top-1/2 size-4 -translate-y-1/2 text-black/45' />
          </div>
          <Popover>
            <PopoverTrigger className='flex h-[41px] items-center gap-2 rounded-md border-black/10 px-4 text-sm text-text-muted shadow-none placeholder:text-sm placeholder:text-text-muted focus-visible:ring-0'>
              <CalendarIcon className='size-4 text-black/45' />
              <span className='text-sm text-text-muted'>Date</span>
            </PopoverTrigger>
            <PopoverContent className='rounded-[10px] bg-white px-5 md:min-w-[606px]'>
              <div className='flex items-center justify-between mb-5'>
                <span></span>
                <span className='text-xl font-medium tracking-[0%] text-text-muted'>Transaction Date</span>
                <XMarkIcon className='size-4 stroke-[1.5px] text-black' />
              </div>
              <div className="grid grid-cols-3">

              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div></div>
    </div>
  );
}
