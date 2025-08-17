-- Fix critical security issue: Secure leave_requests table with proper RLS policies
-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can delete leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Anyone can insert leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Anyone can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Anyone can view leave requests" ON public.leave_requests;

-- Create secure SELECT policy: Only view own requests, managed requests, or if HR
CREATE POLICY "Employees can view own requests, managers can view team requests, HR can view all" 
ON public.leave_requests 
FOR SELECT 
USING (
  -- HR can view all leave requests
  get_current_user_role() = 'hr'::app_role
  OR 
  -- Employees can view their own leave requests (match by employee_id)
  employee_id = (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
  OR
  -- Managers can view leave requests from their direct reports
  (
    get_current_user_role() = 'manager'::app_role
    AND employee_id IN (
      SELECT e.profile_id 
      FROM public.employees e 
      WHERE e.manager_id = (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  )
);

-- Create secure INSERT policy: Employees can only create requests for themselves
CREATE POLICY "Employees can create own requests, HR can create any" 
ON public.leave_requests 
FOR INSERT 
WITH CHECK (
  -- HR can create leave requests for anyone
  get_current_user_role() = 'hr'::app_role
  OR 
  -- Employees can only create requests for themselves
  employee_id = (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create secure UPDATE policy: Limited to own requests, managed requests, or HR
CREATE POLICY "Limited update access to leave requests" 
ON public.leave_requests 
FOR UPDATE 
USING (
  -- HR can update all leave requests
  get_current_user_role() = 'hr'::app_role
  OR 
  -- Employees can update their own pending requests
  (
    employee_id = (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND status = 'pending'
  )
  OR
  -- Managers can update leave requests from their direct reports (for approval)
  (
    get_current_user_role() = 'manager'::app_role
    AND employee_id IN (
      SELECT e.profile_id 
      FROM public.employees e 
      WHERE e.manager_id = (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  )
);

-- Create secure DELETE policy: Only HR can delete leave requests
CREATE POLICY "Only HR can delete leave requests" 
ON public.leave_requests 
FOR DELETE 
USING (
  get_current_user_role() = 'hr'::app_role
);