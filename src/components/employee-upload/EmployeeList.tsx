import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { writeFile, utils } from 'xlsx';
import type { EmployeeUploadData } from '@/types/employee';
import { ChevronDown, ChevronUp, ArrowUpDown, Search, Check, Download } from 'lucide-react';
import { EmployeeStatistics } from './EmployeeStatistics';
import { normalizeNationality } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EmployeeListProps {
  employees: EmployeeUploadData[];
}

type SortField = 'employeeId' | 'name' | 'email' | 'role' | 'nationality' | 'employmentType' | 'status';
type SortDirection = 'asc' | 'desc';

export function EmployeeList({ employees }: EmployeeListProps) {
  const [sortField, setSortField] = useState<SortField>('employeeId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { toast } = useToast();

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'invite_sent', label: 'Invite Sent' },
    { value: 'payroll_only', label: 'Payroll Only' }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === sortedAndFilteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(sortedAndFilteredEmployees.map(e => e.employeeId));
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleStatusSelect = (value: string) => {
    setStatusFilter(value);
    setShowStatusDropdown(false);
  };

  const handleRoleSelect = (value: string) => {
    setRoleFilter(value);
    setShowRoleDropdown(false);
  };

  const handleExport = () => {
    try {
      const exportData = sortedAndFilteredEmployees.map(employee => ({
        'Employee ID': employee.employeeId,
        'First Name': employee.firstName,
        'Last Name': employee.lastName,
        'Email': employee.email,
        'Role': employee.position,
        'Department': employee.department,
        'Nationality': employee.nationality,
        'Employment Type': employee.employmentType,
        'Status': getStatusDisplay(employee.status),
        'Basic Salary': employee.basicSalary,
        'Allowances': employee.allowances,
        'Start Date': employee.startDate,
      }));

      const wb = utils.book_new();
      const ws = utils.json_to_sheet(exportData);

      utils.book_append_sheet(wb, ws, 'Employees');
      writeFile(wb, 'employees.xlsx');

      toast({
        description: "Employee data exported successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        description: "Failed to export employee data",
        duration: 3000,
      });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#E6FAF8] text-[#00A3B1]';
      case 'invite_sent':
        return 'bg-[#F3F0FF] text-[#8B5CF6]';
      case 'payroll_only':
        return 'bg-[#F3F4F6] text-[#6B7280]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#00A3B1]';
      case 'invite_sent':
        return 'bg-[#8B5CF6]';
      case 'payroll_only':
        return 'bg-[#6B7280]';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'invite_sent':
        return 'Invite Sent';
      case 'payroll_only':
        return 'Payroll Only';
      default:
        return status;
    }
  };

  const sortedAndFilteredEmployees = useMemo(() => {
    return employees
      .filter(employee => {
        const searchLower = searchTerm.toLowerCase().trim();
        
        const normalizedNationality = normalizeNationality(employee.nationality);
        const normalizedSearch = normalizeNationality(searchLower);
        
        const matchesSearch = 
          (employee.employeeId || '').toLowerCase().includes(searchLower) ||
          (employee.firstName || '').toLowerCase().includes(searchLower) ||
          (employee.lastName || '').toLowerCase().includes(searchLower) ||
          (employee.email || '').toLowerCase().includes(searchLower) ||
          (employee.position || '').toLowerCase().includes(searchLower) ||
          (employee.employmentType || '').toLowerCase().includes(searchLower) ||
          (employee.department || '').toLowerCase().includes(searchLower) ||
          (employee.status || '').toLowerCase().includes(searchLower) ||
          `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase().includes(searchLower) ||
          normalizedNationality === normalizedSearch ||
          normalizedNationality.includes(searchLower);

        const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
        const matchesRole = roleFilter === 'all' || employee.position === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'employeeId':
            comparison = (a.employeeId || '').localeCompare(b.employeeId || '');
            break;
          case 'name':
            comparison = `${a.firstName || ''} ${a.lastName || ''}`.localeCompare(
              `${b.firstName || ''} ${b.lastName || ''}`
            );
            break;
          case 'email':
            comparison = (a.email || '').localeCompare(b.email || '');
            break;
          case 'role':
            comparison = (a.position || '').localeCompare(b.position || '');
            break;
          case 'nationality':
            comparison = normalizeNationality(a.nationality).localeCompare(
              normalizeNationality(b.nationality)
            );
            break;
          case 'employmentType':
            comparison = (a.employmentType || '').localeCompare(b.employmentType || '');
            break;
          case 'status':
            comparison = (a.status || '').localeCompare(b.status || '');
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [employees, sortField, sortDirection, searchTerm, statusFilter, roleFilter]);

  const uniqueRoles = useMemo(() => {
    return [...new Set(employees.map(e => e.position))].sort();
  }, [employees]);

  return (
    <div className="space-y-4">
      <EmployeeStatistics employees={sortedAndFilteredEmployees} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 w-[280px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02B9B0]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            style={{
              gap: "8px",
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowRoleDropdown(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[140px]"
            >
              {statusOptions.find(option => option.value === statusFilter)?.label}
              <ChevronDown className="h-4 w-4 ml-auto" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                      statusFilter === option.value ? 'text-[#02B9B0] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Roles Dropdown */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowStatusDropdown(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[140px]"
            >
              {roleFilter === 'all' ? 'All Roles' : roleFilter}
              <ChevronDown className="h-4 w-4 ml-auto" />
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                <button
                  onClick={() => handleRoleSelect('all')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                    roleFilter === 'all' ? 'text-[#02B9B0] font-medium' : 'text-gray-700'
                  }`}
                >
                  All Roles
                </button>
                {uniqueRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                      roleFilter === role ? 'text-[#02B9B0] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="w-10 py-3 px-3">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleSelectAll}
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        selectedEmployees.length === sortedAndFilteredEmployees.length
                          ? 'bg-[#02B9B0] border-[#02B9B0] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedEmployees.length === sortedAndFilteredEmployees.length && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </th>
                <th scope="col" className="w-[100px] py-3 px-3">
                  <button
                    onClick={() => handleSort('employeeId')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Employee ID
                    <SortIcon field="employeeId" />
                  </button>
                </th>
                <th scope="col" className="w-[250px] py-3 px-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Employee Profile
                    <SortIcon field="name" />
                  </button>
                </th>
                <th scope="col" className="w-[200px] py-3 px-3">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Email
                    <SortIcon field="email" />
                  </button>
                </th>
                <th scope="col" className="w-[150px] py-3 px-3">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Role
                    <SortIcon field="role" />
                  </button>
                </th>
                <th scope="col" className="w-[150px] py-3 px-3">
                  <button
                    onClick={() => handleSort('nationality')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Nationality
                    <SortIcon field="nationality" />
                  </button>
                </th>
                <th scope="col" className="w-[150px] py-3 px-3">
                  <button
                    onClick={() => handleSort('employmentType')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Employment Type
                    <SortIcon field="employmentType" />
                  </button>
                </th>
                <th scope="col" className="w-[100px] py-3 px-3">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase hover:text-gray-900"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedAndFilteredEmployees.map((employee, index) => (
                <motion.tr
                  key={employee.employeeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-4 px-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleSelectEmployee(employee.employeeId)}
                        className={`w-5 h-5 rounded flex items-center justify-center border ${
                          selectedEmployees.includes(employee.employeeId)
                            ? 'bg-[#02B9B0] border-[#02B9B0] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedEmployees.includes(employee.employeeId) && (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-[#02B9B0] font-medium">
                    {employee.employeeId}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm text-gray-600 font-medium">
                          {employee.firstName?.[0] || ''}{employee.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {employee.position}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {employee.nationality}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {employee.employmentType}
                  </td>
                  <td className="py-4 px-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(employee.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${getStatusDotColor(employee.status)}`} />
                      {getStatusDisplay(employee.status)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}