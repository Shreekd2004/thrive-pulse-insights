-- Update trigger function to handle role casting more safely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role app_role := 'employee';
BEGIN
  -- Safely extract and cast the role
  IF NEW.raw_user_meta_data ? 'role' THEN
    user_role := (NEW.raw_user_meta_data->>'role')::app_role;
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and use default values
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      split_part(NEW.email, '@', 1),
      'employee'
    );
    RETURN NEW;
END;
$$;