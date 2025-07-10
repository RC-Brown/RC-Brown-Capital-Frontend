"use client";

interface SectionHeaderProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className='space-y-4 rounded-lg px-8 py-6 shadow-lg'>
      <h4 className='font-medium'>{label}</h4>
    </div>
  );
}
