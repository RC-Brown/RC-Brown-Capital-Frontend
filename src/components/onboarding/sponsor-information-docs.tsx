"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

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

  const handleTrackRecordUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTrackRecordFile(file);
      onChange({ trackRecord: file, additionalDocs });
    }
  };

  const triggerTrackRecordUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx";
    input.onchange = (e) => handleTrackRecordUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const handleAdditionalDocUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedDocs = additionalDocs.map((doc) => (doc.id === docId ? { ...doc, file } : doc));
      setAdditionalDocs(updatedDocs);
      onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
    }
  };

  const triggerAdditionalDocUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
    input.onchange = (e) => handleAdditionalDocUpload(docId, e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
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

  return (
    <div className='space-y-6'>
      <h4 className='font-medium text-gray-800'>Sponsor Information</h4>

      {/* Track Record Upload */}
      <div className='flex items-center gap-4 rounded-lg border p-4'>
        <div className='flex-1'>
          <Input type='text' value='Track Record' readOnly className='bg-gray-50' />
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={triggerTrackRecordUpload}
          className={cn(
            "flex items-center gap-2",
            trackRecordFile ? "border-green-200 bg-green-50 text-green-700" : ""
          )}
        >
          Upload
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Additional Documents */}
      {additionalDocs.length > 0 && (
        <div className='space-y-3'>
          {additionalDocs.map((doc: SponsorDocument) => (
            <div key={doc.id} className='flex items-center gap-4 rounded-lg border p-4'>
              <div className='flex-1'>
                <Input type='text' value={doc.name} readOnly className='bg-gray-50' />
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => triggerAdditionalDocUpload(doc.id)}
                className={cn("flex items-center gap-2", doc.file ? "border-green-200 bg-green-50 text-green-700" : "")}
              >
                Upload
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Section */}
      <div className='space-y-3'>
        <h5 className='font-medium text-gray-700'>Add More</h5>

        <div className='flex items-center gap-4 rounded-lg border p-4'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Enter document name'
              value={newDocName}
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
            className='flex items-center gap-2'
          >
            Upload
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
