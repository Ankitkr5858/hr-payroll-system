import { Employee } from '@/types/employee';

export class PayrollValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PayrollValidationError';
  }
}

export function validateEmployee(employee: Employee) {
  // Basic validation
  if (!employee.id || !employee.employeeId) {
    throw new PayrollValidationError('Invalid employee ID');
  }

  // Salary validation
  if (typeof employee.basicSalary !== 'number' || employee.basicSalary < 0) {
    throw new PayrollValidationError('Invalid basic salary');
  }

  // Date validation
  const startDate = new Date(employee.startDate);
  if (isNaN(startDate.getTime())) {
    throw new PayrollValidationError('Invalid start date');
  }

  const birthDate = new Date(employee.dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    throw new PayrollValidationError('Invalid date of birth');
  }

  // Age validation (must be between 16 and 100)
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age < 16 || age > 100) {
    throw new PayrollValidationError('Employee age must be between 16 and 100');
  }

  // Employment type validation
  const validEmploymentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
  if (!validEmploymentTypes.includes(employee.employmentType)) {
    throw new PayrollValidationError('Invalid employment type');
  }

  return true;
}

export function validatePayrollPeriod(startDate: Date, endDate: Date) {
  if (startDate >= endDate) {
    throw new PayrollValidationError('Start date must be before end date');
  }

  if (endDate > new Date()) {
    throw new PayrollValidationError('End date cannot be in the future');
  }

  return true;
}