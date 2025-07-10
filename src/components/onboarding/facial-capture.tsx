"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

interface FacialCaptureProps {
  value?: boolean;
  onChange: (captured: boolean) => void;
}

export function FacialCapture({ value = false, onChange }: FacialCaptureProps) {
  const [isCaptured, setIsCaptured] = useState(value);

  const handleCapture = () => {
    // In a real implementation, this would open camera and capture
    // For now, we'll just toggle the captured state
    const newState = !isCaptured;
    setIsCaptured(newState);
    onChange(newState);
  };

  return (
    <div className='space-y-4'>
      <div className='flex size-fit flex-col items-center justify-center rounded-lg border border-black/10 bg-white p-8 shadow-xl'>
        <div className='mb-6 flex size-fit items-center justify-center'>
          {isCaptured ? (
            <Check className='h-16 w-16 text-green-600' />
          ) : (
            <Image
              src='/images/facial-capture.gif'
              alt='Facial capture scanning'
              className='object-contain'
              width={88}
              height={88}
            />
          )}
        </div>

        <Button
          type='button'
          onClick={handleCapture}
          className={`px-8 py-3 text-white ${
            isCaptured ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/80"
          }`}
        >
          {isCaptured ? "Recapture" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
