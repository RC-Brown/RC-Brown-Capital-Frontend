"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  const handleViewDocument = () => {
    window.open(
      "https://docs.google.com/document/d/15IyZ16KRus_1U3cLNWltG3WxEo4WEUnUKgC0Hjjw7l4/edit?usp=sharing",
      "_blank"
    );
  };

  return (
    <div className='space-y-2'>
      <Button
        type='button'
        variant='outline'
        onClick={handleViewDocument}
        className='flex items-center gap-2 rounded-xl border-[#55A2F0] bg-[#407BFF]/5 text-[#407BFF] hover:bg-blue-50'
      >
        View Definitions Document
        <ArrowRight className='size-4 -rotate-12' />
      </Button>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
