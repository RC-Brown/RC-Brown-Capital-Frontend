"use client";

interface SectionHeaderProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className='hidden py-2'>
      <h4 className='font-semibold text-text-muted'>{label}</h4>
    </div>
  );
}
