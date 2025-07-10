"use client";

import { useState } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

interface BankTermsCheckboxProps {
  value?: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function BankTermsCheckbox({ value = false, onChange, error }: BankTermsCheckboxProps) {
  const [isChecked, setIsChecked] = useState(value);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    onChange(checked);
  };

  return (
    <div className='space-y-2'>
      <div className='flex max-w-[300px] items-start space-x-2'>
        <Checkbox
          id='bank-terms'
          checked={isChecked}
          onCheckedChange={handleChange}
          className={cn(error && "border-red-500", "mt-1 text-white")}
        />
        <Label htmlFor='bank-terms' className='cursor-pointer text-sm font-normal leading-relaxed'>
          I have read accept the{" "}
          <a
            href='/terms'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            terms and conditions
          </a>{" "}
          and{" "}
          <a
            href='/privacy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            Privacy Policy
          </a>
        </Label>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
