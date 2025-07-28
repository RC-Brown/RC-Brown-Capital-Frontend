"use client";

import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";

interface TermsCheckboxProps {
  value?: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsCheckbox({ value = false, onChange
  //  error
   }: TermsCheckboxProps) {
  return (
    <div className='max-w-[300px] space-y-2'>
      <div className='flex items-start space-x-2'>
        <Checkbox
          id='terms-checkbox'
          checked={value}
          onCheckedChange={(checked: boolean) => onChange(checked === true)}
          className='mt-0.5 text-white'
        />
        <Label htmlFor='terms-checkbox' className='cursor-pointer text-xs font-normal leading-relaxed'>
          I have read and accept the{" "}
          <a
            href='/terms-and-conditions'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            terms and conditions
          </a>{" "}
          and{" "}
          <a
            href='/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            Privacy Policy
          </a>
        </Label>
      </div>
    </div>
  );
}
