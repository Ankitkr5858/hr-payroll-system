import { describe, it, expect } from 'vitest';
import { PayrollCalculator } from '../payroll';
import { Employee } from '@/types/employee';
import type { PayrollAddition, PayrollDeduction } from '../types';

describe('PayrollCalculator', () => {
  const payrollCalculator = new PayrollCalculator();

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

  it('should calculate basic payroll correctly', () => {
    const result = payrollCalculator.calculatePayroll(mockEmployee);

    expect(result.grossSalary).toBe(5000);
    expect(result.cpf.employee).toBe(1000);
    expect(result.cpf.employer).toBe(850);
    expect(result.netSalary).toBe(4000);
  });

  it('should handle additional payments correctly', () => {
    const additions: PayrollAddition[] = [
      { type: 'allowance', amount: 500, description: 'Transport' },
      { type: 'bonus', amount: 1000, description: 'Performance' },
    ];

    const result = payrollCalculator.calculatePayroll(mockEmployee, additions);

    expect(result.grossSalary).toBe(6500);
    expect(result.additions.total).toBe(1500);
    expect(result.additions.breakdown.allowances).toBe(500);
    expect(result.additions.breakdown.bonuses).toBe(1000);
  });

  it('should handle deductions correctly', () => {
    const deductions: PayrollDeduction[] = [
      { type: 'loan', amount: 200, description: 'Company loan' },
      { type: 'insurance', amount: 100, description: 'Health insurance' },
    ];

    const result = payrollCalculator.calculatePayroll(mockEmployee, [], deductions);

    expect(result.deductions.total).toBe(1300); // 1000 (CPF) + 300 (other deductions)
    expect(result.deductions.breakdown.others).toBe(300);
    expect(result.netSalary).toBe(3700); // 5000 - 1000 (CPF) - 300 (deductions)
  });

  it('should throw error for invalid salary', () => {
    const invalidEmployee = {
      ...mockEmployee,
      basicSalary: -1000,
    };

    expect(() => {
      payrollCalculator.calculatePayroll(invalidEmployee);
    }).toThrow('Invalid salary amount');
  });
});