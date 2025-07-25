"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { EnhancedTextarea } from "./enhanced-textarea";
import { cn } from "@/src/lib/utils";

interface PhysicalDescriptionsTabsProps {
  value?: Record<string, { text: string; files: File[] }>;
  onChange: (value: Record<string, { text: string; files: File[] }>) => void;
  error?: string;
}

const physicalDescriptionOptions = [
  { value: "superstructure", label: "Superstructure" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical System" },
  { value: "interior", label: "Interior Finishes" },
  { value: "safety", label: "Fire & Life Safety" },
  { value: "loading_docks", label: "Loading Docks" },
  { value: "rentable_sf", label: "Rentable SF" },
  { value: "average_floor_plate", label: "Average Floor Plate" },
  { value: "security", label: "Security" },
  { value: "emergency_generator", label: "Emergency Generator" },
  { value: "floors", label: "Floors" },
  { value: "roof", label: "Roof" },
  { value: "solar", label: "Solar" },
  { value: "fire_protection", label: "Fire Protection" },
  { value: "elevator", label: "Elevator" },
  { value: "windows", label: "Windows" },
  { value: "ceiling_heights", label: "Ceiling Heights" },
  { value: "architect", label: "Architect" },
  { value: "number_of_floors", label: "Number of Floors" },
  { value: "core_factor", label: "Core Factor" },
  { value: "access", label: "Access" },
  { value: "parking", label: "Parking" },
  { value: "site_description", label: "Site Description" },
  { value: "foundation", label: "Foundation" },
  { value: "structural_system", label: "Structural System" },
  { value: "roof_construction", label: "Roof Construction" },
  { value: "exterior_wall", label: "Exterior Wall" },
  { value: "hvac_system", label: "HVAC System" },
  { value: "unit_mix", label: "Unit Mix" },
];

export function PhysicalDescriptionsTabs({ value = {}, onChange, error }: PhysicalDescriptionsTabsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    setIsOpen(false);

    // Initialize the option if it doesn't exist
    if (!value[optionValue]) {
      const newValue = {
        ...value,
        [optionValue]: { text: "", files: [] },
      };
      onChange(newValue);
    }
  };

  const handleTextChange = (optionValue: string, text: string) => {
    const currentData = value[optionValue] || { text: "", files: [] };
    const newValue = {
      ...value,
      [optionValue]: { ...currentData, text },
    };
    onChange(newValue);
  };

  const handleFilesChange = (optionValue: string, files: File[]) => {
    const currentData = value[optionValue] || { text: "", files: [] };
    const newValue = {
      ...value,
      [optionValue]: { ...currentData, files },
    };
    onChange(newValue);
  };

  const removeOption = (optionValue: string) => {
    const newValue = { ...value };
    delete newValue[optionValue];
    onChange(newValue);
  };

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Button
          ref={buttonRef}
          type='button'
          variant='outline'
          onClick={() => setIsOpen(!isOpen)}
          className='border border-gray-300 bg-background-secondary py-6 pl-3 pr-9 text-blue-600 hover:border-black'
        >
          <div className='flex items-center'>
            <span className='font-medium text-blue-600'>Add</span>
            <span className='ml-2 text-text-muted/80'>Brief description of</span>
          </div>
        </Button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className='absolute left-0 top-full z-50 mt-1 w-full max-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg'
          >
            {physicalDescriptionOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-primary hover:text-white",
                  value[option.value] && "bg-primary text-white"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Show selected options with textareas */}
      {Object.keys(value).length > 0 && (
        <div className='space-y-4'>
          {Object.entries(value).map(([optionValue, data]) => {
            const option = physicalDescriptionOptions.find((opt) => opt.value === optionValue);
            return (
              <div key={optionValue} className='rounded-lg border border-gray-200 p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <h4 className='text-sm font-medium text-text-muted/80'>{option?.label}</h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeOption(optionValue)}
                    className='h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                  >
                    <span className='text-sm'>×</span>
                  </Button>
                </div>
                <EnhancedTextarea
                  value={data.text}
                  onChange={(text) => handleTextChange(optionValue, text)}
                  placeholder={`Brief description of the ${option?.label.toLowerCase()}`}
                  uploadedFiles={data.files}
                  onFilesChange={(files) => handleFilesChange(optionValue, files)}
                  acceptedFileTypes={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                  multiple={true}
                  error={!!error}
                />
              </div>
            );
          })}
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
