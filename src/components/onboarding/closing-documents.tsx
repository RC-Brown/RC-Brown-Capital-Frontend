"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ClosingDocumentsProps {
  value?: { documentType: string; file?: File };
  onChange: (value: { documentType: string; file?: File }) => void;
  error?: string;
}

const documentTypes = [
  { value: "purchase_agreement", label: "Purchase Agreement" },
  { value: "title_documents", label: "Title Documents" },
  { value: "loan_documents", label: "Loan Documents" },
  { value: "insurance_documents", label: "Insurance Documents" },
  { value: "inspection_reports", label: "Inspection Reports" },
  { value: "appraisal_report", label: "Appraisal Report" },
  { value: "other", label: "Other" },
];

export function ClosingDocuments({ value = { documentType: "" }, onChange, error }: ClosingDocumentsProps) {
  const [selectedType, setSelectedType] = useState(value.documentType);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(value.file);

  const handleTypeChange = (documentType: string) => {
    setSelectedType(documentType);
    onChange({ documentType, file: uploadedFile });
  };

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setUploadedFile(file);
  //     onChange({ documentType: selectedType, file });
  //   }
  // };

  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.[0]) {
        setUploadedFile(target.files[0]);
        onChange({ documentType: selectedType, file: target.files[0] });
      }
    };
    input.click();
  };

  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-800'>Closing Documents</h4>

      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder='Closing Document Type' />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
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
