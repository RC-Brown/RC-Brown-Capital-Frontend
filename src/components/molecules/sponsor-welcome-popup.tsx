"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

interface SponsorWelcomePopupProps {
  isOpen: boolean;
  onContinue: () => void;
  onClose: () => void;
}

export function SponsorWelcomePopup({ isOpen, 
    // onContinue
     onClose }: SponsorWelcomePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-0'
        >
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", duration: 0.5 }}
            className='w-full max-w-[411px]'
          >
            <Card className='overflow-hidden rounded-b-none rounded-t-2xl border-0 bg-white shadow-2xl'>
              <CardContent className='rounded-none p-3'>
                {/* Wallet Icon */}
                <div className='mb-3 flex w-full items-center justify-center'>
                  <Image
                    src='/images/sponsor-info-warn.jpg'
                    alt=''
                    width={385}
                    height={261}
                    className='w-full rounded-xl'
                  />
                </div>

                {/* Description */}
                <div className='mb-3'>
                  <p className='text-left text-sm leading-[140%] text-text-muted'>
                    RC Brown Capital carefully checks every deal and partner to make sure everything is solid and
                    trustworthy.
                  </p>
                </div>
                <div className='flex items-center justify-end'>
                  <button
                    onClick={onClose}
                    className='text-sm font-medium text-[#407BFF] underline transition-colors hover:text-blue-600'
                  >
                    Close
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
