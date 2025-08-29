"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { CalendarIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function ProjectTrackingTabComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("RC Brown Capital");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 30 }, (_, i) => 2025 + i);

  const projects = ["RC Brown Capital", "Project Alpha", "Project Beta", "Project Gamma"];

  return (
    <div>
      <div className='rounded-md bg-white p-5 pt-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h2 className='text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>Project Tracking</h2>
            <div className='relative'>
              <Input
                placeholder='Project name'
                className='h-[41px] rounded-md border-black/10 pl-8 text-sm text-text-muted shadow-none placeholder:text-sm placeholder:text-text-muted focus-visible:ring-0'
              />
              <MagnifyingGlassIcon className='absolute left-2 top-1/2 size-4 -translate-y-1/2 text-black/45' />
            </div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger className='flex h-[41px] items-center gap-2 rounded-md border border-black/10 px-4 text-sm text-text-muted shadow-none placeholder:text-sm placeholder:text-text-muted focus-visible:ring-0'>
                <CalendarIcon className='size-4 text-black/45' />
                <span className='text-sm text-text-muted'>Date</span>
              </PopoverTrigger>
              <PopoverContent side='bottom' align='start' className='rounded-[10px] bg-white px-10 md:min-w-[606px]'>
                <div className='mb-5 flex items-center justify-between'>
                  <span></span>
                  <span className='text-xl font-medium tracking-[0%] text-primary'>Transaction Date</span>
                  <XMarkIcon
                    onClick={() => setIsOpen(false)}
                    className='size-4 cursor-pointer stroke-[3.5px] text-black'
                  />
                </div>
                <div className='space-y-3'>
                  <div className='grid grid-cols-3 items-center'>
                    <Label className='col-span-1'>Month</Label>
                    <Select>
                      <SelectTrigger className='col-span-2 h-[51px] rounded-md border-black/10 bg-white shadow-none focus:ring-0 data-[placeholder]:text-sm data-[placeholder]:text-text-muted/80'>
                        <SelectValue placeholder='Select Month' />
                      </SelectTrigger>
                      <SelectContent className='rounded-md border-black/10 bg-white shadow-none'>
                        {months.map((month) => (
                          <SelectItem key={month} value={month} className='hover:bg-primary hover:text-white'>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-3 items-center'>
                    <Label className='col-span-1'>Year</Label>
                    <Select>
                      <SelectTrigger className='col-span-2 h-[51px] rounded-md border-black/10 bg-white shadow-none focus:ring-0 data-[placeholder]:text-sm data-[placeholder]:text-text-muted/80'>
                        <SelectValue placeholder='Select Year' />
                      </SelectTrigger>
                      <SelectContent className='rounded-md border-black/10 bg-white shadow-none'>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()} className='hover:bg-primary hover:text-white'>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className='h-[41px] w-fit rounded-md border-black/10 bg-white px-4 text-sm text-text-muted shadow-none focus:ring-0 data-[placeholder]:text-sm data-[placeholder]:text-text-muted'>
              <SelectValue placeholder='Select Project' />
            </SelectTrigger>
            <SelectContent className='rounded-md border-black/10 bg-white shadow-none'>
              {projects.map((project) => (
                <SelectItem key={project} value={project} className='hover:bg-primary hover:text-white'>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div></div>
    </div>
  );
}
