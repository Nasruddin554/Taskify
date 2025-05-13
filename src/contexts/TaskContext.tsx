
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      const formattedTasks = data.map((task): Task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        dueDate: task.due_date || new Date().toISOString(),
        priority: (task.priority as TaskPriority) || 'medium',
        status: (task.status as TaskStatus) || 'todo',
        createdBy: task.created_by,
        assignedTo: task.assigned_to,
      }));
      
      return formattedTasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error fetching tasks',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Use React Query to manage tasks data
  const { data: fetchedTasks, isLoading: isFetchingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: !!user, // Only fetch tasks when user is authenticated
  });

  // Update local tasks state when fetchedTasks changes
  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
      setIsLoading(false);
    }
  }, [fetchedTasks]);

  // Mutations for task operations
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description: string;
      due_date: string;
      priority: TaskPriority;
      status: TaskStatus;
      created_by: string;
      assigned_to?: string;
    }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;

    // Convert to snake_case for the database
    createTaskMutation.mutate({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      status: taskData.status,
      created_by: user.id,
      assigned_to: taskData.assignedTo,
    });

    toast({
      title: "Task created",
      description: "Your task has been created successfully."
    });
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    // Convert to snake_case for the database
    const dbTaskData: any = {};
    if (taskData.title) dbTaskData.title = taskData.title;
    if (taskData.description) dbTaskData.description = taskData.description;
    if (taskData.dueDate) dbTaskData.due_date = taskData.dueDate;
    if (taskData.priority) dbTaskData.priority = taskData.priority;
    if (taskData.status) dbTaskData.status = taskData.status;
    if ('assignedTo' in taskData) dbTaskData.assigned_to = taskData.assignedTo;
    
    // Update locally for optimistic UI
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...taskData, 
            updatedAt: new Date().toISOString() 
          }
        : task
    ));
    
    // Update in database
    updateTaskMutation.mutate({ id, data: dbTaskData });

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully."
    });
  };

  const deleteTask = (id: string) => {
    // Update locally for optimistic UI
    setTasks(prev => prev.filter(task => task.id !== id));
    
    // Delete from database
    deleteTaskMutation.mutate(id);
    
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
        isLoading: isLoading || isFetchingTasks,
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
