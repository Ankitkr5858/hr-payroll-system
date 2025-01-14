import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '../ui/dialog';
import { read, utils, writeFile } from 'xlsx';
import type { EmployeeUploadData } from '@/types/employee';
import { SuccessDialog } from './SuccessDialog';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import uploadImgl from '../../img/upload.png';
import uploadImg2 from '../../img/Microsoft_Office_Excel_Logo.png';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (data: EmployeeUploadData[]) => void;
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [processedData, setProcessedData] = useState<EmployeeUploadData[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const normalizeStatus = (status: string): 'active' | 'invite_sent' | 'payroll_only' => {
    const normalized = status?.toLowerCase().trim();
    if (normalized === 'active') return 'active';
    if (normalized === 'invite sent' || normalized === 'invite_sent') return 'invite_sent';
    if (normalized === 'payroll only' || normalized === 'payroll_only') return 'payroll_only';
    return 'payroll_only';
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 90) {
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 300);
    return interval;
  };

  const downloadTemplate = () => {
    const template = [
      {
        employeeId: 'FHAJ3717',
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@asure.pro',
        dateOfBirth: '1990-01-01',
        nationality: 'Singaporean',
        isPR: false,
        basicSalary: 5000,
        allowances: 500,
        startDate: '2024-01-01',
        department: 'Marketing',
        position: 'Senior Marketer',
        status: 'active',
        employmentType: 'Full-Time'
      }
    ];

    const ws = utils.json_to_sheet(template);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Template');
    writeFile(wb, 'employee_template.xlsx');
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploadState('uploading');
      const progressInterval = simulateProgress();
      const file = acceptedFiles[0];
      
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      // Slow down the progress to 95%
      setTimeout(() => {
        setProgress(95);
        setUploadState('processing');
      }, 2000);
      
      const processedData: EmployeeUploadData[] = jsonData.map((row: any, index) => ({
        employeeId: row['Employee ID'] || row.employeeId || '',
        firstName: row['Employee Profile']?.split(' ')[0] || row.firstName || '',
        lastName: row['Employee Profile']?.split(' ')[1] || row.lastName || '',
        email: row['Email'] || row.email || '',
        dateOfBirth: row['Date of Birth'] || row.dateOfBirth || '',
        nationality: row['Nationality'] || row.nationality || '',
        isPR: row['Is PR'] === 'true' || row['Is PR'] === true || row.isPR === true,
        basicSalary: Number(row['Basic Salary'] || row.basicSalary) || 0,
        allowances: Number(row['Allowances'] || row.allowances) || 0,
        startDate: row['Start Date'] || row.startDate || '',
        department: row['Department'] || row.department || '',
        position: row['Role'] || row.position || '',
        status: normalizeStatus(row['Status'] || row.status || 'active'),
        employmentType: row['Employment Type'] || row.employmentType || 'Full-Timer',
        row: index + 2,
        validationErrors: [],
      }));

      // Slow down the final progress to 100%
      setTimeout(() => {
        setProgress(100);
        clearInterval(progressInterval);
        
        // Add delay before showing success
        setTimeout(() => {
          setProcessedData(processedData);
          setUploadState('success');
          onUploadComplete(processedData);
        }, 1000);
      }, 1500);
      
    } catch (error) {
      setUploadState('error');
      setErrorMessage('Failed to process file. Please check the file format and try again.');
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleClose = () => {
    const wasSuccessful = uploadState === 'success';
    onClose();
    setUploadState('idle');
    setProgress(0);
    
    if (wasSuccessful) {
      setTimeout(() => {
        toast({
          description: "Employees successfully added"
        });
      }, 100);
    }
  };

  return (
    <>
      <Dialog open={isOpen && uploadState !== 'success'} onOpenChange={handleClose}>
        <DialogContent 
          className="sm:max-w-[480px] p-0 gap-0 bg-white font-sans"
          style={{
            width: "620px",
            maxWidth: "650px",
          }}
        >
          <div className="p-6">
            <DialogHeader className="flex items-center justify-between">
              <h2 
                className="text-xl font-semibold text-gray-900"
                style={{
                  fontFamily: 'Quicksand',
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 700
                }}
              >
                Upload File
              </h2>
            </DialogHeader>

            <div className="mt-6">
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg text-red-800 text-sm">
                  {errorMessage}
                </div>
              )}

              {(uploadState === 'uploading' || uploadState === 'processing') ? (
                <div className="py-4">
                  <Progress 
                    value={progress} 
                    className="h-3 bg-gray-100 rounded-[4px]" 
                    indicatorClassName="bg-[#02B9B0] transition-all duration-500 ease-in-out rounded-[4px]"
                  />
                  <p 
                    className="mt-4 text-sm text-gray-600 text-center"
                    style={{
                      fontFamily: 'Quicksand',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 500
                    }}
                  >
                    {uploadState === 'uploading' ? 'Uploading your file...' : 'Processing employees...'}
                  </p>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-[#02B9B0] bg-[#F0FDFA]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input {...getInputProps()} />
                  <img
                    src={uploadImgl}
                    alt="Upload illustration"
                    className="mx-auto mb-6"
                  />
                  <p className="mt-4 text-sm text-gray-600">
                    Drag and drop your files here
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    or{' '}
                    <span className="text-[#7A8484] underline font-bold cursor-pointer">
                      click to upload
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span
                  style={{
                    fontFamily: 'Quicksand',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px',
                  }}
                >
                  Supported formats: XLS, CSV
                </span>
                <span
                  style={{
                    fontFamily: 'Quicksand',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px',
                  }}
                >
                  Maximum file size: 25MB
                </span>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={uploadImg2}
                      alt="Excel template"
                      className="mx-auto mb-6"
                      style={{
                        marginTop: "21px",
                        width: "44px",
                      }}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4
                      className="text-sm font-medium text-gray-900"
                      style={{
                        fontWeight: 700,
                        marginBottom: "7px",
                      }}
                    >
                      Table Example
                    </h4>
                    <p 
                      className="text-sm text-gray-500"
                      style={{
                        fontWeight: "600"
                      }}
                    >
                      You can download the attached example and use them as
                      a starting point for your own file.
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="ml-4 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white border hover:bg-primary-light"
                    style={{
                      borderColor: "rgba(179, 190, 190, 1)",
                      gap: "7px",
                      borderRadius: "10px"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 16.6667L15 16.6667" stroke="#443D4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 3.33331V13.3333M10 13.3333L12.9167 10.4166M10 13.3333L7.08337 10.4166" stroke="#443D4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download XLSX
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-[14px] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-[14px] text-white bg-[#02B9B0] hover:bg-[#018995]"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessDialog
        isOpen={uploadState === 'success'}
        onClose={handleClose}
        employeeCount={processedData.length}
      />
    </>
  );
}