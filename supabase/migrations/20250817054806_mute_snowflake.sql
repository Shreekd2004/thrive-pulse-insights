/*
  # Seed Sample Company Data

  1. Sample Data
    - 1 HR admin
    - 3 Managers across different departments
    - 10 Employees distributed across teams
    - Sample goals and review cycles
    - Recognition and feedback examples

  2. Relationships
    - Proper manager-employee hierarchies
    - Department assignments
    - Goal assignments and progress
*/

-- Insert sample profiles (these will be created when users sign up)
-- We'll create the employee records that reference these profiles

-- Insert sample employees with realistic data
INSERT INTO public.employees (name, email, role, department_id, manager_id, performance, hire_date, status) VALUES
-- HR Admin
('Alice Johnson', 'alice.johnson@thrivepulse.com', 'hr', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), NULL, 95, '2022-01-15', 'active'),

-- Managers
('Sarah Wilson', 'sarah.wilson@thrivepulse.com', 'manager', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), NULL, 92, '2022-03-01', 'active'),
('Michael Brown', 'michael.brown@thrivepulse.com', 'manager', (SELECT id FROM public.departments WHERE name = 'Product' LIMIT 1), NULL, 88, '2022-02-15', 'active'),
('Jennifer Lee', 'jennifer.lee@thrivepulse.com', 'manager', (SELECT id FROM public.departments WHERE name = 'Marketing' LIMIT 1), NULL, 90, '2022-04-01', 'active'),

-- Engineering Team (under Sarah Wilson)
('David Miller', 'david.miller@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'sarah.wilson@thrivepulse.com'), 85, '2023-01-10', 'active'),
('Emma Davis', 'emma.davis@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'sarah.wilson@thrivepulse.com'), 78, '2023-03-15', 'active'),
('John Smith', 'john.smith@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'sarah.wilson@thrivepulse.com'), 82, '2023-02-01', 'active'),

-- Product Team (under Michael Brown)
('Lisa Johnson', 'lisa.johnson@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Product' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'michael.brown@thrivepulse.com'), 88, '2023-05-01', 'active'),
('Robert Chen', 'robert.chen@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Product' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'michael.brown@thrivepulse.com'), 91, '2023-04-15', 'active'),
('Maria Garcia', 'maria.garcia@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Product' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'michael.brown@thrivepulse.com'), 86, '2023-06-01', 'active'),

-- Marketing Team (under Jennifer Lee)
('Kevin Wong', 'kevin.wong@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Marketing' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'jennifer.lee@thrivepulse.com'), 83, '2023-07-01', 'active'),
('Amanda Taylor', 'amanda.taylor@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Marketing' LIMIT 1), (SELECT id FROM public.employees WHERE email = 'jennifer.lee@thrivepulse.com'), 89, '2023-08-15', 'active'),

-- Sales Team
('James Rodriguez', 'james.rodriguez@thrivepulse.com', 'employee', (SELECT id FROM public.departments WHERE name = 'Sales' LIMIT 1), NULL, 87, '2023-09-01', 'active');

-- Create a sample review cycle
INSERT INTO public.review_cycles (name, description, start_date, end_date, status) VALUES
('Q4 2024 Performance Review', 'Quarterly performance review cycle for Q4 2024', '2024-10-01', '2024-12-31', 'active');

-- Insert sample review questions
INSERT INTO public.review_questions (cycle_id, question_text, question_type, is_required, order_index) VALUES
((SELECT id FROM public.review_cycles WHERE name = 'Q4 2024 Performance Review'), 'How would you rate your overall performance this quarter?', 'rating', true, 1),
((SELECT id FROM public.review_cycles WHERE name = 'Q4 2024 Performance Review'), 'What were your key accomplishments this quarter?', 'text', true, 2),
((SELECT id FROM public.review_cycles WHERE name = 'Q4 2024 Performance Review'), 'What challenges did you face and how did you overcome them?', 'text', true, 3),
((SELECT id FROM public.review_cycles WHERE name = 'Q4 2024 Performance Review'), 'What are your goals for next quarter?', 'text', true, 4),
((SELECT id FROM public.review_cycles WHERE name = 'Q4 2024 Performance Review'), 'How would you rate your collaboration with team members?', 'rating', true, 5);

-- Insert sample salary data
INSERT INTO public.salaries (employee_id, salary, effective_date) VALUES
((SELECT id FROM public.employees WHERE email = 'alice.johnson@thrivepulse.com'), 120000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'sarah.wilson@thrivepulse.com'), 110000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'michael.brown@thrivepulse.com'), 105000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'jennifer.lee@thrivepulse.com'), 108000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'david.miller@thrivepulse.com'), 85000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'emma.davis@thrivepulse.com'), 82000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'john.smith@thrivepulse.com'), 80000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'lisa.johnson@thrivepulse.com'), 90000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'robert.chen@thrivepulse.com'), 88000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'maria.garcia@thrivepulse.com'), 87000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'kevin.wong@thrivepulse.com'), 75000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'amanda.taylor@thrivepulse.com'), 78000, '2024-01-01'),
((SELECT id FROM public.employees WHERE email = 'james.rodriguez@thrivepulse.com'), 85000, '2024-01-01');