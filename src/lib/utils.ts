import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
}

export function calculateCPFContributions(
  salary: number,
  age: number,
  isPR: boolean = false
): {
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
} {
  // Implementation based on CPF contribution rates
  // This is a simplified version - actual implementation would need more complex logic
  let employeeRate = 0.2;
  let employerRate = 0.17;

  if (age > 55 && age <= 60) {
    employeeRate = 0.13;
    employerRate = 0.13;
  } else if (age > 60 && age <= 65) {
    employeeRate = 0.075;
    employerRate = 0.09;
  } else if (age > 65) {
    employeeRate = 0.05;
    employerRate = 0.075;
  }

  if (isPR) {
    // Adjust rates for PR if needed
    employeeRate *= 0.9;
    employerRate *= 0.9;
  }

  const employeeContribution = salary * employeeRate;
  const employerContribution = salary * employerRate;
  const totalContribution = employeeContribution + employerContribution;

  return {
    employeeContribution,
    employerContribution,
    totalContribution,
  };
}
export function normalizeNationality(nationality: string = ''): string {
  const normalized = nationality.toLowerCase().trim();
  if (normalized === 'pr' || 
      normalized === 'permanent resident' || 
      normalized.includes('permanent resident') || 
      normalized.includes('pr')) {
    return 'pr';
  }
  if (normalized === 'singaporean' || 
      normalized === 'singapore citizen' || 
      normalized.includes('singaporean')) {
    return 'singaporean';
  }
  return normalized;
}