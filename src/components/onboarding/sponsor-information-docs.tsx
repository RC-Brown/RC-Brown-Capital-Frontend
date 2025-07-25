"use client";

import { useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface SponsorDocument {
  id: string;
  name: string;
  file?: File;
}

interface SponsorInformationDocsProps {
  value?: { trackRecord?: File; additionalDocs?: SponsorDocument[] };
  onChange: (value: { trackRecord?: File; additionalDocs?: SponsorDocument[] }) => void;
  error?: string;
}

export function SponsorInformationDocs({
  value = { additionalDocs: [] },
  onChange,
  error,
}: SponsorInformationDocsProps) {
  const [trackRecordFile, setTrackRecordFile] = useState<File | undefined>(value.trackRecord);
  const [additionalDocs, setAdditionalDocs] = useState<SponsorDocument[]>(value.additionalDocs || []);
  const [newDocName, setNewDocName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<"trackRecord" | "additionalDoc" | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
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

  const openUploadModal = (type: "trackRecord" | "additionalDoc", docId?: string) => {
    setActiveUploadType(type);
    setActiveDocId(docId || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDragOver(false);
    setActiveUploadType(null);
    setActiveDocId(null);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];
    if (acceptedFileTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx|jpg|jpeg|png)$/i)) {
      if (activeUploadType === "trackRecord") {
        setTrackRecordFile(file);
        onChange({ trackRecord: file, additionalDocs });
      } else if (activeUploadType === "additionalDoc" && activeDocId) {
        const updatedDocs = additionalDocs.map((doc) => (doc.id === activeDocId ? { ...doc, file } : doc));
        setAdditionalDocs(updatedDocs);
        onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
      }
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

  const removeTrackRecord = () => {
    setTrackRecordFile(undefined);
    onChange({ trackRecord: undefined, additionalDocs });
  };

  const removeAdditionalDoc = (docId: string) => {
    const updatedDocs = additionalDocs.map((doc) => (doc.id === docId ? { ...doc, file: undefined } : doc));
    setAdditionalDocs(updatedDocs);
    onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
  };

  const addNewDocument = () => {
    if (newDocName.trim()) {
      const newDoc: SponsorDocument = {
        id: Date.now().toString(),
        name: newDocName.trim(),
      };
      const updatedDocs = [...additionalDocs, newDoc];
      setAdditionalDocs(updatedDocs);
      setNewDocName("");
      onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
    }
  };

  const getModalTitle = () => {
    if (activeUploadType === "trackRecord") return "Upload Track Record";
    if (activeUploadType === "additionalDoc" && activeDocId) {
      const doc = additionalDocs.find((d) => d.id === activeDocId);
      return `Upload ${doc?.name || "Document"}`;
    }
    return "Upload Document";
  };

  const getModalDescription = () => {
    if (activeUploadType === "trackRecord") return "Please upload your track record document";
    if (activeUploadType === "additionalDoc" && activeDocId) {
      const doc = additionalDocs.find((d) => d.id === activeDocId);
      return `Please upload the document for ${doc?.name || "this item"}`;
    }
    return "Please upload your document";
  };

  return (
    <div className='w-2/3 space-y-6'>
      {/* Track Record Upload */}
      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Input type='text' value='Track Record' readOnly className='py-6 text-sm text-text-muted/80 shadow-none' />
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => openUploadModal("trackRecord")}
          className={cn(
            "flex items-center gap-2 py-6 text-sm text-text-muted/80",
            trackRecordFile ? "border-green-200 bg-green-50 text-green-700" : ""
          )}
        >
          Upload
          <Plus className='size-3 text-black' />
        </Button>
      </div>

      {/* Show uploaded track record */}
      {trackRecordFile && (
        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
          <div className='flex items-center space-x-2'>
            <FileText className='h-4 w-4 text-gray-500' />
            <div>
              <p className='text-xs font-medium text-gray-900'>{trackRecordFile.name}</p>
              <p className='text-xs text-gray-500'>{(trackRecordFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={removeTrackRecord}
            className='h-6 w-6 p-0 text-red-600 hover:text-red-700'
          >
            <X className='h-3 w-3' />
          </Button>
        </div>
      )}

      {/* Additional Documents */}
      {additionalDocs.length > 0 && (
        <div className='space-y-3'>
          {additionalDocs.map((doc: SponsorDocument) => (
            <div key={doc.id} className='flex items-center gap-4'>
              <div className='flex-1'>
                <Input type='text' value={doc.name} readOnly className='py-6 text-sm text-text-muted/80 shadow-none' />
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => openUploadModal("additionalDoc", doc.id)}
                className={cn(
                  "flex items-center gap-2 py-6 text-sm text-text-muted/80",
                  doc.file ? "border-green-200 bg-green-50 text-green-700" : ""
                )}
              >
                Upload
                <Plus className='size-3 text-black' />
              </Button>
            </div>
          ))}

          {/* Show uploaded additional documents */}
          {additionalDocs.map(
            (doc: SponsorDocument) =>
              doc.file && (
                <div
                  key={`file-${doc.id}`}
                  className='ml-4 flex items-center justify-between rounded-lg bg-gray-50 p-2'
                >
                  <div className='flex items-center space-x-2'>
                    <FileText className='h-4 w-4 text-gray-500' />
                    <div>
                      <p className='text-xs font-medium text-gray-900'>{doc.file.name}</p>
                      <p className='text-xs text-gray-500'>{(doc.file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeAdditionalDoc(doc.id)}
                    className='h-6 w-6 p-0 text-red-600 hover:text-red-700'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </div>
              )
          )}
        </div>
      )}

      {/* Add More Section */}
      <div className='space-y-3'>
        <h5 className='text-sm text-text-muted'>Add More</h5>

        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Enter document name'
              value={newDocName}
              className='py-6 text-sm text-text-muted/80 shadow-none'
              onChange={(e) => setNewDocName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewDocument()}
            />
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addNewDocument}
            disabled={!newDocName.trim()}
            className='flex items-center gap-2 py-6 text-sm text-text-muted/80'
          >
            Upload
            <Plus className='size-3 text-black' />
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-lg rounded-2xl bg-white p-6 pt-10'>
          <DialogHeader>
            <DialogTitle className='rounded-2xl text-center text-sm font-semibold text-primary'>
              {getModalTitle()}
            </DialogTitle>
            <DialogDescription className='text-center text-sm text-[#858585]'>
              {getModalDescription()}
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

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
