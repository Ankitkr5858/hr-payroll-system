/*
  # Create payroll tables

  1. New Tables
    - `payroll_records`
      - Main payroll record for each pay period
      - Stores summary information
    - `payroll_items`
      - Individual payroll items for each employee
      - Stores detailed breakdown
    - `payroll_additions`
      - Additional payments like bonuses and allowances
    - `payroll_deductions`
      - Deductions like loans or insurance

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Payroll Records table
CREATE TABLE IF NOT EXISTS payroll_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  total_gross numeric(15,2) NOT NULL DEFAULT 0,
  total_net numeric(15,2) NOT NULL DEFAULT 0,
  total_cpf_employee numeric(15,2) NOT NULL DEFAULT 0,
  total_cpf_employer numeric(15,2) NOT NULL DEFAULT 0,
  processed_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payroll Items table
CREATE TABLE IF NOT EXISTS payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_record_id uuid REFERENCES payroll_records(id),
  employee_id uuid REFERENCES employees(id),
  basic_salary numeric(15,2) NOT NULL,
  gross_salary numeric(15,2) NOT NULL,
  net_salary numeric(15,2) NOT NULL,
  cpf_employee numeric(15,2) NOT NULL,
  cpf_employer numeric(15,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payroll Additions table
CREATE TABLE IF NOT EXISTS payroll_additions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id uuid REFERENCES payroll_items(id),
  type text NOT NULL,
  amount numeric(15,2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Payroll Deductions table
CREATE TABLE IF NOT EXISTS payroll_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id uuid REFERENCES payroll_items(id),
  type text NOT NULL,
  amount numeric(15,2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_additions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_deductions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read payroll records"
  ON payroll_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert payroll records"
  ON payroll_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payroll records"
  ON payroll_records
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Repeat similar policies for other tables
CREATE POLICY "Allow authenticated users to read payroll items"
  ON payroll_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert payroll items"
  ON payroll_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payroll items"
  ON payroll_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_payroll_records_updated_at
  BEFORE UPDATE ON payroll_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_items_updated_at
  BEFORE UPDATE ON payroll_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();