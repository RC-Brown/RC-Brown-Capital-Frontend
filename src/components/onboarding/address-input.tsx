"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface AddressInputProps {
  value?: {
    address: string;
    useCompanyAddress: boolean;
  };
  onChange: (value: { address: string; useCompanyAddress: boolean }) => void;
}

export function AddressInput({ value = { address: "", useCompanyAddress: false }, onChange }: AddressInputProps) {
  const [addressData, setAddressData] = useState(value);

  const handleAddressChange = (address: string) => {
    const newData = { ...addressData, address };
    setAddressData(newData);
    onChange(newData);
  };

  //   return addressData.address.trim().length >= 5;
  // };

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <MapPinIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/80' />
        <Input
          placeholder='Company address'
          value={addressData.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          className='pl-10 text-sm'
        />
      </div>
    </div>
  );
}
