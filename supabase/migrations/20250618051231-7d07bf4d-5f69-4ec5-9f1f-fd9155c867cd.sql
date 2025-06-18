
-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  manager_id UUID REFERENCES public.employees(id),
  performance INTEGER DEFAULT 0,
  hire_date DATE DEFAULT CURRENT_DATE,
  salary DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  submitted_date DATE DEFAULT CURRENT_DATE,
  approved_by UUID REFERENCES public.employees(id),
  approved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments (accessible to authenticated users)
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update departments" ON public.departments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete departments" ON public.departments FOR DELETE TO authenticated USING (true);

-- Create RLS policies for employees (accessible to authenticated users)
CREATE POLICY "Anyone can view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update employees" ON public.employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete employees" ON public.employees FOR DELETE TO authenticated USING (true);

-- Create RLS policies for leave_requests (accessible to authenticated users)
CREATE POLICY "Anyone can view leave requests" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert leave requests" ON public.leave_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update leave requests" ON public.leave_requests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete leave requests" ON public.leave_requests FOR DELETE TO authenticated USING (true);

-- Insert some sample departments
INSERT INTO public.departments (name, description) VALUES 
('Engineering', 'Software development and technical operations'),
('Product', 'Product strategy and management'),
('Marketing', 'Brand and digital marketing'),
('Sales', 'Revenue generation and client relations');
