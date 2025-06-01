
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type MessageType = 'TEXT' | 'TASK' | 'SYSTEM';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
  added_by?: string;
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  task_id?: string;
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface GroupTask {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
