"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

interface SponsorLogoUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function SponsorLogoUpload({ value = [], onChange
  //  error
   }: SponsorLogoUploadProps) {
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
    // For sponsor logo, we only want one file
    const newFiles = files.slice(0, 1);
    onChange(newFiles);
    setIsModalOpen(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <>
      {/* Custom Upload UI */}
      <div className='space-y-4'>
        <div className='w-fit rounded-xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            {/* Upload GIF */}
            <div className='relative'>
              <Image src='/images/upload.gif' alt='Upload' width={88} height={88} className='mx-auto' />
            </div>

            {/* Upload Button */}
            <Button type='button' onClick={() => setIsModalOpen(true)} className='rounded-lg'>
              Upload
            </Button>
          </div>
        </div>

        {/* Show uploaded file */}
        {value.length > 0 && (
          <div className='space-y-2'>
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
                  className='h-6 w-6 text-red-50 hover:text-red-700'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog - Same as FileUpload component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-lg bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>Upload Sponsor Logo</DialogTitle>
          </DialogHeader>

          <p className='mb-6 text-center text-base text-[#858585]'>Please upload your sponsor logo</p>

          {/* Drag and Drop Area */}
          <div
            className={`mb-6 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Image
              src='/images/pdf.png'
              alt='upload-document'
              width={60}
              height={60}
              className='mx-auto flex items-center justify-center'
            />
            <p className='mb-2 text-sm text-text-muted'>Drag and drop files here or click to browse</p>
            <p className='text-xs text-text-muted/70'>Supported formats: .jpg, .png, .svg</p>
            <input
              type='file'
              multiple={false}
              accept='.jpg,.jpeg,.png,.svg'
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
                input.multiple = false;
                input.accept = ".jpg,.jpeg,.png,.svg";
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
