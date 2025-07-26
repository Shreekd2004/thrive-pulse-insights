-- Add foreign key constraint for manager_id in employees table
ALTER TABLE public.employees 
ADD CONSTRAINT employees_manager_id_fkey 
FOREIGN KEY (manager_id) 
REFERENCES public.employees(id) 
ON DELETE SET NULL;