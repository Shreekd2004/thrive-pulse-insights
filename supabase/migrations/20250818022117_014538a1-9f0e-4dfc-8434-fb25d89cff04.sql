-- Add foreign key relationships for proper joins
ALTER TABLE public.one_on_ones 
ADD CONSTRAINT fk_one_on_ones_manager 
FOREIGN KEY (manager_id) REFERENCES public.profiles(id);

ALTER TABLE public.one_on_ones 
ADD CONSTRAINT fk_one_on_ones_employee 
FOREIGN KEY (employee_id) REFERENCES public.profiles(id);

ALTER TABLE public.recognition 
ADD CONSTRAINT fk_recognition_from_user 
FOREIGN KEY (from_user) REFERENCES public.profiles(id);

ALTER TABLE public.recognition 
ADD CONSTRAINT fk_recognition_to_user 
FOREIGN KEY (to_user) REFERENCES public.profiles(id);

ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_user 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);