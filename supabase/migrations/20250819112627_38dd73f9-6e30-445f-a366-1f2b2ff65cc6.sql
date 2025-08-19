-- Refresh constraints and ensure proper foreign key naming for TypeScript
-- This ensures TypeScript recognizes the relationships properly

-- First, let's clean up any duplicate foreign keys and ensure consistent naming
DO $$ 
DECLARE 
    constraint_name TEXT;
BEGIN
    -- Clean up duplicate constraints for one_on_ones
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.one_on_ones'::regclass 
        AND contype = 'f'
        AND conname LIKE '%fkey%' 
    LOOP
        EXECUTE 'ALTER TABLE public.one_on_ones DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
    
    -- Clean up duplicate constraints for recognition  
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.recognition'::regclass 
        AND contype = 'f'
        AND conname LIKE '%fkey%'
    LOOP
        EXECUTE 'ALTER TABLE public.recognition DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
END $$;

-- Re-add foreign keys with consistent naming
ALTER TABLE public.one_on_ones 
ADD CONSTRAINT one_on_ones_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.one_on_ones 
ADD CONSTRAINT one_on_ones_manager_id_fkey 
FOREIGN KEY (manager_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.recognition 
ADD CONSTRAINT recognition_from_user_fkey 
FOREIGN KEY (from_user) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.recognition 
ADD CONSTRAINT recognition_to_user_fkey 
FOREIGN KEY (to_user) REFERENCES public.profiles(id) ON DELETE RESTRICT;

-- Ensure audit_logs table exists with proper structure
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
        CREATE TABLE public.audit_logs (
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
    END IF;
END $$;