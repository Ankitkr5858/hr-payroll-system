import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KelickLogo } from './components/icons/KelickLogo';
import { BulkUploadIcon } from './components/icons/BulkUploadIcon';
import { UploadModal } from './components/employee-upload/UploadModal';
import { EmployeeList } from './components/employee-upload/EmployeeList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toaster } from './components/ui/toaster';
import type { EmployeeUploadData } from './types/employee';
import uploadImg from '../src/img/Search_User_1.png';

export default function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<EmployeeUploadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadComplete = async (data: EmployeeUploadData[]) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploadedData(data);
    setIsLoading(false);
  };

  return (
    <>
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-14 px-4 flex items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <KelickLogo />
            <span 
              className="text-gray-900 font-semibold"
              style={{
                fontWeight: "700",
              }}
            >
              kelick
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-6">
            <div>
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5 mr-3"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 20.9926H7C4.79086 20.9926 3 19.2017 3 16.9926V10.7002C3 9.30145 3.73061 8.00433 4.92679 7.27938L9.92679 4.24907C11.2011 3.4768 12.7989 3.47679 14.0732 4.24907L19.0732 7.27938C20.2694 8.00433 21 9.30145 21 10.7002V16.9926C21 19.2017 19.2091 20.9926 17 20.9926H15M9 20.9926V16.9926C9 15.3357 10.3431 13.9926 12 13.9926V13.9926C13.6569 13.9926 15 15.3357 15 16.9926V20.9926M9 20.9926H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Dashboard
              </a>
            </div>

            <div>
              <div 
                className="px-3 mb-2"
                style={{
                  display: "flex",
                  gap: "35px",
                  flexDirection: "row"
                }}
              >
                <span 
                  className="text-xs text-gray-500 uppercase tracking-wider"
                  style={{ fontWeight: 700, fontSize: "16px"}}
                >
                  Organization
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ paddingBottom: "9px" }}
                >
                  <path
                    d="M12 14.5284L17.2788 9.28543C17.6725 8.89497 18.3109 8.89497 18.7047 9.28543C19.0984 9.6759 19.0984 10.309 18.7047 10.6994L12.7131 16.6493C12.3192 17.0399 11.6807 17.0399 11.2869 16.6493L5.29532 10.6994C4.90156 10.309 4.90156 9.6759 5.29532 9.28543C5.68907 8.89497 6.32748 8.89497 6.72124 9.28543L12 14.5284Z"
                    fill="#7A8484"
                  />
                </svg>
              </div>

              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5 mr-3"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 9.00258L7.01 8.99147"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 9.00258L11.01 8.99147"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13.0026L7.01 12.9915"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 13.0026L11.01 12.9915"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 17.0026L7.01 16.9915"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 17.0026L11.01 16.9915"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 20.9926H3.6C3.26863 20.9926 3 20.724 3 20.3926V5.59258C3 5.26121 3.26863 4.99258 3.6 4.99258H9V3.59258C9 3.26121 9.26863 2.99258 9.6 2.99258H14.4C14.7314 2.99258 15 3.26121 15 3.59258V8.99258M15 20.9926H20.4C20.7314 20.9926 21 20.724 21 20.3926V9.59258C21 9.26121 20.7314 8.99258 20.4 8.99258H15M15 20.9926V16.9926M15 8.99258V12.9926M15 12.9926H17M15 12.9926V16.9926M15 16.9926H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Kelick
              </a>
            </div>

            <div>
              <div className="px-3 mb-2">
                <span 
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ fontWeight: 700, fontSize: "16px"}}
                >
                  Manage
                </span>
              </div>
              <div className="space-y-1">
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-gray-900 bg-gray-100"
                  style={{
                    border: "1px solid rgba(179, 190, 190, 1)",
                    borderRadius: "14px",
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17.9926V16.9926C7 14.2312 9.23858 11.9926 12 11.9926V11.9926C14.7614 11.9926 17 14.2312 17 16.9926V17.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 17.9926V16.9926C1 15.3357 2.34315 13.9926 4 13.9926V13.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 17.9926V16.9926C23 15.3357 21.6569 13.9926 20 13.9926V13.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11.9926C13.6569 11.9926 15 10.6494 15 8.99258C15 7.33573 13.6569 5.99258 12 5.99258C10.3431 5.99258 9 7.33573 9 8.99258C9 10.6494 10.3431 11.9926 12 11.9926Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 13.9926C5.10457 13.9926 6 13.0972 6 11.9926C6 10.888 5.10457 9.99258 4 9.99258C2.89543 9.99258 2 10.888 2 11.9926C2 13.0972 2.89543 13.9926 4 13.9926Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 13.9926C21.1046 13.9926 22 13.0972 22 11.9926C22 10.888 21.1046 9.99258 20 9.99258C18.8954 9.99258 18 10.888 18 11.9926C18 13.0972 18.8954 13.9926 20 13.9926Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-semibold"
                    style={{
                      fontWeight: "700",
                    }}
                  >
                    Employees
                  </span>
                </a>

                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg
                    width="24"
                    className="w-5 h-5 mr-3"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 8.22335C9.20085 7.48567 7.79346 6.97257 6.5 6.94044M3 15.2234C3.75189 16.1488 5.1499 16.6766 6.5 16.7214M6.5 6.94044C4.96102 6.90221 3.58333 7.54487 3.58333 9.30028C3.58333 12.531 10 10.9157 10 14.1464C10 15.9891 8.2922 16.7808 6.5 16.7214M6.5 6.94044V4.99258M6.5 16.7214V18.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 11.9926H21M21 11.9926L17.16 7.99258M21 11.9926L17.16 15.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Payroll
                </a>

                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg
                    width="24"
                    className="w-5 h-5 mr-3"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 3.99258V1.99258M15 3.99258V5.99258M15 3.99258H10.5M3 9.99258V18.9926C3 20.0972 3.89543 20.9926 5 20.9926H19C20.1046 20.9926 21 20.0972 21 18.9926V9.99258H3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 9.99258V5.99258C3 4.88801 3.89543 3.99258 5 3.99258H7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 1.99258V5.99258"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 9.99258V5.99258C21 4.88801 20.1046 3.99258 19 3.99258H18.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Leaves
                </a>

                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg
                    width="24"
                    className="w-5 h-5 mr-3"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 8.22335C9.20085 7.48567 7.79346 6.97257 6.5 6.94044M3 15.2234C3.75189 16.1488 5.1499 16.6766 6.5 16.7214M6.5 6.94044C4.96102 6.90221 3.58333 7.54487 3.58333 9.30028C3.58333 12.531 10 10.9157 10 14.1464C10 15.9891 8.2922 16.7808 6.5 16.7214M6.5 6.94044V4.99258M6.5 16.7214V18.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 11.9926H13M13 11.9926L16.84 7.99258M13 11.9926L16.84 15.9926"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Claims
                </a>

                <button className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg
                    width="24"
                    className="w-5 h-5 mr-3"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 12.4926C18.2761 12.4926 18.5 12.2687 18.5 11.9926C18.5 11.7164 18.2761 11.4926 18 11.4926C17.7239 11.4926 17.5 11.7164 17.5 11.9926C17.5 12.2687 17.7239 12.4926 18 12.4926Z"
                      fill="#2E3333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12.4926C12.2761 12.4926 12.5 12.2687 12.5 11.9926C12.5 11.7164 12.2761 11.4926 12 11.4926C11.7239 11.4926 11.5 11.7164 11.5 11.9926C11.5 12.2687 11.7239 12.4926 12 12.4926Z"
                      fill="#2E3333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 12.4926C6.27614 12.4926 6.5 12.2687 6.5 11.9926C6.5 11.7164 6.27614 11.4926 6 11.4926C5.72386 11.4926 5.5 11.7164 5.5 11.9926C5.5 12.2687 5.72386 12.4926 6 12.4926Z"
                      fill="#2E3333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  More
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Plan Info */}
        <div 
          className="mt-auto p-4 border-t border-gray-200"
          style={{
            paddingLeft: "26px",
          }}
        >
          <div 
            className="flex items-center mb-2"
            style={{
              gap: "14px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V18C21 19.1046 20.1046 20 19 20Z"
                stroke="#2E3333"
                strokeWidth="1.5"
              />
              <path
                d="M16.5 14C16.2239 14 16 13.7761 16 13.5C16 13.2239 16.2239 13 16.5 13C16.7761 13 17 13.2239 17 13.5C17 13.7761 16.7761 14 16.5 14Z"
                fill="#2E3333"
                stroke="#2E3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 7V5.60322C18 4.28916 16.7544 3.33217 15.4847 3.67075L4.48467 6.60409C3.60917 6.83756 3 7.63046 3 8.53656V9"
                stroke="#2E3333"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-sm font-medium text-gray-900">Free Plan</span>
          </div>
          <div className="text-xs text-gray-500">1/10 Employees</div>
          <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden mt-2.5">
            <div className="h-full w-1/10 bg-primary rounded-full" />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div 
            className="flex items-center mb-2"
            style={{
              gap: "18px",
              marginLeft: "4px",
              marginBottom: "23px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8.4C18 6.70261 17.3679 5.07475 16.2426 3.87452C15.1174 2.67428 13.5913 2 12 2C10.4087 2 8.88258 2.67428 7.75736 3.87452C6.63214 5.07475 6 6.70261 6 8.4C6 15.8667 3 18 3 18H21C21 18 18 15.8667 18 8.4Z"
                stroke="#2E3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="#2E3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              Notifications
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                columnGap: "48px",
              }}
            >
              <span></span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="4" fill="#FF6565" />
              </svg>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-600">JD</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">johndoe@asure.pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 10H20M23 10H20M20 10V7M20 10V13"
                stroke="#F9FCFC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20"
                stroke="#F9FCFC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                stroke="#F9FCFC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">Add Employee</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner />
              </motion.div>
            ) : uploadedData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmployeeList employees={uploadedData} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg p-8 text-center border border-gray-200"
              >
                <img
                  src={uploadImg}
                  alt="Start building your team"
                  className="mx-auto mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start building your team
                </h3>
                <p className="text-gray-500 mb-6">
                  Add your first team member or import your entire team.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    style={{
                      borderRadius: "14px",
                    }}
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                  >
                    <BulkUploadIcon />
                    <span className="ml-2">Bulk Upload</span>
                  </button>
                  <button
                    style={{
                      borderRadius: "14px",
                      gap: "10px",
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 10H20M23 10H20M20 10V7M20 10V13"
                        stroke="#F9FCFC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20"
                        stroke="#F9FCFC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                        stroke="#F9FCFC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add Employee
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
     
    </div>
     <Toaster />
     </>
  );
}