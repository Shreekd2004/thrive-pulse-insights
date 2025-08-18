-- Create missing tables to fix build errors

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info'::text,
  category text DEFAULT 'general'::text,
  action_url text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create review_cycles table
CREATE TABLE public.review_cycles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'draft'::text,
  review_type text DEFAULT 'annual'::text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create recognition table
CREATE TABLE public.recognition (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  recognition_type text DEFAULT 'appreciation'::text,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create one_on_ones table
CREATE TABLE public.one_on_ones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  scheduled_date timestamp with time zone NOT NULL,
  agenda text,
  notes text,
  status text DEFAULT 'scheduled'::text,
  duration_minutes integer DEFAULT 30,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_on_ones ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "HR and managers can create notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Review cycles policies
CREATE POLICY "HR can manage review cycles" 
ON public.review_cycles FOR ALL 
USING (get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Managers and employees can view review cycles" 
ON public.review_cycles FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role, 'employee'::app_role]));

-- Recognition policies
CREATE POLICY "Users can view recognition they sent or received" 
ON public.recognition FOR SELECT 
USING (from_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       to_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Users can give recognition" 
ON public.recognition FOR INSERT 
WITH CHECK (from_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "HR can delete recognition" 
ON public.recognition FOR DELETE 
USING (get_current_user_role() = 'hr'::app_role);

-- One-on-ones policies
CREATE POLICY "Managers and employees can view their 1:1s" 
ON public.one_on_ones FOR SELECT 
USING (manager_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       get_current_user_role() = 'hr'::app_role);

CREATE POLICY "Managers can create 1:1s" 
ON public.one_on_ones FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role]));

CREATE POLICY "Managers and employees can update their 1:1s" 
ON public.one_on_ones FOR UPDATE 
USING (manager_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       get_current_user_role() = 'hr'::app_role);

CREATE POLICY "HR and managers can delete 1:1s" 
ON public.one_on_ones FOR DELETE 
USING (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role]));

-- Add update triggers
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_cycles_updated_at
BEFORE UPDATE ON public.review_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recognition_updated_at
BEFORE UPDATE ON public.recognition
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_one_on_ones_updated_at
BEFORE UPDATE ON public.one_on_ones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();