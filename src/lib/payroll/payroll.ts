import { CPFCalculator } from './cpf';
import { roundToTwoDecimals, validateSalaryInput } from './utils';
import type { Employee } from '@/types/employee';
import type { PayrollCalculation, PayrollDeduction, PayrollAddition } from './types';

export class PayrollCalculator {
  private cpfCalculator: CPFCalculator;

  constructor() {
    this.cpfCalculator = new CPFCalculator();
  }

  public calculatePayroll(
    employee: Employee,
    additions: PayrollAddition[] = [],
    deductions: PayrollDeduction[] = [],
    yearToDateOrdinaryWages: number = 0,
    yearToDateAdditionalWages: number = 0
  ): PayrollCalculation {
    // Validate inputs
    validateSalaryInput(employee.basicSalary);

    // Calculate additional payments
    const additionalPayments = additions.reduce(
      (total, addition) => total + addition.amount,
      0
    );

    // Calculate CPF contributions
    const cpfContributions = this.cpfCalculator.calculateCPF(
      employee,
      additionalPayments,
      yearToDateOrdinaryWages,
      yearToDateAdditionalWages
    );

    // Calculate other deductions
    const otherDeductions = deductions.reduce(
      (total, deduction) => total + deduction.amount,
      0
    );

    // Calculate total additions
    const allowances = additions
      .filter(addition => addition.type === 'allowance')
      .reduce((total, addition) => total + addition.amount, 0);

    const bonuses = additions
      .filter(addition => addition.type === 'bonus')
      .reduce((total, addition) => total + addition.amount, 0);

    // Calculate gross and net salary
    const grossSalary = employee.basicSalary + additionalPayments;
    const totalDeductions = cpfContributions.employeeContribution + otherDeductions;
    const netSalary = grossSalary - totalDeductions;

    return {
      grossSalary: roundToTwoDecimals(grossSalary),
      netSalary: roundToTwoDecimals(netSalary),
      cpf: {
        employee: roundToTwoDecimals(cpfContributions.employeeContribution),
        employer: roundToTwoDecimals(cpfContributions.employerContribution),
        total: roundToTwoDecimals(cpfContributions.totalContribution),
      },
      deductions: {
        total: roundToTwoDecimals(totalDeductions),
        breakdown: {
          cpf: roundToTwoDecimals(cpfContributions.employeeContribution),
          others: roundToTwoDecimals(otherDeductions),
        },
      },
      additions: {
        total: roundToTwoDecimals(additionalPayments),
        breakdown: {
          allowances: roundToTwoDecimals(allowances),
          bonuses: roundToTwoDecimals(bonuses),
        },
      },
    };
  }
}