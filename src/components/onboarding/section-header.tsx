"use client";

interface SectionHeaderProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
}

export function SectionHeader({ 
  // label
}: SectionHeaderProps) {
  return (
    <div className='py-2'>
      <h4 className='font-semibold -tracking-[3%] text-text-muted'>Investment Return Structure</h4>
    </div>
  );
}
