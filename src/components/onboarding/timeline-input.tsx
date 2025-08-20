"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface TimelineInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const TIMELINE_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

const UNIT_OPTIONS = [
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
];

export const TimelineInput: React.FC<TimelineInputProps> = ({
  value,
  onChange,
  placeholder,
  error,
  className,
}) => {
  const [timeline, setTimeline] = useState("");
  const [unit, setUnit] = useState("months");

  // Parse initial value
  useEffect(() => {
    if (value) {
      const stringValue = typeof value === "number" ? value.toString() : value;

      // Handle existing format like "12_months", "2_years", etc.
      if (stringValue.includes("_")) {
        const [number, unitPart] = stringValue.split("_");
        setTimeline(number);
        setUnit(unitPart);
        return;
      }

      // Handle existing format like "12 months", "2 years", etc.
      const match = stringValue.match(/^(\d+)\s*(months?|years?)$/i);
      if (match) {
        setTimeline(match[1]);
        setUnit(match[2].toLowerCase().replace(/s$/, "")); // Remove plural 's'
        return;
      }

      // Handle just numbers (assume months for backward compatibility)
      if (/^\d+$/.test(stringValue)) {
        setTimeline(stringValue);
        setUnit("months");
        return;
      }

      // Default fallback
      setTimeline(stringValue);
      setUnit("months");
    } else {
      setTimeline("");
      setUnit("months");
    }
  }, [value]);

  const handleTimelineChange = (newTimeline: string) => {
    // Only allow numbers
    const numericValue = newTimeline.replace(/[^0-9]/g, "");
    setTimeline(numericValue);

    // Update parent with formatted value
    if (numericValue) {
      const formattedValue = `${numericValue}_${unit}`;
      onChange(formattedValue);
    } else {
      onChange("");
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);

    // Update parent with formatted value
    if (timeline) {
      const formattedValue = `${timeline}_${newUnit}`;
      onChange(formattedValue);
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Select value={timeline} onValueChange={handleTimelineChange}>
            <SelectTrigger className={`${error ? "border-red-500" : ""} ${className || ""}`}>
              <SelectValue placeholder={placeholder || "Select timeline"} className='text-xs text-text-muted/80' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {TIMELINE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer hover:bg-primary hover:text-white'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='w-32'>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger className={`${error ? "border-red-500" : ""} ${className || ""}`}>
              <SelectValue className='text-xs text-text-muted/80' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {UNIT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer hover:bg-primary hover:text-white'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};
