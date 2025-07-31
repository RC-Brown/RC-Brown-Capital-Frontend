"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface SiteDocuments {
  floor_plan: File[];
  survey_plan: File[];
  site_plan: File[];
  stacking_plan: File[];
  others: File[];
}

interface SiteDocumentsUploadProps {
  value?: SiteDocuments;
  onChange: (documents: SiteDocuments) => void;
  error?: string;
}

export interface SiteDocumentsUploadRef {
  validate: () => boolean;
}

export const SiteDocumentsUpload = forwardRef<SiteDocumentsUploadRef, SiteDocumentsUploadProps>(
  (
    { value = { floor_plan: [], survey_plan: [], site_plan: [], stacking_plan: [], others: [] }, onChange, error },
    ref
  ) => {
    const [documents, setDocuments] = useState<SiteDocuments>(value);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<{ key: keyof SiteDocuments; label: string } | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const documentTypes = [
      { key: "floor_plan" as keyof SiteDocuments, label: "Floor Plan", required: true },
      { key: "survey_plan" as keyof SiteDocuments, label: "Survey Plan", required: true },
      { key: "site_plan" as keyof SiteDocuments, label: "Site Plan", required: true },
      { key: "stacking_plan" as keyof SiteDocuments, label: "Stacking Plan", required: true },
      { key: "others" as keyof SiteDocuments, label: "Others", required: false },
    ];

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

    // Trigger validation when error prop changes (from parent validation)
    useEffect(() => {
      if (error) {
        validateRequiredDocuments();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const openUploadModal = (category: { key: keyof SiteDocuments; label: string }) => {
      setActiveCategory(category);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setActiveCategory(null);
      setIsDragOver(false);
    };

    const handleFileSelect = (selectedFiles: FileList | null) => {
      if (!selectedFiles || !activeCategory) return;

      const newFiles: File[] = [];

      Array.from(selectedFiles).forEach((file) => {
        if (acceptedFileTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx|jpg|jpeg|png)$/i)) {
          newFiles.push(file);
        }
      });

      if (newFiles.length > 0) {
        const updatedDocuments = {
          ...documents,
          [activeCategory.key]: [...documents[activeCategory.key], ...newFiles],
        };
        setDocuments(updatedDocuments);
        onChange(updatedDocuments);

        // Clear validation error for this category when documents are added
        if (activeCategory) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[activeCategory.key];
            return newErrors;
          });
        }
      }
      closeModal();
    };

    const removeDocument = (categoryKey: keyof SiteDocuments, fileIndex: number) => {
      const updatedDocuments = {
        ...documents,
        [categoryKey]: documents[categoryKey].filter((_, index) => index !== fileIndex),
      };
      setDocuments(updatedDocuments);
      onChange(updatedDocuments);

      // Check if removing this document makes a required category empty
      const categoryDocs = updatedDocuments[categoryKey];
      const docType = documentTypes.find((type) => type.key === categoryKey);

      if (docType?.required && categoryDocs.length === 0) {
        setValidationErrors((prev) => ({
          ...prev,
          [categoryKey]: `Please upload the required document here`,
        }));
      }
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

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Validate required document types
    const validateRequiredDocuments = () => {
      const errors: Record<string, string> = {};

      documentTypes.forEach((docType) => {
        if (docType.required) {
          const categoryDocs = documents[docType.key];
          if (categoryDocs.length === 0) {
            errors[docType.key] = `Please upload the required document here`;
          }
        }
      });

      setValidationErrors(errors);
      const isValid = Object.keys(errors).length === 0;
      return isValid;
    };

    // Expose validation method to parent
    useImperativeHandle(ref, () => ({
      validate: () => validateRequiredDocuments(),
    }));

    return (
      <div className='relative space-y-4'>
        {/* Document Categories List */}
        <div className='space-y-4'>
          {documentTypes.map((docType) => {
            const categoryDocs = documents[docType.key];

            return (
              <div key={docType.key}>
                {/* Category Row */}
                <div className='flex items-center justify-between py-3'>
                  <div className='flex items-center gap-2'>
                    <span className='whitespace-nowrap text-sm text-gray-700 lg:whitespace-normal'>
                      {docType.label}
                      {docType.required && <span className='ml-1 text-red-500'>*</span>}
                    </span>
                  </div>
                  <div className='mx-4 flex-1 border-b border-dashed border-text-muted'></div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => openUploadModal(docType)}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-6 text-sm",
                      validationErrors[docType.key] && "border-red-500"
                    )}
                  >
                    <span className='flex items-center gap-2'>
                      <span className='text-xs font-normal text-text-muted/80'>Upload</span>
                      <Plus className='size-3 text-black' />
                    </span>
                  </Button>
                </div>

                {/* Validation Error */}
                {validationErrors[docType.key] && (
                  <p className='ml-4 text-xs text-red-500'>{validationErrors[docType.key]}</p>
                )}

                {/* Show uploaded documents for this category */}
                {categoryDocs.length > 0 && (
                  <div className='ml-4 space-y-2'>
                    {categoryDocs.map((file, index) => (
                      <div key={index} className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
                        <div className='flex items-center space-x-2'>
                          <FileText className='h-4 w-4 text-gray-500' />
                          <div>
                            <p className='text-xs font-medium text-gray-900'>{file.name}</p>
                            <p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeDocument(docType.key, index)}
                          className='h-6 w-6 p-0 text-red-600 hover:text-red-700'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upload Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-w-lg rounded-2xl bg-white p-6 pt-10'>
            <DialogHeader>
              <DialogTitle className='rounded-2xl text-center text-sm font-semibold text-primary'>
                Upload Site Documents
              </DialogTitle>
              <DialogDescription className='text-center text-sm text-[#858585]'>
                Please upload only relevant site documents for this project
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {/* Category being uploaded to */}
              {activeCategory && (
                <div className='mb-4 text-xs text-gray-600'>
                  Uploading to: <span className='font-medium'>{activeCategory.label}</span>
                </div>
              )}

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
                  Drag and drop your documents here, or{" "}
                  <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
                </p>
                <p className='text-xs text-gray-500'>Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, JPG, PNG</p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type='file'
                multiple
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
      </div>
    );
  }
);

SiteDocumentsUpload.displayName = "SiteDocumentsUpload";
