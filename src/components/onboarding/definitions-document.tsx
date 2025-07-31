"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { ArrowRight} from "lucide-react";
import { useState } from "react";

interface DefinitionsDocumentProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

export function DefinitionsDocument({
  // value,
  // onChange,
  error,
}: DefinitionsDocumentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleViewDocument = () => {
    setIsOpen(true);
  };

  return (
    <div className='space-y-2'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type='button'
            variant='outline'
            onClick={handleViewDocument}
            className='flex items-center gap-2 rounded-xl border-[#55A2F0] bg-[#407BFF]/5 text-[#407BFF] hover:bg-blue-50'
          >
            View Definitions Document
            <ArrowRight className='size-4 -rotate-12' />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[90vh] w-[90vw] max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-between'>
              <span>Definitions Document</span>
              {/* <Button variant='ghost' size='sm' onClick={() => setIsOpen(false)} className='h-8 w-8 p-0'>
                <X className='h-4 w-4' />
              </Button> */}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4 h-[70vh] w-full'>
            <iframe
              src='https://docs.google.com/document/d/15IyZ16KRus_1U3cLNWltG3WxEo4WEUnUKgC0Hjjw7l4/preview'
              className='h-full w-full rounded-lg border-0'
              title='Definitions Document'
            />
          </div>
        </DialogContent>
      </Dialog>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
