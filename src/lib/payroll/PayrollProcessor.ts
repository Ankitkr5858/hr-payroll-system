import { supabase } from '@/lib/supabase';
import { PayrollCalculator } from './payroll';
import { validateEmployee, validatePayrollPeriod } from './validation';
import type { Employee } from '@/types/employee';
import type { PayrollAddition, PayrollDeduction } from './types';

export class PayrollProcessor {
  private payrollCalculator: PayrollCalculator;
  private batchSize = 100; // For bulk processing

  constructor() {
    this.payrollCalculator = new PayrollCalculator();
  }

  async processPayroll(
    periodStart: Date,
    periodEnd: Date,
    employees: Employee[],
    additions: Record<string, PayrollAddition[]> = {},
    deductions: Record<string, PayrollDeduction[]> = {}
  ) {
    try {
      // Validate payroll period
      validatePayrollPeriod(periodStart, periodEnd);

      // Validate all employees first
      employees.forEach(validateEmployee);

      const { data: payrollRecord, error: recordError } = await supabase
        .from('payroll_records')
        .insert({
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          status: 'processing',
        })
        .select()
        .single();

      if (recordError) throw recordError;

      let totalGross = 0;
      let totalNet = 0;
      let totalCpfEmployee = 0;
      let totalCpfEmployer = 0;

      // Process employees in batches for better performance
      for (let i = 0; i < employees.length; i += this.batchSize) {
        const batch = employees.slice(i, i + this.batchSize);
        await Promise.all(
          batch.map(async (employee) => {
            const employeeAdditions = additions[employee.id] || [];
            const employeeDeductions = deductions[employee.id] || [];

            const calculation = this.payrollCalculator.calculatePayroll(
              employee,
              employeeAdditions,
              employeeDeductions
            );

            // Insert payroll item
            const { data: payrollItem, error: itemError } = await supabase
              .from('payroll_items')
              .insert({
                payroll_record_id: payrollRecord.id,
                employee_id: employee.id,
                basic_salary: employee.basicSalary,
                gross_salary: calculation.grossSalary,
                net_salary: calculation.netSalary,
                cpf_employee: calculation.cpf.employee,
                cpf_employer: calculation.cpf.employer,
              })
              .select()
              .single();

            if (itemError) throw itemError;

            // Insert additions and deductions in parallel
            await Promise.all([
              this.insertAdditions(payrollItem.id, employeeAdditions),
              this.insertDeductions(payrollItem.id, employeeDeductions)
            ]);

            // Update totals
            totalGross += calculation.grossSalary;
            totalNet += calculation.netSalary;
            totalCpfEmployee += calculation.cpf.employee;
            totalCpfEmployer += calculation.cpf.employer;
          })
        );
      }

      // Update payroll record with totals
      const { error: updateError } = await supabase
        .from('payroll_records')
        .update({
          status: 'completed',
          total_gross: totalGross,
          total_net: totalNet,
          total_cpf_employee: totalCpfEmployee,
          total_cpf_employer: totalCpfEmployer,
          processed_at: new Date().toISOString(),
        })
        .eq('id', payrollRecord.id);

      if (updateError) throw updateError;

      return payrollRecord.id;
    } catch (error) {
      console.error('Payroll processing error:', error);
      throw error;
    }
  }

  private async insertAdditions(payrollItemId: string, additions: PayrollAddition[]) {
    if (additions.length === 0) return;

    const { error } = await supabase
      .from('payroll_additions')
      .insert(
        additions.map(addition => ({
          payroll_item_id: payrollItemId,
          type: addition.type,
          amount: addition.amount,
          description: addition.description,
        }))
      );

    if (error) throw error;
  }

  private async insertDeductions(payrollItemId: string, deductions: PayrollDeduction[]) {
    if (deductions.length === 0) return;

    const { error } = await supabase
      .from('payroll_deductions')
      .insert(
        deductions.map(deduction => ({
          payroll_item_id: payrollItemId,
          type: deduction.type,
          amount: deduction.amount,
          description: deduction.description,
        }))
      );

    if (error) throw error;
  }
}