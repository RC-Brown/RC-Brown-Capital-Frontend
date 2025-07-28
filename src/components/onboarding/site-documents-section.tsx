"use client";

import Image from "next/image";

interface SiteDocumentsSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  // label: string;
}

export function SiteDocumentsSection({
  // value, onChange,
  error,
  // label,
}: SiteDocumentsSectionProps) {
  return (
    <div className='mt-8'>
      <div className='flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='Site Documents' width={24} height={24} />
        <h3 className='text-base font-semibold text-text-muted'>2. Site Documents</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
