"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

interface CongratulationsPopupProps {
  isOpen: boolean;
  title: string;
  description: string;
  ctaText: string;
  sectionKey?: string;
  onContinue: () => void;
}

// Mapping of section keys to their respective GIFs
const sectionGifMap: Record<string, { src: string; alt: string }> = {
  "company-overview": {
    src: "/images/meteor-rain.gif",
    alt: "meteor-rain",
  },
  "investment-details": {
    src: "/images/analytics.gif",
    alt: "analytics",
  },
  "communication-final": {
    src: "/images/confetti.gif",
    alt: "confetti",
  },
  "company-bank-details": {
    src: "/images/personal-branding.gif",
    alt: "personal-branding",
  },
  // Default fallback
  default: {
    src: "/images/meteor-rain.gif",
    alt: "meteor-rain",
  },
};

export function CongratulationsPopup({
  isOpen,
  title,
  description,
  ctaText,
  sectionKey,
  onContinue,
}: CongratulationsPopupProps) {
  const gifData = sectionGifMap[sectionKey || "default"] || sectionGifMap.default;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className='w-full max-w-lg rounded-3xl bg-white'>
              <CardContent className='p-8 text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className='mb-6'
                >
                  <Image
                    src={gifData.src}
                    alt={gifData.alt}
                    className='mx-auto flex size-24 justify-center'
                    width={96}
                    height={96}
                  />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='mb-2 text-xl font-semibold text-primary'
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='mx-auto mb-12 max-w-[90%] text-sm text-[#858585]'
                >
                  {description}
                </motion.p>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <Button onClick={onContinue} className='px-4 py-6 text-xs font-medium'>
                    {ctaText}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
