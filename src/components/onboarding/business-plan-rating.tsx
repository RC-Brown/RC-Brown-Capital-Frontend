"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Building, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

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
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
            <Building className='h-3 w-3 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>1. Business Plan Rating</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-4 text-sm text-gray-600'>
        Instruction: Select the most appropriate rating level for each item below.
      </p>

      {/* Warning/Info Message */}
      <div className='mb-6 flex items-center space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3'>
        <AlertCircle className='h-4 w-4 text-yellow-600' />
        <span className='text-sm text-yellow-800'>
          (A definitions document is pre-uploaded by admin and available for reference.)
        </span>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Category</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Input</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Brief Info</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.key} className='hover:bg-gray-50'>
                <td className='border border-gray-200 p-4 text-sm font-medium text-gray-700'>{category.label}</td>
                <td className='border border-gray-200 p-4'>
                  <Select
                    value={ratings[category.key] || ""}
                    onValueChange={(value) => handleRatingChange(category.key, value)}
                  >
                    <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                      <SelectValue placeholder='Medium' />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className='border border-gray-200 p-4 text-sm text-gray-600'>{category.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
