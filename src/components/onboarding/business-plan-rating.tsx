"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "../ui/tooltip";
import { Input } from "../ui/input";

interface BusinessPlanRatingProps {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
}

const categories = [
  {
    key: "leverage",
    label: "Leverage",
    info: "Rate the use of borrowed capital in this project",
  },
  {
    key: "occupancy",
    label: "Occupancy",
    info: "Estimate expected property occupancy rate.",
  },
  {
    key: "capex_hard_cost",
    label: "Capex / Hard Cost",
    info: "Rate the capital expenditure and upfront project costs.",
  },
  {
    key: "target_noi_growth",
    label: "Target NOI Growth",
    info: "Forecast your Net Operating Income growth rate",
  },
];

const ratingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export function BusinessPlanRating({ value = {}, onChange, error }: BusinessPlanRatingProps) {
  const [ratings, setRatings] = useState<Record<string, string>>(value);

  const handleRatingChange = (category: string, rating: string) => {
    const newRatings = { ...ratings, [category]: rating };
    setRatings(newRatings);

    onChange(newRatings);
  };

  //   return categories.every((cat) => ratings[cat.key] && ratings[cat.key] !== "");
  // };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='mb-4 flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div className='flex items-center justify-center'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g clipPath='url(#clip0_1683_2417)'>
                <path
                  d='M12.4168 0.664391L13.0504 1.93679L14.4068 2.17199C14.782 2.23719 14.9312 2.71599 14.6644 2.99839L13.6996 4.01959L13.9044 5.43719C13.9612 5.82919 13.5704 6.12519 13.23 5.94799L12 5.30679L10.77 5.94799C10.4296 6.12519 10.0392 5.82959 10.0956 5.43719L10.3004 4.01959L9.3356 2.99839C9.0688 2.71599 9.218 2.23719 9.5932 2.17199L10.9496 1.93679L11.5832 0.664391C11.7584 0.312391 12.2416 0.312391 12.4168 0.664391Z'
                  fill='#F9C82B'
                />
                <path
                  d='M5.21661 3.86361L5.85021 5.13601L7.20661 5.37121C7.58181 5.43641 7.73101 5.91521 7.46421 6.19761L6.49941 7.21881L6.70421 8.63641C6.76101 9.02841 6.37021 9.32441 6.02981 9.14721L4.79981 8.50601L3.56981 9.14721C3.22941 9.32441 2.83901 9.02881 2.89541 8.63641L3.10021 7.21881L2.13541 6.19761C1.86861 5.91521 2.01781 5.43641 2.39301 5.37121L3.74941 5.13601L4.38301 3.86361C4.55821 3.51161 5.04141 3.51161 5.21661 3.86361Z'
                  fill='#F9C82B'
                />
                <path
                  d='M19.6165 3.86361L20.2501 5.13601L21.6065 5.37121C21.9817 5.43641 22.1309 5.91521 21.8641 6.19761L20.8993 7.21881L21.1041 8.63641C21.1609 9.02841 20.7701 9.32441 20.4297 9.14721L19.1997 8.50601L17.9697 9.14721C17.6293 9.32441 17.2389 9.02881 17.2953 8.63641L17.5001 7.21881L16.5353 6.19761C16.2685 5.91521 16.4177 5.43641 16.7929 5.37121L18.1493 5.13601L18.7829 3.86361C18.9581 3.51161 19.4413 3.51161 19.6165 3.86361Z'
                  fill='#F9C82B'
                />
                <path
                  d='M7.7599 17.3604C6.6719 18.4484 5.9999 19.9444 5.9999 21.6004C5.9999 21.8204 5.8199 22.0004 5.5999 22.0004H0.799902C0.579902 22.0004 0.399902 21.8204 0.399902 21.6004C0.399902 18.4004 1.6999 15.5044 3.7999 13.4004H4.1999L7.5999 16.8004L7.7599 17.3604Z'
                  fill='#D7342C'
                />
                <path
                  d='M11.9998 10L12.3998 10.4V15.2L11.9998 15.6C10.3438 15.6 8.8478 16.272 7.7598 17.36L3.7998 13.4C5.9038 11.3 8.7998 10 11.9998 10Z'
                  fill='#E99E32'
                />
                <path
                  d='M20.2 13.4L20.4 14L16.8 17.6L16.24 17.36C15.152 16.272 13.656 15.6 12 15.6V10C15.2 10 18.096 11.3 20.2 13.4Z'
                  fill='#F9C82B'
                />
                <path
                  d='M23.6002 21.6004C23.6002 21.8204 23.4202 22.0004 23.2002 22.0004H18.4002C18.1802 22.0004 18.0002 21.8204 18.0002 21.6004C18.0002 19.9444 17.3282 18.4484 16.2402 17.3604L20.2002 13.4004C22.3002 15.5044 23.6002 18.4004 23.6002 21.6004Z'
                  fill='#2AA869'
                />
                <path
                  d='M13.4881 22.5832C15.4081 21.5432 18.4281 19.7512 20.7081 18.3872C21.1241 18.1352 20.8321 17.5072 20.3761 17.6632C17.8601 18.5272 14.5481 19.6832 12.5161 20.4872L13.4881 22.5832Z'
                  fill='#0A365E'
                />
                <path
                  d='M11.9999 23.6004C12.8836 23.6004 13.5999 22.884 13.5999 22.0004C13.5999 21.1167 12.8836 20.4004 11.9999 20.4004C11.1162 20.4004 10.3999 21.1167 10.3999 22.0004C10.3999 22.884 11.1162 23.6004 11.9999 23.6004Z'
                  fill='#06293F'
                />
              </g>
              <defs>
                <clipPath id='clip0_1683_2417'>
                  <rect width='24' height='24' fill='white' />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h3 className='text-base font-semibold text-text-muted'>1. Business Plan Rating</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-4 text-base -tracking-[3%] text-text-muted'>
        Instruction: Select the most appropriate rating level for each item below.
      </p>

      {/* Warning/Info Message */}
      <div className='mb-6 flex items-center space-x-2'>
        <ExclamationCircleIcon className='size-5 text-[#FFC048]' />
        <span className='text-sm font-light text-text-muted'>
          (A definitions document is pre-uploaded by admin and available for reference.)
        </span>
      </div>

      {/* Table */}
      <div className=''>
        <table className='w-full'>
          <thead>
            <tr className=''>
              <th className='p-4 text-left font-medium text-text-muted'>Category</th>
              <th className='p-4 text-left font-medium text-text-muted'>Input</th>
              <th className='p-4 text-left font-medium text-text-muted'>Brief Info</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.key} className=''>
                <td className='whitespace-nowrap py-4 text-sm text-text-muted/80'>
                  <Tooltip content={category.info}>
                    <span className='cursor-pointer text-sm text-text-muted/80'>{category.label}</span>
                  </Tooltip>
                </td>
                <td className='p-4'>
                  <Select
                    value={ratings[category.key] || ""}
                    onValueChange={(value) => handleRatingChange(category.key, value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-[51px] w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-text-muted/80",
                        error && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder='Medium' />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {ratingOptions.map((option) => (
                        <SelectItem
                          className='hover:bg-primary hover:text-white'
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className='p-4 text-sm text-gray-600'>
                  <Input
                    placeholder='Brief info'
                    className='h-[51px] border-black/10 bg-background-secondary text-sm shadow-none placeholder:text-sm placeholder:text-[#787878CC]/80'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
