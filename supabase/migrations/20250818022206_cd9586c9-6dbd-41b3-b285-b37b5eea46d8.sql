-- Create audit_logs table to support auditService and avoid TS type errors
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Insert policy: users can create their own audit logs (by profile linkage)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'Users can create their own audit logs'
  ) THEN
    CREATE POLICY "Users can create their own audit logs"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (
      user_id = (
        SELECT profiles.id FROM public.profiles WHERE profiles.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Optional: HR can view all audit logs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'HR can view all audit logs'
  ) THEN
    CREATE POLICY "HR can view all audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (get_current_user_role() = 'hr'::app_role);
  END IF;
END $$;

-- Add missing foreign keys to enable typed relations used in selects
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'one_on_ones_employee_id_fkey'
  ) THEN
    ALTER TABLE public.one_on_ones
    ADD CONSTRAINT one_on_ones_employee_id_fkey
    FOREIGN KEY (employee_id)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'one_on_ones_manager_id_fkey'
  ) THEN
    ALTER TABLE public.one_on_ones
    ADD CONSTRAINT one_on_ones_manager_id_fkey
    FOREIGN KEY (manager_id)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'recognition_from_user_fkey'
  ) THEN
    ALTER TABLE public.recognition
    ADD CONSTRAINT recognition_from_user_fkey
    FOREIGN KEY (from_user)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'recognition_to_user_fkey'
  ) THEN
    ALTER TABLE public.recognition
    ADD CONSTRAINT recognition_to_user_fkey
    FOREIGN KEY (to_user)
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT;
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_created_at ON public.audit_logs(user_id, created_at DESC);
