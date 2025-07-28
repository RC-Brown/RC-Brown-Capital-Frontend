"use client";

import Image from "next/image";

interface SponsorAboutSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  // label: string;
}

export function SponsorAboutSection({
  // value, onChange,
  error,
  // label,
}: SponsorAboutSectionProps) {
  return (
    <div className=''>
      <div className='flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='Sponsor About' width={24} height={24} />
        <h3 className='text-base font-semibold text-text-muted'>2. About the Sponsor</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
