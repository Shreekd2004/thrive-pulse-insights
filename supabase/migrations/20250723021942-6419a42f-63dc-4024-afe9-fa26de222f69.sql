-- Create goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_by UUID REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user UUID REFERENCES public.profiles(id) NOT NULL,
    to_user UUID REFERENCES public.profiles(id) NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category TEXT DEFAULT 'general',
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals
CREATE POLICY "HR can create goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() = 'hr');
CREATE POLICY "HR and managers can update goals" ON public.goals FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('hr', 'manager'));
CREATE POLICY "Users can view their assigned goals" ON public.goals FOR SELECT TO authenticated USING (assigned_to = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_current_user_role() IN ('hr', 'manager'));
CREATE POLICY "HR can delete goals" ON public.goals FOR DELETE TO authenticated USING (public.get_current_user_role() = 'hr');

-- RLS Policies for feedback
CREATE POLICY "HR and managers can give feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('hr', 'manager'));
CREATE POLICY "Users can view feedback they sent or received" ON public.feedback FOR SELECT TO authenticated USING (
    from_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
    to_user = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
    public.get_current_user_role() = 'hr'
);
CREATE POLICY "HR can update all feedback" ON public.feedback FOR UPDATE TO authenticated USING (public.get_current_user_role() = 'hr');
CREATE POLICY "HR can delete feedback" ON public.feedback FOR DELETE TO authenticated USING (public.get_current_user_role() = 'hr');

-- Remove fake data from employees table
DELETE FROM public.employees;