"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Plus, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  acceptedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".png"],
}: FileUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles = multiple ? [...value, ...files] : files;
    onChange(newFiles);
    setIsModalOpen(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <>
      {/* Trigger Button */}
      <div>
        <Button
          type='button'
          variant='outline'
          onClick={() => setIsModalOpen(true)}
          className='rounded-md border border-black/10 bg-white px-3 py-5 text-sm font-normal text-text-muted hover:bg-gray-50'
        >
          <span className='flex items-center gap-2'>
            <span className='text-xs font-normal text-text-muted/80'>Upload</span>
            <Plus className='size-3 text-black' />
          </span>
        </Button>

        {/* Show uploaded files */}
        {value.length > 0 && (
          <div className='mt-3 space-y-2'>
            {value.map((file: File, index: number) => (
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
      </div>

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-lg bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>
              Upload Supporting Documents
            </DialogTitle>
          </DialogHeader>

          <p className='mb-6 text-center text-base text-[#858585]'>
            Please upload any relevant documents for this project
          </p>

          {/* Drag and Drop Area */}
          <div
            className={`mb-6 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* PDF Icon */}

            <Image
              src='/images/pdf.png'
              alt='upload-document'
              width={60}
              height={60}
              className='mx-auto flex items-center justify-center'
            />
            <p className='mb-2 text-sm text-text-muted'>Drag and drop files here or click to browse</p>
            <p className='text-xs text-text-muted/70'>Supported formats: {acceptedFileTypes.join(", ")}</p>
            <input
              type='file'
              multiple={multiple}
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInput}
              className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            />
          </div>

          {/* Upload Button */}
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = multiple;
                input.accept = acceptedFileTypes.join(",");
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    handleFiles(Array.from(files));
                  }
                };
                input.click();
              }}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
