import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-gray-600">Please wait while we process your request...</p>
    </div>
  );
}