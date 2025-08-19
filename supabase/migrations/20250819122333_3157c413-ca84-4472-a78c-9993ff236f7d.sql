-- Create employee records for profiles that don't have them
INSERT INTO public.employees (profile_id, name, email, role, status)
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role::text,
  'active'
FROM public.profiles p
LEFT JOIN public.employees e ON e.profile_id = p.id
WHERE e.id IS NULL;