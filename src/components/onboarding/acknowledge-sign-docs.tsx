import React from "react";
import { Button } from "@/src/components/ui/button";
import { Download, Paperclip } from "lucide-react";

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
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Acknowledge & Sign Docs</h3>

          <p className='mb-6 text-sm leading-relaxed text-gray-600'>
            Please review and accept all acknowledgements and disclaimers. After completing the form, you will be
            required to download and sign the necessary document(s), then reattach the signed copy to finalize your
            submission
          </p>

          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button
              type='button'
              onClick={handleDownloadDocument}
              className='flex items-center space-x-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
            >
              <Download className='h-4 w-4' />
              <span>Download document</span>
            </Button>

            <Button
              type='button'
              onClick={handleReattachDocument}
              variant='outline'
              className='flex items-center space-x-2 rounded-md border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50'
            >
              <Paperclip className='h-4 w-4' />
              <span>Reattach document</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

export default AcknowledgeSignDocs;
