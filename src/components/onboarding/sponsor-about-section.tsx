"use client";

interface SponsorAboutSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function SponsorAboutSection({
  // value, onChange,
  error,
  label,
}: SponsorAboutSectionProps) {
  return (
    <div className='mb-4'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>🏢</span>
        <h3 className='text-lg font-semibold text-gray-800'>{label}</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
