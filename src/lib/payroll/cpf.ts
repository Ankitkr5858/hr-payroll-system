import {
  CPF_RATES,
  ORDINARY_WAGE_CEILING,
  ADDITIONAL_WAGE_CEILING,
  PR_PHASE_RATES,
  MINIMUM_QUALIFYING_SALARY,
} from './constants';
import { calculateAge, determineAgeGroup, determineEmployeeType, roundToTwoDecimals } from './utils';
import type { CPFCalculationResult, Employee } from '@/types/employee';

export class CPFCalculator {
  private calculateBasicContribution(
    salary: number,
    ageGroup: string,
    employeeType: string,
    prPhase?: keyof typeof PR_PHASE_RATES
  ): CPFCalculationResult {
    const rates = CPF_RATES[ageGroup];
    const prRate = employeeType === 'pr' && prPhase ? PR_PHASE_RATES[prPhase] : 1;

    // Apply wage ceiling
    const cappedSalary = Math.min(salary, ORDINARY_WAGE_CEILING);

    // Calculate contributions
    const employeeContribution = roundToTwoDecimals(
      cappedSalary * rates.employee * prRate
    );
    const employerContribution = roundToTwoDecimals(
      cappedSalary * rates.employer * prRate
    );

    return {
      employeeContribution,
      employerContribution,
      totalContribution: roundToTwoDecimals(employeeContribution + employerContribution),
    };
  }

  private calculateAdditionalContribution(
    additionalWage: number,
    yearToDateOrdinaryWages: number,
    yearToDateAdditionalWages: number,
    ageGroup: string,
    employeeType: string,
    prPhase?: keyof typeof PR_PHASE_RATES
  ): CPFCalculationResult {
    // Check if already exceeded yearly ceiling
    if (yearToDateAdditionalWages >= ADDITIONAL_WAGE_CEILING) {
      return {
        employeeContribution: 0,
        employerContribution: 0,
        totalContribution: 0,
      };
    }

    // Calculate remaining ceiling
    const remainingCeiling = Math.max(
      0,
      ADDITIONAL_WAGE_CEILING - yearToDateOrdinaryWages * 12
    );

    // Apply ceiling to additional wage
    const cappedAdditionalWage = Math.min(
      additionalWage,
      remainingCeiling - yearToDateAdditionalWages
    );

    return this.calculateBasicContribution(
      cappedAdditionalWage,
      ageGroup,
      employeeType,
      prPhase
    );
  }

  public calculateCPF(
    employee: Employee,
    additionalWage: number = 0,
    yearToDateOrdinaryWages: number = 0,
    yearToDateAdditionalWages: number = 0
  ): CPFCalculationResult {
    // Validate inputs
    if (employee.basicSalary < MINIMUM_QUALIFYING_SALARY) {
      return {
        employeeContribution: 0,
        employerContribution: 0,
        totalContribution: 0,
      };
    }

    const age = calculateAge(employee.dateOfBirth);
    const ageGroup = determineAgeGroup(age);
    const employeeType = determineEmployeeType(employee.nationality, employee.isPR);

    // Foreigners don't contribute to CPF
    if (employeeType === 'foreigner') {
      return {
        employeeContribution: 0,
        employerContribution: 0,
        totalContribution: 0,
      };
    }

    // Calculate basic contribution
    const basicContribution = this.calculateBasicContribution(
      employee.basicSalary,
      ageGroup,
      employeeType
    );

    // Calculate additional wage contribution if any
    const additionalContribution = additionalWage > 0
      ? this.calculateAdditionalContribution(
          additionalWage,
          yearToDateOrdinaryWages,
          yearToDateAdditionalWages,
          ageGroup,
          employeeType
        )
      : {
          employeeContribution: 0,
          employerContribution: 0,
          totalContribution: 0,
        };

    // Combine both contributions
    return {
      employeeContribution: roundToTwoDecimals(
        basicContribution.employeeContribution + additionalContribution.employeeContribution
      ),
      employerContribution: roundToTwoDecimals(
        basicContribution.employerContribution + additionalContribution.employerContribution
      ),
      totalContribution: roundToTwoDecimals(
        basicContribution.totalContribution + additionalContribution.totalContribution
      ),
    };
  }
}