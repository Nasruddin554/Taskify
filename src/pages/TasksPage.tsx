
import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function TasksPage() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const isMobile = useIsMobile();
  
  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setCurrentTask(undefined);
  };

  return (
    <AppLayout>
      <div className="mb-6 px-1 sm:px-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your tasks in one place
            </p>
          </div>
          
          <Button 
            onClick={handleCreateTask} 
            className="mt-4 md:mt-0 gap-2 w-full md:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Task
          </Button>
        </div>
      </div>
      
      <TaskList />
      
      <TaskDialog
        task={currentTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
      />

      {/* Fixed mobile action button */}
      {isMobile && (
        <div className="fixed right-4 bottom-4 z-10">
          <Button 
            onClick={handleCreateTask}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Create New Task</span>
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
