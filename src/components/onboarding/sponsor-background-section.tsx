"use client";

import Image from "next/image";
import { Textarea } from "../ui/textarea";

interface SponsorBackgroundSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  // label: string;
}

export function SponsorBackgroundSection({ value, onChange
  //  error
   }: SponsorBackgroundSectionProps) {
  return (
    <div className='mb-4'>
      <div className='flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='Sponsor Background' width={24} height={24} />
        <h3 className='font-semibold text-gray-800'>1. Sponsor Background *</h3>
      </div>
      <Textarea
        placeholder='Background, mission, vision, and business model'
        className='mt-4 min-h-[145px] border-black/10 shadow-none placeholder:text-text-muted/80'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
