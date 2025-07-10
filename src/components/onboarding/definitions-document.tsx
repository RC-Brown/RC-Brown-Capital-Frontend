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
  onChange,
  error,
}: DefinitionsDocumentProps) {
  const handleViewDocument = () => {
    // This would typically open a modal or navigate to the document
    // For now, we'll just mark it as viewed
    onChange(true);
  };

  return (
    <div className='space-y-2'>
      <Button
        type='button'
        variant='outline'
        onClick={handleViewDocument}
        className='flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50'
      >
        View Definitions Document
        <ArrowRight className='h-4 w-4' />
      </Button>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
