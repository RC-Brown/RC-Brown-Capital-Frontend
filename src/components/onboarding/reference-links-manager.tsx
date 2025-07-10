"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, Trash2, FileText, X } from "lucide-react";

interface ReferenceLink {
  id: string;
  url: string;
  file?: File;
  fileName?: string;
}

interface ReferenceLinksManagerProps {
  value?: ReferenceLink[];
  onChange: (links: ReferenceLink[]) => void;
}

export function ReferenceLinksManager({ value = [], onChange }: ReferenceLinksManagerProps) {
  const [links, setLinks] = useState<ReferenceLink[]>(value.length > 0 ? value : [createEmptyLink()]);

  const MAX_LINKS = 5;

  function createEmptyLink(): ReferenceLink {
    return {
      id: Math.random().toString(36).substr(2, 9),
      url: "",
    };
  }

  const updateLink = (id: string, field: keyof ReferenceLink, newValue: string | File | undefined) => {
    const updatedLinks = links.map((link) => (link.id === id ? { ...link, [field]: newValue } : link));
    setLinks(updatedLinks);
    onChange(updatedLinks);
  };

  const addLink = () => {
    if (links.length < MAX_LINKS) {
      const newLinks = [...links, createEmptyLink()];
      setLinks(newLinks);
      onChange(newLinks);
    }
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      const filteredLinks = links.filter((link) => link.id !== id);
      setLinks(filteredLinks);
      onChange(filteredLinks);
    }
  };

  const handleFileUpload = (id: string, file: File | null) => {
    if (file) {
      const acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (acceptedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx)$/i)) {
        updateLink(id, "file", file);
        updateLink(id, "fileName", file.name);
      } else {
        alert("Please upload a valid document file (PDF, DOC, DOCX, TXT, XLS, XLSX)");
      }
    }
  };

  const removeFile = (id: string) => {
    updateLink(id, "file", undefined);
    updateLink(id, "fileName", undefined);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className='space-y-6'>
      {links.map((link, index) => (
        <div key={link.id} className='space-y-4'>
          {/* Header with delete button */}
          {links.length > 1 && (
            <div className='flex items-center justify-end'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeLink(link.id)}
                className='text-red-600 hover:text-red-700'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          )}

          {/* Link and Document sections */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Link Section */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='text-base text-text-muted'>Link</div>
              </div>
              <Input
                type='url'
                placeholder='Provide a link'
                value={link.url}
                onChange={(e) => updateLink(link.id, "url", e.target.value)}
                className='text-sm'
              />
            </div>

            {/* Related Document Section */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='text-base text-text-muted'>Related Document</div>
              </div>

              {link.file ? (
                <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                  <div className='flex items-center space-x-2'>
                    <FileText className='h-4 w-4 text-gray-500' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>{link.fileName}</p>
                      <p className='text-xs text-gray-500'>{link.file.size ? formatFileSize(link.file.size) : ""}</p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFile(link.id)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='relative'>
                  <Input
                    type='file'
                    accept='.pdf,.doc,.docx,.txt,.xls,.xlsx'
                    onChange={(e) => handleFileUpload(link.id, e.target.files?.[0] || null)}
                    className='hidden'
                    id={`file-${link.id}`}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => document.getElementById(`file-${link.id}`)?.click()}
                    className='w-fit rounded-lg px-2 py-4 text-sm'
                  >
                    <span className='flex items-center gap-2'>
                      <Plus className='h-4 w-4' />
                      <span className='text-sm font-normal text-text-muted/80'>Upload</span>
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Separator line if not the last item */}
          {index < links.length - 1 && <hr className='border-gray-200' />}
        </div>
      ))}

      {links.length < MAX_LINKS && (
        <Button type='button' variant='ghost' onClick={addLink} className='w-fit px-0 text-gray-700'>
          <span className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            <span className='text-sm font-normal text-text-muted/80'>Add another references or testimonials</span>
          </span>
        </Button>
      )}

      {links.length >= MAX_LINKS && (
        <p className='text-center text-sm text-gray-500'>Maximum of {MAX_LINKS} references allowed</p>
      )}
    </div>
  );
}
