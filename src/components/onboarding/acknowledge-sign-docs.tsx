"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Paperclip } from "lucide-react";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import axios from "axios";

interface DocumentAcknowledgment {
  projectId?: number;
  acknowledged?: boolean;
  documentDownloaded?: boolean;
  signedDocumentFile?: File | null;
}

interface AcknowledgeSignDocsProps {
  value?: DocumentAcknowledgment;
  onChange?: (value: DocumentAcknowledgment) => void;
}

const AcknowledgeSignDocs: React.FC<AcknowledgeSignDocsProps> = ({ value, onChange }) => {
  const { formData: onboardingData } = useOnboardingStoreWithUser();
  const handleDownloadDocument = async () => {
    try {
      // Get project ID from form data
      const projectId = onboardingData.project_id;
      console.log("projectId", onboardingData);
      if (!projectId) {
        console.error("Project ID not found");
        return;
      }

      // Call backend to download acknowledgement form
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-uploads/${projectId}/download-acknowledgement-form`,
        {
          headers: {
            Accept: "application/pdf",
          },
          responseType: "blob",
        }
      );

      // Get the PDF blob from axios response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "acknowledgement_form.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Update state
      onChange?.({ ...value, documentDownloaded: true });
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleReattachDocument = () => {
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Get project ID from form data
        const projectId = value?.projectId;
        if (!projectId) {
          console.error("Project ID not found");
          return;
        }

        // Create form data
        const formData = new FormData();
        formData.append("signed_acknowledgement_form", file);

        // Submit signed form to backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/project-uploads/${projectId}/signed-acknowledgement`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!response.data) {
          throw new Error("Failed to submit signed form");
        }

        // Update state on success
        onChange?.({
          ...value,
          signedDocumentFile: file,
          acknowledged: true,
        });
      } catch (error) {
        console.error("Error submitting signed form:", error);
      }
    };
    input.click();
  };

  return (
    <div className='mb-6 w-full'>
      <div className='rounded-lg border border-b-4 border-[#407BFF] bg-[#407BFF]/5 p-6'>
        <h3 className='mb-4 text-base font-medium text-text-muted'>Acknowledge & Sign Docs</h3>

        <p className='mb-10 text-base leading-normal text-text-muted'>
          Please review and accept all acknowledgements and disclaimers. After completing the form, you will be required
          to download and sign the necessary document(s), then reattach the signed copy to finalize your submission
        </p>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button
            type='button'
            onClick={handleDownloadDocument}
            className='flex items-center space-x-2 rounded-[10px] border border-[#55A2F0] bg-[#407BFF]/5 px-3 py-2 text-base font-semibold text-[#407BFF] hover:bg-[#407BFF]/5'
          >
            <CloudArrowDownIcon className='size-6 stroke-[2.3px]' />
            <span>Download document</span>
          </Button>

          <Button
            type='button'
            onClick={handleReattachDocument}
            variant='outline'
            className='flex items-center space-x-2 rounded-[10px] border-none bg-[#ECF2FF] px-3 py-2 text-base font-semibold text-text-muted'
          >
            <span>Reattach document</span>
            <Paperclip className='size-4 -rotate-45 stroke-[2.3px]' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgeSignDocs;
