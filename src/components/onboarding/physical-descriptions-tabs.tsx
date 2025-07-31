"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { EnhancedTextarea } from "./enhanced-textarea";
import { cn } from "@/src/lib/utils";

interface PhysicalDescription {
  description_title: string;
  description: string;
}

interface PhysicalDescriptionsTabsProps {
  value?: PhysicalDescription[];
  onChange: (value: PhysicalDescription[]) => void;
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

export function PhysicalDescriptionsTabs({ value = [], onChange, error }: PhysicalDescriptionsTabsProps) {
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

    const option = physicalDescriptionOptions.find((opt) => opt.value === optionValue);
    if (!option) return;

    // Check if this description already exists
    const existingIndex = value.findIndex((desc) => desc.description_title === option.label);
    if (existingIndex !== -1) return; // Already exists

    // Add new physical description
    const newDescription: PhysicalDescription = {
      description_title: option.label,
      description: "",
    };

    const newValue = [...value, newDescription];
    onChange(newValue);
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], description };
    onChange(newValue);
  };

  const removeDescription = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
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
            <span className='ml-2 text-text-muted/80'>Physical description</span>
          </div>
        </Button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className='absolute left-0 top-full z-50 mt-1 w-full max-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg'
          >
            {physicalDescriptionOptions.map((option) => {
              const isSelected = value.some((desc) => desc.description_title === option.label);
              return (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleOptionClick(option.value)}
                  disabled={isSelected}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors",
                    isSelected ? "cursor-not-allowed bg-gray-100 text-gray-400" : "hover:bg-primary hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Show selected descriptions with textareas */}
      {value.length > 0 && (
        <div className='space-y-4'>
          {value.map((description, index) => (
            <div key={index} className='rounded-lg border border-gray-200 p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <h4 className='text-sm font-medium text-text-muted/80'>{description.description_title}</h4>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeDescription(index)}
                  className='h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                >
                  <span className='text-sm'>×</span>
                </Button>
              </div>
              <EnhancedTextarea
                value={description.description}
                onChange={(text) => handleDescriptionChange(index, text)}
                placeholder={`Brief description of the ${description.description_title.toLowerCase()}`}
                error={!!error}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
