
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/animated-container';

interface DashboardHeaderProps {
  onCreateTask: () => void;
}

export default function DashboardHeader({ onCreateTask }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  
  const tasksAssignedToUser = tasks.filter(task => task.assignedTo === user?.id);
  const overdueTasks = tasksAssignedToUser.filter(
    task => new Date(task.dueDate) < new Date() && task.status !== 'completed'
  );

  return (
    <AnimatedContainer animation="reveal" origin="top" duration={0.6}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            You have {tasksAssignedToUser.length} tasks assigned to you, 
            {overdueTasks.length > 0 ? (
              <span className="text-red-500 font-medium"> {overdueTasks.length} overdue</span>
            ) : (
              " all on schedule"
            )}
          </p>
        </div>
        
        <AnimatedContainer animation="fade" delay={0.3} duration={0.5}>
          <div className="flex mt-4 md:mt-0">
            <Button onClick={onCreateTask} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  );
}
