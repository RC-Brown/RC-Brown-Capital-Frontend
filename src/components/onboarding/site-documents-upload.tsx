"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

// interface SiteDocumentFile {
//   id: string;
//   type: string;
//   file?: File;
//   uploaded: boolean;
// }

interface SiteDocumentsUploadProps {
  value?: Record<string, File>;
  onChange: (value: Record<string, File>) => void;
  error?: string;
}

const documentTypes = [
  { key: "floor_plan", label: "Floor Plan", required: false },
  { key: "survey_plan", label: "Survey plan", required: false },
  { key: "site_plan", label: "Site Plan", required: false },
  { key: "stacking_plan", label: "Stacking Plan", required: false },
  { key: "others", label: "Others", required: false },
];

export function SiteDocumentsUpload({ value = {}, onChange, error }: SiteDocumentsUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>(value);

  const handleFileUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFiles = { ...uploadedFiles, [documentType]: file };
      setUploadedFiles(newFiles);
      onChange(newFiles);
    }
  };

  const triggerFileUpload = (documentType: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (e) => handleFileUpload(documentType, e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  return (
    <div className='space-y-4'>
      {documentTypes.map((docType) => (
        <div key={docType.key} className='flex items-center justify-between border-b border-gray-200 py-3'>
          <div className='flex items-center'>
            <span className='font-medium text-gray-700'>{docType.label}</span>
            <div className='ml-4 h-0 flex-1 border-b border-dashed border-gray-300'></div>
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => triggerFileUpload(docType.key)}
            className={cn(
              "ml-4 flex items-center gap-2",
              uploadedFiles[docType.key] ? "border-green-200 bg-green-50 text-green-700" : ""
            )}
          >
            Upload
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      ))}

      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
