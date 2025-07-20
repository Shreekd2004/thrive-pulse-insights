-- Add foreign key constraints to establish proper relationships

-- Add foreign key from employees.department_id to departments.id
ALTER TABLE public.employees 
ADD CONSTRAINT employees_department_id_fkey 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Add foreign key from employees.manager_id to employees.id (self-referencing)
ALTER TABLE public.employees 
ADD CONSTRAINT employees_manager_id_fkey 
FOREIGN KEY (manager_id) REFERENCES public.employees(id);

-- Add foreign key from leave_requests.employee_id to employees.id
ALTER TABLE public.leave_requests 
ADD CONSTRAINT leave_requests_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES public.employees(id);

-- Add foreign key from leave_requests.approved_by to employees.id
ALTER TABLE public.leave_requests 
ADD CONSTRAINT leave_requests_approved_by_fkey 
FOREIGN KEY (approved_by) REFERENCES public.employees(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON public.employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_approved_by ON public.leave_requests(approved_by);