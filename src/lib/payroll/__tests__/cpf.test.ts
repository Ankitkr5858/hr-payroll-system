import { describe, it, expect } from 'vitest';
import { CPFCalculator } from '../cpf';
import { Employee } from '@/types/employee';

describe('CPFCalculator', () => {
  const cpfCalculator = new CPFCalculator();

  const mockEmployee: Employee = {
    id: '1',
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
    employeeId: 'EMP001',
    status: 'active',
    employmentType: 'Full-Time',
  };

  it('should calculate CPF correctly for Singaporean below 55', () => {
    const result = cpfCalculator.calculateCPF(mockEmployee);

    expect(result.employeeContribution).toBe(1000); // 20% of 5000
    expect(result.employerContribution).toBe(850);  // 17% of 5000
    expect(result.totalContribution).toBe(1850);
  });

  it('should not calculate CPF for foreigners', () => {
    const foreignEmployee = {
      ...mockEmployee,
      nationality: 'Other',
      isPR: false,
    };

    const result = cpfCalculator.calculateCPF(foreignEmployee);

    expect(result.employeeContribution).toBe(0);
    expect(result.employerContribution).toBe(0);
    expect(result.totalContribution).toBe(0);
  });

  it('should apply wage ceiling correctly', () => {
    const highSalaryEmployee = {
      ...mockEmployee,
      basicSalary: 7000, // Above ceiling of 6000
    };

    const result = cpfCalculator.calculateCPF(highSalaryEmployee);

    expect(result.employeeContribution).toBe(1200); // 20% of 6000
    expect(result.employerContribution).toBe(1020); // 17% of 6000
    expect(result.totalContribution).toBe(2220);
  });

  it('should not calculate CPF for salary below minimum qualifying amount', () => {
    const lowSalaryEmployee = {
      ...mockEmployee,
      basicSalary: 400,
    };

    const result = cpfCalculator.calculateCPF(lowSalaryEmployee);

    expect(result.employeeContribution).toBe(0);
    expect(result.employerContribution).toBe(0);
    expect(result.totalContribution).toBe(0);
  });
});