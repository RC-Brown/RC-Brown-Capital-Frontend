"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface UploadedDocument {
  id: string;
  categoryKey: string;
  categoryLabel: string;
  fileName: string;
  fileSize: number;
  file: File;
}

interface SiteDocumentsUploadProps {
  value?: UploadedDocument[];
  onChange: (documents: UploadedDocument[]) => void;
  error?: string;
}

export function SiteDocumentsUpload({ value = [], onChange, error }: SiteDocumentsUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<{ key: string; label: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastValueRef = useRef<UploadedDocument[]>([]);

  const documentTypes = [
    { key: "floor_plan", label: "Floor Plan", required: false },
    { key: "survey_plan", label: "Survey plan", required: false },
    { key: "site_plan", label: "Site Plan", required: false },
    { key: "stacking_plan", label: "Stacking Plan", required: false },
    { key: "others", label: "Others", required: false },
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

  // Initialize documents from value prop only once
  useEffect(() => {
    const newValue = Array.isArray(value) ? value : [];
    if (newValue.length > 0 && lastValueRef.current.length === 0) {
      setDocuments(newValue);
      lastValueRef.current = newValue;
    }
  }, [value]);

  const openUploadModal = (category: { key: string; label: string }) => {
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

    const newDocuments: UploadedDocument[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (acceptedFileTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx|jpg|jpeg|png)$/i)) {
        const uploadedDoc: UploadedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          categoryKey: activeCategory.key,
          categoryLabel: activeCategory.label,
          fileName: file.name,
          fileSize: file.size,
          file,
        };
        newDocuments.push(uploadedDoc);
      }
    });

    if (newDocuments.length > 0) {
      const updatedDocuments = [...documents, ...newDocuments];
      setDocuments(updatedDocuments);
      lastValueRef.current = updatedDocuments;
      onChange(updatedDocuments);
    }
    closeModal();
  };

  const removeDocument = (id: string) => {
    const filteredDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(filteredDocuments);
    lastValueRef.current = filteredDocuments;
    onChange(filteredDocuments);
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

  const getCategoryDocuments = (categoryKey: string) => {
    return documents.filter((doc) => doc.categoryKey === categoryKey);
  };

  return (
    <div className='relative space-y-4'>
      {/* Document Categories List */}
      <div className='space-y-4'>
        {documentTypes.map((docType) => {
          const categoryDocs = getCategoryDocuments(docType.key);

          return (
            <div key={docType.key}>
              {/* Category Row */}
              <div className='flex items-center justify-between py-3'>
                <span className='whitespace-nowrap text-sm text-gray-700 lg:whitespace-normal'>{docType.label}</span>
                <div className='mx-4 flex-1 border-b border-dashed border-text-muted'></div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => openUploadModal(docType)}
                  className='flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-6 text-sm'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-xs font-normal text-text-muted/80'>Upload</span>
                    <Plus className='size-3 text-black' />
                  </span>
                </Button>
              </div>

              {/* Show uploaded documents for this category */}
              {categoryDocs.length > 0 && (
                <div className='ml-4 space-y-2'>
                  {categoryDocs.map((doc) => (
                    <div key={doc.id} className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-gray-500' />
                        <div>
                          <p className='text-xs font-medium text-gray-900'>{doc.fileName}</p>
                          <p className='text-xs text-gray-500'>{formatFileSize(doc.fileSize)}</p>
                        </div>
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeDocument(doc.id)}
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

      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
