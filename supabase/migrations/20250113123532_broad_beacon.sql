/*
  # Create employees table and related schemas

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `date_of_birth` (date)
      - `nationality` (text)
      - `is_pr` (boolean)
      - `basic_salary` (numeric)
      - `allowances` (numeric)
      - `start_date` (date)
      - `department` (text)
      - `position` (text)
      - `employee_id` (text, unique)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `employees` table
    - Add policies for authenticated users to:
      - Read all employees
      - Insert new employees
      - Update existing employees
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  date_of_birth date NOT NULL,
  nationality text NOT NULL,
  is_pr boolean DEFAULT false,
  basic_salary numeric(10,2) NOT NULL,
  allowances numeric(10,2) DEFAULT 0,
  start_date date NOT NULL,
  department text NOT NULL,
  position text NOT NULL,
  employee_id text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
  ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employees"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();