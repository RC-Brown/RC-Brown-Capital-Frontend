"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface ClosingDocumentsProps {
  value?: { documentType: string; file?: File };
  onChange: (value: { documentType: string; file?: File }) => void;
  error?: string;
}

export interface ClosingDocumentsRef {
  validate: () => boolean;
}

const documentTypes = [
  { value: "private_placement_memorandum", label: "Private Placement Memorandum" },
  { value: "operating_agreement", label: "Operating Agreement" },
  { value: "subscription_agreement", label: "Subscription Agreement" },
  { value: "llc_company_agreement", label: "LLC Company Agreement" },
  { value: "tenants_in_common_agreement", label: "Tenants in Common Agreement" },
];

export const ClosingDocuments = forwardRef<ClosingDocumentsRef, ClosingDocumentsProps>(
  ({ value = { documentType: "" }, onChange, error }, ref) => {
    const [selectedType, setSelectedType] = useState(value.documentType);
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(value.file);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [validationError, setValidationError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ];

    const acceptedExtensions = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.jpg,.jpeg,.png";

    const handleTypeChange = (documentType: string) => {
      setSelectedType(documentType);
      onChange({ documentType, file: uploadedFile });
    };

    const openUploadModal = () => {
      if (!selectedType) {
        // Show error or alert that document type must be selected first
        return;
      }
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setIsDragOver(false);
    };

    const handleFileSelect = (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const file = selectedFiles[0];
      if (acceptedFileTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx|jpg|jpeg|png)$/i)) {
        setUploadedFile(file);
        onChange({ documentType: selectedType, file });
      }
      closeModal();
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = () => {
      setUploadedFile(undefined);
      onChange({ documentType: selectedType, file: undefined });
      // Clear validation error when file is removed
      setValidationError("");
    };

    // Validate that both document type and file are selected
    const validateClosingDocument = () => {
      if (!selectedType || !uploadedFile) {
        const error = "Please select a document type and upload the required document";
        setValidationError(error);
        console.log("ClosingDocuments validation:", { isValid: false, error, selectedType, uploadedFile });
        return false;
      }
      setValidationError("");
      console.log("ClosingDocuments validation:", { isValid: true, selectedType, uploadedFile });
      return true;
    };

    // Trigger validation when error prop changes (from parent validation)
    useEffect(() => {
      if (error) {
        validateClosingDocument();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    // Expose validation method to parent
    useImperativeHandle(ref, () => ({
      validate: () => validateClosingDocument(),
    }));

    return (
      <div className='w-2/3 space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger
                className={cn("w-full py-6 text-sm text-text-muted/80 shadow-none", error && "border-red-500")}
              >
                <SelectValue placeholder='Closing Document Type' />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className='hover:bg-primary hover:text-white'>
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
            onClick={openUploadModal}
            disabled={!selectedType}
            className={cn(
              "flex items-center gap-2 py-6 text-sm text-text-muted/80",
              uploadedFile ? "border-green-200 bg-green-50 text-green-700" : ""
            )}
          >
            Upload
            <Plus className='size-3 text-black' />
          </Button>
        </div>

        {/* Show uploaded file */}
        {uploadedFile && (
          <div className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
            <div className='flex items-center space-x-2'>
              <FileText className='h-4 w-4 text-gray-500' />
              <div>
                <p className='text-xs font-medium text-gray-900'>{uploadedFile.name}</p>
                <p className='text-xs text-gray-500'>{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={removeFile}
              className='h-6 w-6 p-0 text-red-600 hover:text-red-700'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-w-lg rounded-2xl bg-white p-6 pt-10'>
            <DialogHeader>
              <DialogTitle className='rounded-2xl text-center text-sm font-semibold text-primary'>
                Upload Closing Document
              </DialogTitle>
              <DialogDescription className='text-center text-sm text-[#858585]'>
                Please upload the closing document for {documentTypes.find((t) => t.value === selectedType)?.label}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {/* Drag and Drop Area */}
              <div
                className={cn(
                  "cursor-pointer rounded-lg border-2 border-dashed bg-background-secondary p-8 text-center transition-colors",
                  isDragOver ? "border-primary bg-blue-50" : "border-black/10 hover:border-black/20"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* PDF Icon */}
                <Image
                  src='/images/pdf.png'
                  alt='upload-document'
                  width={55}
                  height={55}
                  className='mx-auto flex items-center justify-center'
                />

                <p className='mb-2 text-sm text-gray-600'>
                  Drag and drop your document here, or{" "}
                  <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
                </p>
                <p className='text-xs text-gray-500'>Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, JPG, PNG</p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type='file'
                accept={acceptedExtensions}
                onChange={(e) => handleFileSelect(e.target.files)}
                className='hidden'
              />

              <div className='flex w-full justify-end'>
                {/* Upload Button */}
                <Button type='button' onClick={() => fileInputRef.current?.click()} className='px-12 py-6 text-xs'>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {(error || validationError) && <p className='text-sm text-red-500'>{error || validationError}</p>}
      </div>
    );
  }
);

ClosingDocuments.displayName = "ClosingDocuments";
