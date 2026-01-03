-- Seed data for TradeOS
-- This file populates the database with sample data for development/testing

-- Insert sample admin user (assumes auth.users entry exists)
-- Note: In production, users are created through Supabase Auth
-- This is a placeholder - actual user creation should be done through the auth system

INSERT INTO public.users (id, email, role, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@tradeos.app', 'admin', 'Admin User')
ON CONFLICT (id) DO NOTHING;

-- Sample projects
INSERT INTO public.projects (id, title, description, owner_id, status) VALUES
  ('10000000-0000-0000-0000-000000000001', 'TradeOS Platform', 'Main platform development', '00000000-0000-0000-0000-000000000001', 'active'),
  ('10000000-0000-0000-0000-000000000002', 'Mobile App', 'React Native mobile application', '00000000-0000-0000-0000-000000000001', 'active'),
  ('10000000-0000-0000-0000-000000000003', 'Documentation', 'User and developer documentation', '00000000-0000-0000-0000-000000000001', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample tasks
INSERT INTO public.tasks (project_id, title, description, status, priority) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Setup Supabase', 'Configure Supabase project and migrations', 'done', 'high'),
  ('10000000-0000-0000-0000-000000000001', 'Implement Auth', 'Add email and OAuth authentication', 'in_progress', 'high'),
  ('10000000-0000-0000-0000-000000000001', 'Setup RLS Policies', 'Configure row-level security', 'done', 'high'),
  ('10000000-0000-0000-0000-000000000002', 'Create UI Components', 'Build reusable React Native components', 'todo', 'medium'),
  ('10000000-0000-0000-0000-000000000002', 'Integrate Realtime', 'Connect to Supabase Realtime', 'todo', 'medium'),
  ('10000000-0000-0000-0000-000000000003', 'API Documentation', 'Document all API endpoints', 'todo', 'low')
ON CONFLICT DO NOTHING;

-- Sample messages
INSERT INTO public.messages (user_id, content) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Welcome to TradeOS! 🚀'),
  ('00000000-0000-0000-0000-000000000001', 'This is a sample message in the chat system.')
ON CONFLICT DO NOTHING;

-- Note: This seed data is for development only
-- In production, data should be created through the application
