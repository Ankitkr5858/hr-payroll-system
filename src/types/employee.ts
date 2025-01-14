export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  nationality: string;
  isPR: boolean;
  basicSalary: number;
  allowances: number;
  startDate: string;
  department: string;
  position: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'invite_sent' | 'payroll_only';
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeUploadData extends Omit<Employee, 'id' | 'created_at' | 'updated_at'> {
  row?: number;
  validationErrors?: string[];
}