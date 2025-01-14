# Kelick HR Platform - Payroll System Documentation

## System Overview

The Kelick HR Platform's payroll system is a robust solution designed to handle Singapore's complex CPF calculations and payroll processing requirements. This document outlines the implementation details, architecture decisions, and key features.

## Core Components

### 1. CPF Calculation Engine

The CPF calculator handles all CPF-related calculations with support for different age groups and employment types:

```typescript
// src/lib/payroll/cpf.ts
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
}
```

### 2. Payroll Processing

The PayrollProcessor handles bulk processing with optimized batch operations:

```typescript
// src/lib/payroll/PayrollProcessor.ts
export class PayrollProcessor {
  private batchSize = 100; // For bulk processing

  async processPayroll(
    periodStart: Date,
    periodEnd: Date,
    employees: Employee[],
    additions: Record<string, PayrollAddition[]> = {},
    deductions: Record<string, PayrollDeduction[]> = {}
  ) {
    try {
      // Validate payroll period and employees
      validatePayrollPeriod(periodStart, periodEnd);
      employees.forEach(validateEmployee);

      // Process employees in batches for better performance
      for (let i = 0; i < employees.length; i += this.batchSize) {
        const batch = employees.slice(i, i + this.batchSize);
        await Promise.all(
          batch.map(async (employee) => {
            const calculation = this.payrollCalculator.calculatePayroll(
              employee,
              additions[employee.id] || [],
              deductions[employee.id] || []
            );

            // Insert payroll records
            await this.insertPayrollRecords(employee, calculation);
          })
        );
      }
    } catch (error) {
      console.error('Payroll processing error:', error);
      throw error;
    }
  }
}
```

### 3. Data Validation

Comprehensive validation ensures data integrity:

```typescript
// src/lib/payroll/validation.ts
export function validateEmployee(employee: Employee) {
  // Basic validation
  if (!employee.id || !employee.employeeId) {
    throw new PayrollValidationError('Invalid employee ID');
  }

  // Salary validation
  if (typeof employee.basicSalary !== 'number' || employee.basicSalary < 0) {
    throw new PayrollValidationError('Invalid basic salary');
  }

  // Age validation (must be between 16 and 100)
  const age = new Date().getFullYear() - new Date(employee.dateOfBirth).getFullYear();
  if (age < 16 || age > 100) {
    throw new PayrollValidationError('Employee age must be between 16 and 100');
  }

  return true;
}
```

### 4. Testing Strategy

Comprehensive test coverage ensures reliability:

```typescript
// src/lib/payroll/__tests__/cpf.test.ts
describe('CPFCalculator', () => {
  const cpfCalculator = new CPFCalculator();

  it('should calculate CPF correctly for Singaporean below 55', () => {
    const result = cpfCalculator.calculateCPF(mockEmployee);
    expect(result.employeeContribution).toBe(1000); // 20% of 5000
    expect(result.employerContribution).toBe(850);  // 17% of 5000
  });

  it('should not calculate CPF for foreigners', () => {
    const result = cpfCalculator.calculateCPF({
      ...mockEmployee,
      nationality: 'Other',
      isPR: false,
    });
    expect(result.totalContribution).toBe(0);
  });
});
```

## Key Features

### 1. CPF Rate Management

Configurable rates for different age groups and employment types:

```typescript
// src/lib/payroll/constants.ts
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
```

### 2. Error Handling

Custom error types and comprehensive error handling:

```typescript
// src/lib/payroll/validation.ts
export class PayrollValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PayrollValidationError';
  }
}

// Usage in PayrollProcessor
try {
  // Process payroll
} catch (error) {
  if (error instanceof PayrollValidationError) {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

### 3. Performance Optimization

Batch processing and parallel operations:

```typescript
// Parallel processing of additions and deductions
await Promise.all([
  this.insertAdditions(payrollItemId, employeeAdditions),
  this.insertDeductions(payrollItemId, employeeDeductions)
]);

// Batch processing
for (let i = 0; i < employees.length; i += this.batchSize) {
  const batch = employees.slice(i, i + this.batchSize);
  await Promise.all(batch.map(processEmployee));
}
```

## Database Schema

The system uses a well-structured database schema:

```sql
-- Payroll Records table
CREATE TABLE payroll_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  total_gross numeric(15,2) NOT NULL DEFAULT 0,
  total_net numeric(15,2) NOT NULL DEFAULT 0,
  total_cpf_employee numeric(15,2) NOT NULL DEFAULT 0,
  total_cpf_employer numeric(15,2) NOT NULL DEFAULT 0,
  processed_at timestamptz
);

-- Payroll Items table
CREATE TABLE payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_record_id uuid REFERENCES payroll_records(id),
  employee_id uuid REFERENCES employees(id),
  basic_salary numeric(15,2) NOT NULL,
  gross_salary numeric(15,2) NOT NULL,
  net_salary numeric(15,2) NOT NULL,
  cpf_employee numeric(15,2) NOT NULL,
  cpf_employer numeric(15,2) NOT NULL
);
```

## Security Considerations

1. Row Level Security (RLS) policies:
```sql
-- Allow authenticated users to read payroll records
CREATE POLICY "Allow authenticated users to read payroll records"
  ON payroll_records
  FOR SELECT
  TO authenticated
  USING (true);
```

2. Input validation and sanitization
3. Audit trails for all transactions

## Future Enhancements

1. **Advanced Features**
   - Multi-currency support
   - Advanced tax calculations
   - Custom deduction rules

2. **Performance Improvements**
   - Caching layer
   - Query optimization
   - Background processing

3. **User Experience**
   - Bulk operation progress tracking
   - Real-time calculation previews
   - Enhanced error reporting

## Conclusion

The Kelick HR Platform's payroll system demonstrates a robust, scalable, and maintainable solution for handling complex payroll calculations. The implementation provides:

- Accurate CPF calculations
- Efficient batch processing
- Comprehensive validation
- Scalable architecture
- Extensive testing coverage

This foundation ensures reliability while maintaining flexibility for future enhancements.