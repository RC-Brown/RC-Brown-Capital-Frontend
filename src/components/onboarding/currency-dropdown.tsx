"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import countriesData from "@/src/data/countries.json";

interface CurrencyDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}

// Supported currencies
const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"];

// Create currency options from countries data
const CURRENCY_OPTIONS = countriesData
  .map((country) => ({
    label: `${country.currency}`,
    value: country.currency,
    country: country.name,
    currencyName: country.currency_name,
    currencySymbol: country.currency_symbol,
    isSupported: SUPPORTED_CURRENCIES.includes(country.currency),
  }))
  // Remove duplicates (multiple countries can have the same currency)
  .filter((option, index, self) => index === self.findIndex((o) => o.value === option.value))
  // Sort: supported currencies first, then alphabetically by currency code
  .sort((a, b) => {
    // If one is supported and the other isn't, supported comes first
    if (a.isSupported && !b.isSupported) return -1;
    if (!a.isSupported && b.isSupported) return 1;

    // If both are supported or both are unsupported, sort alphabetically
    return a.value.localeCompare(b.value);
  });

export function CurrencyDropdown({ value, onChange, error, className, placeholder }: CurrencyDropdownProps) {
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
          placeholder={placeholder || "Select currency"}
          className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
        />
      </SelectTrigger>
      <SelectContent className='max-h-[300px] bg-white text-text-muted/80'>
        {CURRENCY_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={!option.isSupported}
            className={cn(
              "cursor-pointer",
              option.isSupported ? "hover:bg-primary hover:text-white" : "cursor-not-allowed opacity-50"
            )}
          >
            <div className='flex w-full items-center justify-between'>
              <span>{option.label}</span>
              {!option.isSupported && <span className='ml-2 text-xs text-red-500'>(not supported)</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
