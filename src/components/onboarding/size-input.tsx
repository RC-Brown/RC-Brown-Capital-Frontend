import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface SizeInputProps {
  value?: { size: string; unit: string } | string;
  onChange: (value: { size: string; unit: string }) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const UNIT_OPTIONS = [
  { label: "Square Feet (sq ft)", value: "sq ft" },
  { label: "Square Meters (sq m)", value: "sq m" },
  { label: "Acres (acres)", value: "acres" },
  { label: "Hectares (hectares)", value: "hectares" },
];

export const SizeInput: React.FC<SizeInputProps> = ({ value, onChange, error }) => {
  // Parse initial value
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("sq ft");

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        // Try to parse string value (for backward compatibility)
        const match = value.match(/^(\d+(?:\.\d+)?)\s*(sq\s*ft|sq\s*m|acres|hectares)$/i);
        if (match) {
          setSize(match[1]);
          setUnit(match[2].toLowerCase().replace(/\s+/g, " "));
        } else {
          setSize(value);
          setUnit("sq ft");
        }
      } else if (typeof value === "object" && value.size && value.unit) {
        // Format the size value with commas if it's a number
        const sizeValue = value.size;
        if (typeof sizeValue === "string" && /^\d+/.test(sizeValue)) {
          const parts = sizeValue.split(".");
          const wholeNumber = parts[0];
          const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const formattedValue = parts.length > 1 ? `${formattedWholeNumber}.${parts[1]}` : formattedWholeNumber;
          setSize(formattedValue);
        } else {
          setSize(sizeValue);
        }
        setUnit(value.unit);
      }
    }
  }, [value]);

  const handleSizeChange = (newSize: string) => {
    // Remove all non-numeric characters except decimal points
    const numericValue = newSize.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }

    // Format the whole number part with commas
    if (parts.length > 0) {
      const wholeNumber = parts[0];
      const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Reconstruct the number with decimal part if it exists
      const formattedValue = parts.length > 1 ? `${formattedWholeNumber}.${parts[1]}` : formattedWholeNumber;

      setSize(formattedValue);
      updateValue(formattedValue, unit); // Pass the formatted value to maintain display consistency
    } else {
      setSize(numericValue);
      updateValue(numericValue, unit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    updateValue(size, newUnit);
  };

  const updateValue = (newSize: string, newUnit: string) => {
    onChange({
      size: newSize,
      unit: newUnit,
    });
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            type='text'
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            placeholder='e.g 12,000 or 1,200'
            className={`${error ? "border-red-500" : ""} border-black/80 py-6 text-xs shadow-none placeholder:text-xs md:text-xs`}
          />
        </div>

        <div className='w-32'>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger
              className={`${error ? "border-red-500" : ""} "md:text-xs border-black/80 py-6 text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80`}
            >
              <SelectValue className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80' />
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

      <p className='hidden text-xs text-gray-500'>
        Enter the project size and select the appropriate unit of measurement
      </p>
    </div>
  );
};
