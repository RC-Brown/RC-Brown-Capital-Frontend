"use client";

import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  // className?: string;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className='relative inline-block'>
      <div
        className='flex items-center gap-2'
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        <InformationCircleIcon className='h-4 w-4 cursor-help text-black' />
      </div>

      {isVisible && (
        <div className='absolute -top-2 left-1/2 z-[999999] w-fit -translate-x-1/2 -translate-y-full transform'>
          <div className='w-[213px] rounded-lg bg-[#9747FF] px-3 py-2 text-xs text-white shadow-lg'>
            <div className='text-left font-normal'>{content}</div>
            {/* Arrow pointing down */}
            <div className='absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-[#9747FF]'></div>
          </div>
        </div>
      )}
    </div>
  );
}
