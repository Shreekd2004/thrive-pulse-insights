-- Create update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'performance',
  employee_id UUID NOT NULL,
  evaluator_id UUID NOT NULL,
  score INTEGER,
  feedback TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "HR can create assessments" 
ON public.assessments 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'hr'::app_role);

CREATE POLICY "HR and managers can view assessments" 
ON public.assessments 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role]) 
       OR employee_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "HR and evaluators can update assessments" 
ON public.assessments 
FOR UPDATE 
USING (get_current_user_role() = 'hr'::app_role 
       OR evaluator_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "HR can delete assessments" 
ON public.assessments 
FOR DELETE 
USING (get_current_user_role() = 'hr'::app_role);

-- Create trigger for timestamps
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();