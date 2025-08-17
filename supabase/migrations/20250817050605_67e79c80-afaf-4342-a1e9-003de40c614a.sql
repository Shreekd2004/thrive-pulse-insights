-- Fix critical security issue: Segregate salary data from employee personal information
-- Create dedicated salaries table with strict HR-only access

-- Create salaries table
CREATE TABLE public.salaries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL,
  salary numeric,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id),
  UNIQUE(employee_id, effective_date)
);

-- Enable RLS on salaries table
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;

-- Create HR-only policies for salaries table
CREATE POLICY "Only HR can view salaries" 
ON public.salaries 
FOR SELECT 
USING (get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Only HR can insert salaries" 
ON public.salaries 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Only HR can update salaries" 
ON public.salaries 
FOR UPDATE 
USING (get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Only HR can delete salaries" 
ON public.salaries 
FOR DELETE 
USING (get_current_user_role() = 'hr'::app_role);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_salaries_updated_at
BEFORE UPDATE ON public.salaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing salary data to new table
INSERT INTO public.salaries (employee_id, salary, created_at, updated_at)
SELECT id, salary, created_at, updated_at 
FROM public.employees 
WHERE salary IS NOT NULL;

-- Remove salary column from employees table to complete segregation
ALTER TABLE public.employees DROP COLUMN IF EXISTS salary;