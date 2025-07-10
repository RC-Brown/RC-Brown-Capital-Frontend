"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface PropertyAddressInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PropertyAddressInput({ value = "", onChange, error }: PropertyAddressInputProps) {
  const [address, setAddress] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddress(newValue);
    onChange(newValue);
  };

  //   return address.trim().length >= 5;
  // };

  return (
    <div className='space-y-2'>
      <div className='relative'>
        <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2'>
          <Image src='/icons/location.svg' alt='Location' width={16} height={16} className='text-gray-400' />
        </div>
        <Input
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={handleChange}
          className={cn("pl-10", error && "border-red-500")}
        />
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
