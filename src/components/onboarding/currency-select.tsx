"use client";

import React from "react";
import { cn } from "@/src/lib/utils";
import { CheckIcon } from "@heroicons/react/24/solid";

interface CurrencyOption {
  value: string;
  label: string;
  flag: string;
  description: string;
  disabled?: boolean;
}

// Add SVG flag components
const NigeriaFlag = () => (
  <svg width='20' height='13' viewBox='0 0 20 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect width='20' height='13' fill='#fff' />
    <rect x='0' y='0' width='6.67' height='13' fill='#198754' />
    <rect x='13.33' y='0' width='6.67' height='13' fill='#198754' />
  </svg>
);

const USAFlag = () => (
  <svg width='20' height='13' viewBox='0 0 20 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect width='20' height='13' fill='#fff' />
    <rect y='0' width='20' height='1.857' fill='#B22234' />
    <rect y='2.143' width='20' height='1.857' fill='#B22234' />
    <rect y='4.286' width='20' height='1.857' fill='#B22234' />
    <rect y='6.429' width='20' height='1.857' fill='#B22234' />
    <rect y='8.571' width='20' height='1.857' fill='#B22234' />
    <rect y='10.714' width='20' height='1.857' fill='#B22234' />
    <rect width='8.5' height='6.5' fill='#3C3B6E' />
    {/* Simple stars pattern for demo */}
    <g fill='#fff'>
      <circle cx='1.2' cy='1.1' r='0.3' />
      <circle cx='2.4' cy='2.2' r='0.3' />
      <circle cx='3.6' cy='1.1' r='0.3' />
      <circle cx='4.8' cy='2.2' r='0.3' />
      <circle cx='6.0' cy='1.1' r='0.3' />
      <circle cx='7.2' cy='2.2' r='0.3' />
    </g>
  </svg>
);

// Update CURRENCY_OPTIONS to use SVG components
const CURRENCY_OPTIONS: Array<Omit<CurrencyOption, "flag"> & { flag: React.ReactNode }> = [
  {
    value: "NGN",
    label: "NGN (Nigeria Naira)",
    flag: <NigeriaFlag />,
    description: "Nigeria Naira",
  },
  {
    value: "USD",
    label: "USD (America Dollar)",
    flag: <USAFlag />,
    description: "America Dollar",
  },
];

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function CurrencySelect({ value, onChange, error, className }: CurrencySelectProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {CURRENCY_OPTIONS.map((currency) => {
          const isSelected = value === currency.value;
          const isDisabled = currency.disabled;

          return (
            <div
              key={currency.value}
              className={cn(
                "relative cursor-pointer rounded-2xl border p-4 transition-all duration-200",
                isSelected ? "shadow-md" : "",
                currency.value === "NGN" ? "border-[#82D361]" : "border-[#F33A3A]",
                isDisabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => !isDisabled && onChange(currency.value)}
            >
              {/* Selection Indicator */}
              <div className='absolute left-3 top-3'>
                {isSelected ? (
                  <div className='flex h-5 w-5 items-center justify-center rounded bg-blue-500'>
                    <CheckIcon className='h-3 w-3 text-white' />
                  </div>
                ) : (
                  <div className='h-5 w-5 rounded border border-gray-300' />
                )}
              </div>

              {/* Flag */}
              <div className='absolute right-3 top-3'>{currency.flag}</div>

              {/* Currency Button */}
              <div className='mt-12'>
                <button
                  type='button'
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors",
                    currency.value === "NGN" ? "bg-[#44B914]" : "bg-primary",
                    isDisabled && "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                  )}
                  disabled={isDisabled}
                >
                  {currency.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
