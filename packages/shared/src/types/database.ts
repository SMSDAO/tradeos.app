// Database types
export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  owner_id: string
  status: 'active' | 'archived' | 'completed'
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string
  assignee_id: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  content: string
  file_url: string | null
  created_at: string
}
