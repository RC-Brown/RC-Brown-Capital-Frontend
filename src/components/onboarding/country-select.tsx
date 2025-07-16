"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { COUNTRY_OPTIONS } from "@/src/lib/data/countries";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  error,
  placeholder = "Select country",
  className,
}: CountrySelectProps) {
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          error && "border-red-500",
          "text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
          className
        )}
      >
        <SelectValue
          placeholder={placeholder}
          className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
        />
      </SelectTrigger>
      <SelectContent className='max-h-60 bg-white text-text-muted/80'>
        {COUNTRY_OPTIONS.map((country) => (
          <SelectItem
            key={country.value}
            value={country.value}
            className='cursor-pointer hover:bg-primary hover:text-white'
          >
            <span className='flex items-center gap-2'>
              <span className='text-base'>{country.emoji}</span>
              <span>{country.value}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
