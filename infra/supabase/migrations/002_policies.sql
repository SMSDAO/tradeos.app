-- Row Level Security (RLS) Policies
-- Enables secure access control at the database level

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- PROJECTS TABLE POLICIES
-- ============================================================================

-- Users can view projects they own or are members of
CREATE POLICY "Users can view their projects"
  ON public.projects
  FOR SELECT
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

-- Users can create their own projects
CREATE POLICY "Users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Project owners can update their projects
CREATE POLICY "Owners can update their projects"
  ON public.projects
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Project owners can delete their projects
CREATE POLICY "Owners can delete their projects"
  ON public.projects
  FOR DELETE
  USING (owner_id = auth.uid());

-- Admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- TASKS TABLE POLICIES
-- ============================================================================

-- Users can view tasks in their projects
CREATE POLICY "Users can view tasks in their projects"
  ON public.tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
        AND (
          p.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
          )
        )
    )
  );

-- Users can create tasks in their projects
CREATE POLICY "Users can create tasks in their projects"
  ON public.tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
        AND (
          p.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
          )
        )
    )
  );

-- Users can update tasks in their projects
CREATE POLICY "Users can update tasks in their projects"
  ON public.tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
        AND (
          p.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
          )
        )
    )
  );

-- ============================================================================
-- MESSAGES TABLE POLICIES
-- ============================================================================

-- Authenticated users can view all messages (can be restricted based on requirements)
CREATE POLICY "Authenticated users can view messages"
  ON public.messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Users can create their own messages
CREATE POLICY "Users can create messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
  ON public.messages
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON public.messages
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- PROJECT_MEMBERS TABLE POLICIES
-- ============================================================================

-- Users can view members of projects they belong to
CREATE POLICY "Users can view project members"
  ON public.project_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_members.project_id AND p.owner_id = auth.uid()
    )
  );

-- Project owners can add members
CREATE POLICY "Owners can add members"
  ON public.project_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_members.project_id AND p.owner_id = auth.uid()
    )
  );

-- Project owners can remove members
CREATE POLICY "Owners can remove members"
  ON public.project_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_members.project_id AND p.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- Security Best Practices:
-- 1. Always test RLS policies thoroughly before production
-- 2. Consider rate limiting on edge functions to prevent abuse
-- 3. Implement input validation on both client and server
-- 4. Never expose SUPABASE_SERVICE_ROLE_KEY in client code
-- 5. Review and audit policies regularly
-- 6. Use prepared statements to prevent SQL injection
-- 7. Consider implementing additional policies for specific use cases
-- 
-- Suggested Enhancements:
-- 1. Add organization/workspace-level policies
-- 2. Implement role-based access within projects
-- 3. Add audit logging for sensitive operations
-- 4. Consider implementing soft deletes
-- 5. Add rate limiting for message creation
--
