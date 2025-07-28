"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "../ui/tooltip";
import { Input } from "../ui/input";
import Image from "next/image";

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
            <Image src='/icons/feedback.svg' alt='Business Plan Rating' width={24} height={24} />
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
    </div>
  );
}
