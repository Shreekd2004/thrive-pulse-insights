-- Update RLS policy for employees table to allow all authenticated users to view employee names
-- This ensures the dropdown shows employees when adding leave requests

DROP POLICY IF EXISTS "HR and managers can view all employees OR employees can view ow" ON public.employees;

-- Create new policy that allows all authenticated users to view employees
-- This is needed for the employee dropdown in leave request forms
CREATE POLICY "All authenticated users can view employees"
ON public.employees
FOR SELECT
TO authenticated
USING (true);