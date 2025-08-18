-- Create missing performance_reviews table
CREATE TABLE public.performance_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  review_cycle_id uuid,
  review_type text DEFAULT 'annual'::text,
  status text DEFAULT 'pending'::text,
  due_date date,
  submitted_date date,
  overall_rating integer,
  comments text,
  self_rating integer,
  manager_rating integer,
  goals_met boolean DEFAULT false,
  areas_of_improvement text,
  achievements text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reviews" 
ON public.performance_reviews FOR SELECT 
USING (employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       get_current_user_role() = 'hr'::app_role);

CREATE POLICY "HR and managers can create reviews" 
ON public.performance_reviews FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['hr'::app_role, 'manager'::app_role]));

CREATE POLICY "HR and reviewers can update reviews" 
ON public.performance_reviews FOR UPDATE 
USING (reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
       get_current_user_role() = 'hr'::app_role);

CREATE POLICY "HR can delete reviews" 
ON public.performance_reviews FOR DELETE 
USING (get_current_user_role() = 'hr'::app_role);

-- Add trigger
CREATE TRIGGER update_performance_reviews_updated_at
BEFORE UPDATE ON public.performance_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();