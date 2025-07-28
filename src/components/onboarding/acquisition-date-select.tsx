"use client";

import { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { ChevronDown } from "lucide-react";

interface AcquisitionDateSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

interface QuarterYearValue {
  quarter: string;
  year: string;
}

const quarterOptions = [
  { label: "Q1", value: "q1" },
  { label: "Q2", value: "q2" },
  { label: "Q3", value: "q3" },
  { label: "Q4", value: "q4" },
];

const yearOptions = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
  { label: "2031", value: "2031" },
  { label: "2032", value: "2032" },
  { label: "2033", value: "2033" },
];

export function AcquisitionDateSelect({
  value = "",
  onChange,
  error,
  placeholder = "Select acquisition date",
  className,
}: AcquisitionDateSelectProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quarterYearValue, setQuarterYearValue] = useState<QuarterYearValue>({ quarter: "", year: "" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse existing value on mount
  useEffect(() => {
    if (value) {
      const parsed = parseValue(value);
      setQuarterYearValue(parsed);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Check if the click is on a Select dropdown (which might be outside our container)
        const target = event.target as Element;
        const isSelectDropdown =
          target.closest("[data-radix-popper-content-wrapper]") ||
          target.closest('[role="listbox"]') ||
          target.closest('[data-state="open"]');

        if (!isSelectDropdown) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const parseValue = (val: string): QuarterYearValue => {
    // Parse "q2_2025" format
    const match = val.match(/^q(\d)_(\d{4})$/);
    if (match) {
      return {
        quarter: `q${match[1]}`,
        year: match[2],
      };
    }
    return { quarter: "", year: "" };
  };

  const formatDisplayValue = (quarter: string, year: string): string => {
    if (!quarter || !year) return "";
    const quarterNum = quarter.replace("q", "");
    return `Q${quarterNum} ${year}`;
  };

  const formatValue = (quarter: string, year: string): string => {
    if (!quarter || !year) return "";
    const quarterNum = quarter.replace("q", "");
    return `q${quarterNum}_${year}`;
  };

  const handleQuarterChange = (newQuarter: string) => {
    const newValue = { ...quarterYearValue, quarter: newQuarter };
    setQuarterYearValue(newValue);

    // Only close if both values are selected
    if (newQuarter && newValue.year) {
      const formattedValue = formatValue(newQuarter, newValue.year);
      onChange(formattedValue);
      setIsExpanded(false);
    }
  };

  const handleYearChange = (newYear: string) => {
    const newValue = { ...quarterYearValue, year: newYear };
    setQuarterYearValue(newValue);

    // Only close if both values are selected
    if (newValue.quarter && newYear) {
      const formattedValue = formatValue(newValue.quarter, newYear);
      onChange(formattedValue);
      setIsExpanded(false);
    }
  };

  const displayValue = formatDisplayValue(quarterYearValue.quarter, quarterYearValue.year);

  return (
    <div ref={containerRef} className='relative'>
      {/* Single display field */}
      <div
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2",
          error ? "border-red-500" : "border-gray-300",
          "transition-colors hover:border-gray-400",
          className
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={cn("text-sm", displayValue ? "text-gray-900" : "text-gray-500")}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isExpanded && "rotate-180")} />
      </div>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className='absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-gray-300 bg-white p-3 shadow-lg'>
          <div className='grid grid-cols-2 gap-3'>
            {/* Quarter dropdown */}
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700'>Quarter</label>
              <Select value={quarterYearValue.quarter} onValueChange={handleQuarterChange}>
                <SelectTrigger className='h-8 w-full text-xs'>
                  <SelectValue placeholder='Quarter' />
                </SelectTrigger>
                <SelectContent className='bg-white' onCloseAutoFocus={(e) => e.preventDefault()}>
                  {quarterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className='text-xs hover:bg-primary hover:text-white'
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year dropdown */}
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700'>Year</label>
              <Select value={quarterYearValue.year} onValueChange={handleYearChange}>
                <SelectTrigger className='h-8 w-full text-xs'>
                  <SelectValue placeholder='Year' />
                </SelectTrigger>
                <SelectContent className='bg-white' onCloseAutoFocus={(e) => e.preventDefault()}>
                  {yearOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className='text-xs hover:bg-primary hover:text-white'
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  );
}
