import React from 'react';
import { motion } from 'framer-motion';
import type { EmployeeUploadData } from '@/types/employee';

interface EmployeeStatisticsProps {
  employees: EmployeeUploadData[];
}

export function EmployeeStatistics({ employees }: EmployeeStatisticsProps) {
  // Calculate statistics
  const singaporeans = employees.filter(e => e.nationality?.toLowerCase() === 'singaporean').length;
  const pr = employees.filter(e => e.nationality?.toLowerCase() === 'pr').length;
  const foreigners = employees.filter(e => 
    e.nationality?.toLowerCase() !== 'singaporean' && 
    e.nationality?.toLowerCase() !== 'pr'
  ).length;

  const fullTimers = employees.filter(e => e.employmentType === 'Full-Timer').length;
  const partTimers = employees.filter(e => e.employmentType === 'Part-Timer').length;
  const contract = employees.filter(e => e.employmentType === 'Contract').length;
  const intern = employees.filter(e => e.employmentType === 'Intern').length;

  const active = employees.filter(e => e.status === 'active').length;
  const inviteSent = employees.filter(e => e.status === 'invite_sent').length;
  const payrollOnly = employees.filter(e => e.status === 'payroll_only').length;

  // Colors from the design
  const colors = {
    teal: '#02B9B0',
    purple: '#B774FC',
    gray: '#B3BEBE',
    yellow: '#FAC905'
  };

  // Data for each chart
  const nationalityData = [
    { value: singaporeans, color: colors.teal },
    { value: pr, color: colors.yellow },
    { value: foreigners, color: colors.purple }
  ];

  const employmentTypeData = [
    { value: fullTimers, color: colors.teal },
    { value: partTimers, color: colors.yellow },
    { value: contract, color: colors.purple },
    { value: intern, color: colors.gray }
  ];

  const statusData = [
    { value: active, color: colors.teal },
    { value: inviteSent, color: colors.purple },
    { value: payrollOnly, color: colors.gray }
  ];

  const calculateCircleSegments = (data: { value: number; color: string }[], gap = 18) => {
    const nonZeroData = data.filter(item => item.value > 0);
    if (nonZeroData.length === 0) return [];
    
    const total = nonZeroData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top
    
    return nonZeroData.map((item) => {
      const angle = (item.value / total) * (360 - gap * nonZeroData.length);
      const segment = {
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: item.color,
      };
      currentAngle += angle + gap;
      return segment;
    });
  };

  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: radius * Math.cos((startAngle * Math.PI) / 180) + 50,
      y: radius * Math.sin((startAngle * Math.PI) / 180) + 50,
    };
    const end = {
      x: radius * Math.cos((endAngle * Math.PI) / 180) + 50,
      y: radius * Math.sin((endAngle * Math.PI) / 180) + 50,
    };
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* Nationality */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
        <div className="flex justify-between items-start mt-4">
          <div>
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-gray-900">{singaporeans}</span>
              <span className="text-base text-gray-600 mt-1">Singaporeans</span>
            </div>
          </div>
          <div className="relative w-24 h-24">
            <svg width="100" height="100" className="transform -rotate-90">
              {calculateCircleSegments(nationalityData).map((segment, index) => (
                <motion.path
                  key={index}
                  d={createArcPath(segment.startAngle, segment.endAngle, 40)}
                  stroke={segment.color}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              ))}
            </svg>
          </div>
        </div>
        <div className="mt-6 flex items-center flex-wrap gap-4">
          {singaporeans > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.teal }} />
              <span className="font-semibold">{singaporeans}</span>
              <span>Singaporean</span>
            </div>
          )}
          {pr > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.yellow }} />
              <span className="font-semibold">{pr}</span>
              <span>PR</span>
            </div>
          )}
          {foreigners > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.purple }} />
              <span className="font-semibold">{foreigners}</span>
              <span>Foreigner</span>
            </div>
          )}
        </div>
      </div>

      {/* Employment Type */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-4xl font-semibold text-gray-900">{fullTimers}</span>
            <span className="ml-2 text-base text-gray-600">Full Timers</span>
          </div>
          <div className="mt-6">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex gap-1">
              {fullTimers > 0 && (
                <motion.div
                  style={{ 
                    width: `${(fullTimers / employees.length) * 100}%`, 
                    backgroundColor: colors.teal 
                  }}
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(fullTimers / employees.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              )}
              {partTimers > 0 && (
                <motion.div
                  style={{ 
                    width: `${(partTimers / employees.length) * 100}%`, 
                    backgroundColor: colors.yellow 
                  }}
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(partTimers / employees.length) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              )}
              {contract > 0 && (
                <motion.div
                  style={{ 
                    width: `${(contract / employees.length) * 100}%`, 
                    backgroundColor: colors.purple 
                  }}
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(contract / employees.length) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              )}
              {intern > 0 && (
                <motion.div
                  style={{ 
                    width: `${(intern / employees.length) * 100}%`, 
                    backgroundColor: colors.gray 
                  }}
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(intern / employees.length) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center flex-wrap gap-4">
            {fullTimers > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.teal }} />
                <span className="font-semibold">{fullTimers}</span>
                <span>Full-Timer</span>
              </div>
            )}
            {partTimers > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.yellow }} />
                <span className="font-semibold">{partTimers}</span>
                <span>Part-Timer</span>
              </div>
            )}
            {contract > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.purple }} />
                <span className="font-semibold">{contract}</span>
                <span>Contract</span>
              </div>
            )}
            {intern > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.gray }} />
                <span className="font-semibold">{intern}</span>
                <span>Intern</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Employee Status</h3>
        <div className="flex justify-between items-start mt-4">
          <div>
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-gray-900">{active}</span>
              <span className="text-base text-gray-600 mt-1">Active Employees</span>
            </div>
          </div>
          <div className="relative w-24 h-24">
            <svg width="100" height="100" className="transform -rotate-90">
              {calculateCircleSegments(statusData).map((segment, index) => (
                <motion.path
                  key={index}
                  d={createArcPath(segment.startAngle, segment.endAngle, 40)}
                  stroke={segment.color}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              ))}
            </svg>
          </div>
        </div>
        <div className="mt-6 flex items-center flex-wrap gap-4">
          {active > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.teal }} />
              <span className="font-semibold">{active}</span>
              <span>Active</span>
            </div>
          )}
          {inviteSent > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.purple }} />
              <span className="font-semibold">{inviteSent}</span>
              <span>Invite Sent</span>
            </div>
          )}
          {payrollOnly > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.gray }} />
              <span className="font-semibold">{payrollOnly}</span>
              <span>Payroll Only</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}