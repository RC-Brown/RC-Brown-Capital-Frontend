"use client";

import Image from "next/image";

interface DocumentsSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function DocumentsSection({
  // value, onChange,
  error,
  // label,
}: DocumentsSectionProps) {
  return (
    <div className='mb-4 mt-8'>
      <div className='flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='Documents' width={24} height={24} />
        <h3 className='text-base font-semibold text-text-muted'>3. Documents</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
