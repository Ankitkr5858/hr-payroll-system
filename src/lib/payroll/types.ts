export interface PayrollCalculation {
  grossSalary: number;
  netSalary: number;
  cpf: {
    employee: number;
    employer: number;
    total: number;
  };
  deductions: {
    total: number;
    breakdown: {
      cpf: number;
      others: number;
    };
  };
  additions: {
    total: number;
    breakdown: {
      allowances: number;
      bonuses: number;
    };
  };
}

export interface CPFRates {
  employee: number;
  employer: number;
}

export interface CPFCalculationResult {
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
}

export type AgeGroup = 'below55' | '55to60' | '60to65' | 'above65';
export type EmployeeType = 'citizen' | 'pr' | 'foreigner';

export interface PayrollPeriod {
  startDate: Date;
  endDate: Date;
}

export interface PayrollDeduction {
  type: string;
  amount: number;
  description?: string;
}

export interface PayrollAddition {
  type: 'allowance' | 'bonus' | 'other';
  amount: number;
  description?: string;
}