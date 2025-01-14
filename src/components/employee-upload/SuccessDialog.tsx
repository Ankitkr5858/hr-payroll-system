import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
} from '../ui/dialog';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeCount: number;
}

export function SuccessDialog({ isOpen, onClose, employeeCount }: SuccessDialogProps) {
  useEffect(() => {
    if (isOpen) {
      const colors = ['#00A3B1', '#FFB800', '#8B5CF6'];
      
      // Fire confetti from the center
      confetti({
        particleCount: 100,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        startVelocity: 30,
        gravity: 0.5,
        ticks: 200,
        shapes: ['circle', 'square'],
        scalar: 1
      });

      // Add a slight delay for the second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: colors,
          startVelocity: 25,
          gravity: 0.5,
          ticks: 200,
          shapes: ['circle'],
          scalar: 0.8
        });
      }, 250);

      return () => {
        confetti.reset();
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[400px] p-6 bg-white text-center"
        style={{
          width: "420px",
          maxWidth: "420px",
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-[#E6FAF8] text-[#00A3B1] mx-auto flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
            
            <h2 
              className="text-xl font-semibold text-gray-900 mb-2" 
              style={{ 
                fontFamily: 'Quicksand',
                fontSize: '24px',
                lineHeight: '32px',
                fontWeight: 700
              }}
            >
              Congrats! You've successfully added all your employees!
            </h2>
            
            <p 
              className="text-gray-500 mb-6" 
              style={{ 
                fontFamily: 'Quicksand',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 500
              }}
            >
              Would you like to generate payroll?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                style={{ 
                  fontFamily: 'Quicksand',
                  borderRadius: '14px',
                  border: '1px solid rgba(179, 190, 190, 1)',
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 600
                }}
              >
                I'll do it later
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#00A3B1] hover:bg-[#018995]"
                style={{ 
                  fontFamily: 'Quicksand',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 600
                }}
              >
                Generate Payroll
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}