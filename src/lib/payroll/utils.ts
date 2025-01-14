import { differenceInYears, parseISO } from 'date-fns';
import type { AgeGroup, EmployeeType } from './types';

export function calculateAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth));
}

export function determineAgeGroup(age: number): AgeGroup {
  if (age <= 55) return 'below55';
  if (age <= 60) return '55to60';
  if (age <= 65) return '60to65';
  return 'above65';
}

export function determineEmployeeType(nationality: string, isPR: boolean): EmployeeType {
  if (nationality === 'Singaporean') return 'citizen';
  if (isPR) return 'pr';
  return 'foreigner';
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateSalaryInput(salary: number): void {
  if (isNaN(salary) || salary < 0) {
    throw new Error('Invalid salary amount');
  }
}