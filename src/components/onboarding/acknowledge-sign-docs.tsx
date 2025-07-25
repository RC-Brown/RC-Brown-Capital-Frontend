import React from "react";
import { Button } from "@/src/components/ui/button";
import { Paperclip } from "lucide-react";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

interface DocumentAcknowledgment {
  acknowledged?: boolean;
  documentDownloaded?: boolean;
  signedDocumentFile?: File | null;
}

interface AcknowledgeSignDocsProps {
  value?: DocumentAcknowledgment;
  onChange?: (value: DocumentAcknowledgment) => void;
}

const AcknowledgeSignDocs: React.FC<AcknowledgeSignDocsProps> = () =>
  // { value, onChange }
  {
    const handleDownloadDocument = () => {
      // Download document logic
    };

    const handleReattachDocument = () => {
      // Reattach document logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='rounded-lg border border-b-4 border-[#407BFF] bg-[#407BFF]/5 p-6'>
          <h3 className='mb-4 text-base font-medium text-text-muted'>Acknowledge & Sign Docs</h3>

          <p className='mb-10 text-base leading-normal text-text-muted'>
            Please review and accept all acknowledgements and disclaimers. After completing the form, you will be
            required to download and sign the necessary document(s), then reattach the signed copy to finalize your
            submission
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
