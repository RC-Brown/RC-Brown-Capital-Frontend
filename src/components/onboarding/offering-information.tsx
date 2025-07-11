"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface OfferingInformationProps {
  value?: { informationType: string; file?: File };
  onChange: (value: { informationType: string; file?: File }) => void;
  error?: string;
}

const informationTypes = [
  { value: "offering_memorandum", label: "Offering Memorandum" },
  { value: "private_placement", label: "Private Placement Memorandum" },
  { value: "investment_summary", label: "Investment Summary" },
  { value: "financial_projections", label: "Financial Projections" },
  { value: "market_analysis", label: "Market Analysis" },
  { value: "term_sheet", label: "Term Sheet" },
  { value: "other", label: "Other" },
];

export function OfferingInformation({ value = { informationType: "" }, onChange, error }: OfferingInformationProps) {
  const [selectedType, setSelectedType] = useState(value.informationType);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(value.file);

  const handleTypeChange = (informationType: string) => {
    setSelectedType(informationType);
    onChange({ informationType, file: uploadedFile });
  };

  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.[0]) {
        setUploadedFile(target.files[0]);
        onChange({ informationType: selectedType, file: target.files[0] });
      }
    };
    input.click();
  };

  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-800'>Offering Information</h4>

      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder='Offering Information Type' />
            </SelectTrigger>
            <SelectContent>
              {informationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={triggerFileUpload}
          className={cn("flex items-center gap-2", uploadedFile ? "border-green-200 bg-green-50 text-green-700" : "")}
        >
          Upload
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
