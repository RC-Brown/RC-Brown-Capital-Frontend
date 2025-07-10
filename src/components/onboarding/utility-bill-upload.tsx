"use client";

import { useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Paperclip } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface UtilityBillFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface UtilityBillUploadProps {
  value?: UtilityBillFile | null;
  onChange: (file: UtilityBillFile | null) => void;
}

export function UtilityBillUpload({ value = null, onChange }: UtilityBillUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UtilityBillFile | null>(value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

  const acceptedExtensions = ".pdf,.jpg,.jpeg,.png";

  const openUploadModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDragOver(false);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (acceptedFileTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      const file: UtilityBillFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name,
        size: selectedFile.size,
        file: selectedFile,
      };

      setUploadedFile(file);
      onChange(file);
      closeModal();
    } else {
      alert("Please upload a valid file (PDF, JPG, JPEG, PNG)");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onChange(null);
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
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className='w-1/2 space-y-3'>
      {uploadedFile ? (
        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
          <div className='flex items-center space-x-2'>
            <FileText className='h-4 w-4 text-gray-500' />
            <div>
              <p className='text-sm font-medium text-gray-900'>{uploadedFile.name}</p>
              <p className='text-xs text-gray-500'>{formatFileSize(uploadedFile.size)}</p>
            </div>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={removeFile}
            className='text-red-600 hover:text-red-700'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='e.g water, electricity, gas'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              readOnly
            />
          </div>
          <Button type='button' onClick={openUploadModal} className='rounded-lg px-6 py-2 text-white'>
            <span className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>Upload</span>
              <Paperclip className='h-4 w-4' />
            </span>
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-2xl bg-white'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>Upload Utility Bill</DialogTitle>
            <DialogDescription className='text-center text-base text-[#858585]'>
              Please upload only relevant documents (3 months)
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Drag and Drop Area */}
            <div
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
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
                width={60}
                height={60}
                className='mx-auto flex items-center justify-center'
              />

              <p className='mb-2 text-sm text-gray-600'>
                Drag and drop your utility bill here, or{" "}
                <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
              </p>
              <p className='text-xs text-gray-500'>Supported formats: PDF, JPG, JPEG, PNG</p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type='file'
              accept={acceptedExtensions}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className='hidden'
            />

            {/* Upload Button */}
            <Button type='button' onClick={() => fileInputRef.current?.click()} className='w-full text-white'>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
