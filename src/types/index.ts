
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  assignedTo?: string;
  team_id?: string;
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'task-assigned' | 'task-updated' | 'task-completed';
  taskId?: string;
}

export type TeamRole = 'admin' | 'member';

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  joinCode: string;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: string;
}
