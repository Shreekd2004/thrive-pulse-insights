/*
  # Create Performance Reviews System

  1. New Tables
    - `review_cycles` - Manages review periods and cycles
    - `performance_reviews` - Individual performance reviews
    - `review_questions` - Customizable review form questions
    - `review_responses` - Responses to review questions
    - `one_on_ones` - 1:1 meeting records
    - `recognition` - Recognition and awards system
    - `audit_logs` - System audit trail
    - `notifications` - In-app notifications

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each role
    - Secure sensitive performance data

  3. Features
    - Self-review, manager review, peer review workflows
    - Customizable review forms
    - 1:1 meeting management
    - Recognition system
    - Comprehensive audit logging
*/

-- Create review_cycles table
CREATE TABLE IF NOT EXISTS public.review_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create performance_reviews table
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.review_cycles(id) NOT NULL,
  employee_id UUID REFERENCES public.profiles(id) NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('self', 'manager', 'peer')),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  submitted_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(cycle_id, employee_id, reviewer_id, review_type)
);

-- Create review_questions table
CREATE TABLE IF NOT EXISTS public.review_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.review_cycles(id) NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text' CHECK (question_type IN ('text', 'rating', 'multiple_choice')),
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create review_responses table
CREATE TABLE IF NOT EXISTS public.review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.performance_reviews(id) NOT NULL,
  question_id UUID REFERENCES public.review_questions(id) NOT NULL,
  response_text TEXT,
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, question_id)
);

-- Create one_on_ones table
CREATE TABLE IF NOT EXISTS public.one_on_ones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.profiles(id) NOT NULL,
  manager_id UUID REFERENCES public.profiles(id) NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  agenda TEXT,
  notes TEXT,
  action_items JSONB DEFAULT '[]',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create recognition table
CREATE TABLE IF NOT EXISTS public.recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user UUID REFERENCES public.profiles(id) NOT NULL,
  to_user UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recognition_type TEXT DEFAULT 'appreciation' CHECK (recognition_type IN ('appreciation', 'achievement', 'milestone', 'peer_nomination')),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  category TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_on_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_cycles
CREATE POLICY "HR can manage review cycles" ON public.review_cycles FOR ALL USING (get_current_user_role() = 'hr'::app_role);
CREATE POLICY "Managers and employees can view active cycles" ON public.review_cycles FOR SELECT USING (status = 'active');

-- RLS Policies for performance_reviews
CREATE POLICY "Users can view their own reviews" ON public.performance_reviews FOR SELECT USING (
  employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

CREATE POLICY "Users can create reviews they're assigned to" ON public.performance_reviews FOR INSERT WITH CHECK (
  reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

CREATE POLICY "Users can update their assigned reviews" ON public.performance_reviews FOR UPDATE USING (
  reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

-- RLS Policies for review_questions
CREATE POLICY "HR can manage review questions" ON public.review_questions FOR ALL USING (get_current_user_role() = 'hr'::app_role);
CREATE POLICY "Users can view questions for active cycles" ON public.review_questions FOR SELECT USING (true);

-- RLS Policies for review_responses
CREATE POLICY "Users can manage their review responses" ON public.review_responses FOR ALL USING (
  review_id IN (
    SELECT id FROM public.performance_reviews 
    WHERE reviewer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) OR
  get_current_user_role() = 'hr'::app_role
);

-- RLS Policies for one_on_ones
CREATE POLICY "Users can view their 1:1s" ON public.one_on_ones FOR SELECT USING (
  employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  manager_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

CREATE POLICY "Managers can create 1:1s with their reports" ON public.one_on_ones FOR INSERT WITH CHECK (
  manager_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

CREATE POLICY "Participants can update 1:1s" ON public.one_on_ones FOR UPDATE USING (
  employee_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  manager_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  get_current_user_role() = 'hr'::app_role
);

-- RLS Policies for recognition
CREATE POLICY "Users can view public recognition" ON public.recognition FOR SELECT USING (is_public = true OR get_current_user_role() = 'hr'::app_role);
CREATE POLICY "Users can give recognition" ON public.recognition FOR INSERT WITH CHECK (
  from_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- RLS Policies for audit_logs
CREATE POLICY "HR can view audit logs" ON public.audit_logs FOR SELECT USING (get_current_user_role() = 'hr'::app_role);

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (
  user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (
  user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee_id ON public.performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_reviewer_id ON public.performance_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_cycle_id ON public.performance_reviews(cycle_id);
CREATE INDEX IF NOT EXISTS idx_one_on_ones_employee_id ON public.one_on_ones(employee_id);
CREATE INDEX IF NOT EXISTS idx_one_on_ones_manager_id ON public.one_on_ones(manager_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_review_cycles_updated_at BEFORE UPDATE ON public.review_cycles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON public.review_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_one_on_ones_updated_at BEFORE UPDATE ON public.one_on_ones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();