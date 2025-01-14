import type { AgeGroup, CPFRates } from './types';

// CPF Contribution Rates for 2024
export const CPF_RATES: Record<AgeGroup, CPFRates> = {
  below55: {
    employee: 0.20,
    employer: 0.17,
  },
  '55to60': {
    employee: 0.15,
    employer: 0.15,
  },
  '60to65': {
    employee: 0.085,
    employer: 0.095,
  },
  above65: {
    employee: 0.06,
    employer: 0.075,
  },
};

// CPF Wage Ceiling
export const ORDINARY_WAGE_CEILING = 6000; // Monthly
export const ADDITIONAL_WAGE_CEILING = 102000; // Yearly

// PR Phase Rates (% of full rates)
export const PR_PHASE_RATES = {
  first_year: 0.55,
  second_year: 0.65,
  third_year_onwards: 1,
};

// Minimum Qualifying Salary
export const MINIMUM_QUALIFYING_SALARY = 500;