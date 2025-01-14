import { describe, it, expect } from 'vitest';
import { validateEmployee, validatePayrollPeriod, PayrollValidationError } from '../validation';
import type { Employee } from '@/types/employee';

describe('Payroll Validation', () => {
  const validEmployee: Employee = {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
    nationality: 'Singaporean',
    isPR: false,
    basicSalary: 5000,
    allowances: 500,
    startDate: '2024-01-01',
    department: 'Engineering',
    position: 'Senior Engineer',
    status: 'active',
    employmentType: 'Full-Time',
  };

  describe('validateEmployee', () => {
    it('should pass for valid employee', () => {
      expect(() => validateEmployee(validEmployee)).not.toThrow();
    });

    it('should throw for invalid salary', () => {
      const invalidEmployee = { ...validEmployee, basicSalary: -1000 };
      expect(() => validateEmployee(invalidEmployee)).toThrow(PayrollValidationError);
    });

    it('should throw for invalid age', () => {
      const invalidEmployee = { ...validEmployee, dateOfBirth: '1900-01-01' };
      expect(() => validateEmployee(invalidEmployee)).toThrow(PayrollValidationError);
    });

    it('should throw for invalid employment type', () => {
      const invalidEmployee = { ...validEmployee, employmentType: 'Invalid' as any };
      expect(() => validateEmployee(invalidEmployee)).toThrow(PayrollValidationError);
    });
  });

  describe('validatePayrollPeriod', () => {
    it('should pass for valid period', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      expect(() => validatePayrollPeriod(startDate, endDate)).not.toThrow();
    });

    it('should throw for invalid period', () => {
      const startDate = new Date('2024-01-31');
      const endDate = new Date('2024-01-01');
      expect(() => validatePayrollPeriod(startDate, endDate)).toThrow(PayrollValidationError);
    });

    it('should throw for future end date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-01-01');
      expect(() => validatePayrollPeriod(startDate, endDate)).toThrow(PayrollValidationError);
    });
  });
});