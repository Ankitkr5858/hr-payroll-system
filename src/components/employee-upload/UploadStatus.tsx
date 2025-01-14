import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface UploadStatusProps {
  status: 'processing' | 'success' | 'error';
  processedCount: number;
  totalCount: number;
  onClose: () => void;
}

export function UploadStatus({ status, processedCount, totalCount, onClose }: UploadStatusProps) {
  const progress = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-4 relative border border-gray-100">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-center">
        {status === 'processing' && (
          <div className="mr-3">
            <motion.div
              className="h-5 w-5 border-2 border-[#00A3B1] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
        )}
        {status === 'error' && (
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
        )}

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900">
              {status === 'processing' && 'Processing employees...'}
              {status === 'success' && 'Upload complete'}
              {status === 'error' && 'Upload failed'}
            </span>
            <span className="text-sm text-gray-500">
              {processedCount}/{totalCount}
            </span>
          </div>

          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                status === 'error' ? 'bg-red-500' : 'bg-[#00A3B1]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}