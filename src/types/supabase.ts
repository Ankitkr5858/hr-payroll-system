export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          date_of_birth: string
          nationality: string
          is_pr: boolean
          basic_salary: number
          allowances: number
          start_date: string
          department: string
          position: string
          employee_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          date_of_birth: string
          nationality: string
          is_pr?: boolean
          basic_salary: number
          allowances?: number
          start_date: string
          department: string
          position: string
          employee_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          date_of_birth?: string
          nationality?: string
          is_pr?: boolean
          basic_salary?: number
          allowances?: number
          start_date?: string
          department?: string
          position?: string
          employee_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      payroll_records: {
        Row: {
          id: string
          period_start: string
          period_end: string
          status: string
          total_gross: number
          total_net: number
          total_cpf_employee: number
          total_cpf_employer: number
          processed_by: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          period_start: string
          period_end: string
          status?: string
          total_gross?: number
          total_net?: number
          total_cpf_employee?: number
          total_cpf_employer?: number
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          period_start?: string
          period_end?: string
          status?: string
          total_gross?: number
          total_net?: number
          total_cpf_employee?: number
          total_cpf_employer?: number
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payroll_items: {
        Row: {
          id: string
          payroll_record_id: string
          employee_id: string
          basic_salary: number
          gross_salary: number
          net_salary: number
          cpf_employee: number
          cpf_employer: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payroll_record_id: string
          employee_id: string
          basic_salary: number
          gross_salary: number
          net_salary: number
          cpf_employee: number
          cpf_employer: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payroll_record_id?: string
          employee_id?: string
          basic_salary?: number
          gross_salary?: number
          net_salary?: number
          cpf_employee?: number
          cpf_employer?: number
          created_at?: string
          updated_at?: string
        }
      }
      payroll_additions: {
        Row: {
          id: string
          payroll_item_id: string
          type: string
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          payroll_item_id: string
          type: string
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          payroll_item_id?: string
          type?: string
          amount?: number
          description?: string | null
          created_at?: string
        }
      }
      payroll_deductions: {
        Row: {
          id: string
          payroll_item_id: string
          type: string
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          payroll_item_id: string
          type: string
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          payroll_item_id?: string
          type?: string
          amount?: number
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}