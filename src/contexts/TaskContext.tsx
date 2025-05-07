
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByUser: (userId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getOverdueTasks: () => Task[];
}

// Sample tasks for demo
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard interface",
    createdAt: "2023-04-01T10:00:00Z",
    updatedAt: "2023-04-01T10:00:00Z",
    dueDate: "2023-04-10T23:59:59Z",
    priority: "high",
    status: "in-progress",
    createdBy: "1", // John Doe
    assignedTo: "2" // Jane Doe
  },
  {
    id: "2",
    title: "Implement authentication system",
    description: "Add login, register and password reset functionality",
    createdAt: "2023-04-02T09:30:00Z",
    updatedAt: "2023-04-02T09:30:00Z",
    dueDate: "2023-04-09T23:59:59Z",
    priority: "high",
    status: "todo",
    createdBy: "1", // John Doe
    assignedTo: "3" // Mike Brown
  },
  {
    id: "3",
    title: "Fix navigation responsive issues",
    description: "Ensure the navigation menu works correctly on mobile devices",
    createdAt: "2023-04-03T14:15:00Z",
    updatedAt: "2023-04-03T14:15:00Z",
    dueDate: "2023-04-05T23:59:59Z",
    priority: "medium",
    status: "review",
    createdBy: "2", // Jane Doe
    assignedTo: "1" // John Doe
  },
  {
    id: "4",
    title: "Update API documentation",
    description: "Document all new endpoints and update existing documentation",
    createdAt: "2023-04-04T11:45:00Z",
    updatedAt: "2023-04-04T11:45:00Z",
    dueDate: "2023-04-14T23:59:59Z",
    priority: "low",
    status: "todo",
    createdBy: "3", // Mike Brown
    assignedTo: "2" // Jane Doe
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage or use mock data
    const storedTasks = localStorage.getItem('taskify-tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Use mock tasks for demo
      setTasks(mockTasks);
      localStorage.setItem('taskify-tasks', JSON.stringify(mockTasks));
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('taskify-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;
    
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
      ...taskData
    };

    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully."
    });
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...taskData, 
            updatedAt: new Date().toISOString() 
          }
        : task
    ));

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully."
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted."
    });
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByUser = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      new Date(task.dueDate) < now && 
      task.status !== 'completed'
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByUser,
        getTasksByStatus,
        getOverdueTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
