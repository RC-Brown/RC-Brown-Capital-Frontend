"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface SponsorInfoPopupProps {
  isOpen: boolean;
  title: string;
  description: string;
  ctaText: string;
  onContinue: () => void;
  onClose: () => void;
  currentSectionData?: { key: string };
}

export function SponsorInfoPopup({
  isOpen,
  title,
  description,
  ctaText,
  onContinue,
  onClose,
  currentSectionData,
}: SponsorInfoPopupProps) {
  const { phase } = useParams();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-end justify-end bg-black/30 pb-16 pr-4'
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
            className='w-full max-w-[411px]'
          >
            <Card className='overflow-hidden rounded-2xl border-0 bg-white shadow-2xl'>
              <CardContent className='p-0'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 pb-12'>
                  <h2 className='text-2xl font-semibold text-primary'>{title}</h2>
                  <button
                    onClick={onClose}
                    className='text-sm font-medium text-[#407BFF] underline transition-colors hover:text-blue-600'
                  >
                    Close
                  </button>
                </div>

                {/* Wallet Icon */}
                <div className='mb-12 flex justify-center'>
                  <Image src='/images/purse.png' alt='Wallet' width={100} height={100} />
                </div>

                {/* Description */}
                <div className='mb-10 px-6'>
                  <p className='text-center text-sm leading-none text-text-muted'>{description}</p>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 p-6 pt-0'>
                  <Link href='#' className='flex-1 no-underline hover:no-underline'>
                    <Button
                      asChild
                      variant='link'
                      className='h-[51px] w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-primary/90 hover:no-underline'
                    >
                      <span className='w-full'>{ctaText}</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={onContinue}
                    variant='outline'
                    className={`${phase === "project-upload" && currentSectionData?.key === "media-acknowledgement" ? "hidden" : ""} h-[51px] flex-1 rounded-md border-[1.5px] border-black/10 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50`}
                  >
                    Next Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
