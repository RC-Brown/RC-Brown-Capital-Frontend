"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface IdentificationData {
  bvn?: string;
  nin?: string;
  ssn?: string;
  sin?: string; // Canada
  nino?: string; // UK
}

interface IdentificationFieldsProps {
  value?: IdentificationData;
  onChange: (data: IdentificationData) => void;
  selectedCountry?: string;
}

export function IdentificationFields({ value = {}, onChange, selectedCountry }: IdentificationFieldsProps) {
  const [identificationData, setIdentificationData] = useState<IdentificationData>(value);
  const prevCountryRef = useRef<string | undefined>(selectedCountry);

  const updateField = (field: keyof IdentificationData, newValue: string) => {
    const newData = { ...identificationData, [field]: newValue };
    setIdentificationData(newData);
    onChange(newData);
  };

  // Clear fields when country changes
   
  useEffect(() => {
    if (prevCountryRef.current !== selectedCountry && prevCountryRef.current !== undefined) {
      const clearedData = {};
      setIdentificationData(clearedData);
      onChange(clearedData);
    }
    prevCountryRef.current = selectedCountry;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]); // Removed onChange from dependency array

  // Sync with external value changes
  useEffect(() => {
    if (value !== identificationData) {
      setIdentificationData(value);
    }
  }, [value, identificationData]);

  const renderFieldsForCountry = () => {
    if (!selectedCountry) return null;

    switch (selectedCountry.toLowerCase()) {
      case "nigeria":
        return (
          <>
            <div className='space-y-2'>
              <Label htmlFor='bvn'>BVN</Label>
              <Input
                id='bvn'
                type='text'
                placeholder='Enter your BVN'
                value={identificationData.bvn || ""}
                onChange={(e) => updateField("bvn", e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='nin'>NIN</Label>
              <Input
                id='nin'
                type='text'
                placeholder='Enter your NIN'
                value={identificationData.nin || ""}
                onChange={(e) => updateField("nin", e.target.value)}
              />
            </div>
          </>
        );

      case "united states":
        return (
          <div className='space-y-2'>
            <Label htmlFor='ssn'>Social Security Number</Label>
            <Input
              id='ssn'
              type='text'
              placeholder='Enter your SSN'
              value={identificationData.ssn || ""}
              onChange={(e) => updateField("ssn", e.target.value)}
            />
          </div>
        );

      case "canada":
        return (
          <div className='space-y-2'>
            <Label htmlFor='sin'>Social Insurance Number (SIN)</Label>
            <Input
              id='sin'
              type='text'
              placeholder='Enter your SIN'
              value={identificationData.sin || ""}
              onChange={(e) => updateField("sin", e.target.value)}
            />
          </div>
        );

      case "united kingdom":
        return (
          <div className='space-y-2'>
            <Label htmlFor='nino'>National Insurance Number</Label>
            <Input
              id='nino'
              type='text'
              placeholder='Enter your National Insurance Number'
              value={identificationData.nino || ""}
              onChange={(e) => updateField("nino", e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className='space-y-4'>{renderFieldsForCountry()}</div>;
}
