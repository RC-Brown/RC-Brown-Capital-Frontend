"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { CURRENCY_OPTIONS } from "@/src/lib/data/currencies";

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function CurrencySelect({ 
  value, 
  onChange, 
  error, 
  placeholder = "Select currency",
  className 
}: CurrencySelectProps) {
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
      <SelectContent className='bg-white text-text-muted/80 max-h-60'>
        {CURRENCY_OPTIONS.map((currency) => (
          <SelectItem
            key={currency.value}
            value={currency.value}
            disabled={currency.disabled}
            className={cn(
              'cursor-pointer hover:bg-primary hover:text-white',
              currency.disabled && 'cursor-not-allowed opacity-50 hover:bg-gray-100 hover:text-gray-500',
              'relative group'
            )}
            title={currency.disabled ? currency.message : undefined}
          >
            <span className={cn(
              currency.disabled && 'text-gray-500'
            )}>
              {currency.label}
            </span>
            {currency.disabled && (
              <span className="ml-2 text-xs text-gray-400">
                (Not Supported)
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 