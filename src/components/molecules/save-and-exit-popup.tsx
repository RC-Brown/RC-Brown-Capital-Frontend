"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

interface SaveAndExitPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SaveAndExitPopup({ isOpen, onConfirm }: SaveAndExitPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className='w-full max-w-md rounded-2xl bg-white'>
              <CardContent className='p-8 text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className='mb-6'
                >
                  <Image
                    src='/images/save.gif'
                    alt='save'
                    className='mx-auto flex size-24 justify-center'
                    width={96}
                    height={96}
                  />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='mb-4 text-2xl font-semibold text-[#475F7B]'
                >
                  Your form has been saved
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='mb-8 text-base text-[#9CA3AF]'
                >
                  You can return anytime to complete or update your sponsorship details.
                </motion.p>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <Button
                    onClick={onConfirm}
                    className='rounded-lg bg-[#475F7B] px-8 py-3 text-sm font-semibold text-white hover:bg-[#3A4D61]'
                  >
                    Confirm
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
