"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Paperclip, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface EnhancedTextareaProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  uploadedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  acceptedFileTypes?: string[];
  multiple?: boolean;
}

export function EnhancedTextarea({
  value = "",
  onChange,
  placeholder,
  className,
  error,
  uploadedFiles = [],
  onFilesChange,
  acceptedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".png"],
  multiple = true,
}: EnhancedTextareaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !onFilesChange) return;

    const newFiles = Array.from(files);
    const updatedFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
    onFilesChange(updatedFiles);
    setIsModalOpen(false);
  };

  const removeFile = (index: number) => {
    if (!onFilesChange) return;
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
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

  return (
    <div className='relative'>
      <div className='relative'>
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "min-h-[100px] pr-12",
            error && "border-red-500",
            "text-sm shadow-none placeholder:text-text-muted/50",
            className
          )}
        />

        {/* Paper clip button */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => setIsModalOpen(true)}
          className='absolute right-2 top-2 h-8 w-8 p-0 text-text-muted/60 hover:bg-transparent hover:text-text-muted'
          disabled={!onFilesChange}
        >
          <Paperclip className='h-4 w-4' />
        </Button>
      </div>

      {/* Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className='mt-3 space-y-2'>
          {uploadedFiles.map((file: File, index: number) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2'
            >
              <span className='text-sm text-text-muted'>{file.name}</span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeFile(index)}
                className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-lg bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>
              Upload Supporting Documents
            </DialogTitle>
            <DialogDescription className='text-center text-base text-[#858585]'>
              Please upload any relevant documents
            </DialogDescription>
          </DialogHeader>

          {/* Drag and Drop Area */}
          <div
            className={cn(
              "relative mb-6 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
              isDragOver ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"
            )}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* PDF Icon */}
            <Image
              src='/images/pdf.png'
              alt='upload-document'
              width={60}
              height={60}
              className='mx-auto flex items-center justify-center'
            />
            <p className='mb-2 text-sm text-text-muted'>
              Drag and drop files here, or{" "}
              <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
            </p>
            <p className='text-xs text-text-muted/70'>Supported formats: {acceptedFileTypes.join(", ")}</p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type='file'
            multiple={multiple}
            accept={acceptedFileTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className='hidden'
          />

          {/* Upload Button */}
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className='px-6 py-2'
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
