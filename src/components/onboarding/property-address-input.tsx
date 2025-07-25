"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { MapPinIcon } from "@heroicons/react/24/solid";

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
          <MapPinIcon className='size-4 text-black/80' />
        </div>
        <Input
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={handleChange}
          className={cn(
            "h-[51px] border border-black/10 py-4 pl-10 shadow-none placeholder:text-xs focus-visible:ring-0",
            error && "border-red-500"
          )}
        />
      </div>
      {error && <p className='hidden text-sm text-red-500'>{error}</p>}
    </div>
  );
}
