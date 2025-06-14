import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import TaskStatusCard from './TaskStatusCard';
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/animated-container';

export default function TaskSummary() {
  const { user } = useAuth();
  const { tasks } = useTask();
  
  // Calculate task statistics
  const userTasks = user ? tasks.filter(task => task.assignedTo === user.id) : [];
  const userCreatedTasks = user ? tasks.filter(task => task.createdBy === user.id) : [];
  
  const overdueTasks = userTasks.filter(
    task => new Date(task.dueDate) < new Date() && task.status !== 'completed'
  );
  
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  
  // Calculate tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tasksDueToday = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && task.status !== 'completed';
  });

  return (
    <AnimatedContainer 
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6"
      animation="fade"
      delay={0.2}
      duration={0.5}
    >
      <TaskStatusCard
        title="Assigned to You"
        count={userTasks.length}
        icon={<ClipboardCheck className="text-primary h-6 w-6" />}
        description="Total tasks"
      />
      
      <TaskStatusCard
        title="Due Today"
        count={tasksDueToday.length}
        icon={<Clock className="text-amber-500 h-6 w-6" />}
        description="Tasks to complete today"
      />
      
      <TaskStatusCard
        title="Overdue"
        count={overdueTasks.length}
        icon={<AlertTriangle className="text-red-500 h-6 w-6" />}
        description="Tasks past due date"
        className={overdueTasks.length > 0 ? "border-red-200" : ""}
      />
      
      <TaskStatusCard
        title="Completed"
        count={completedTasks.length}
        icon={<CheckCircle2 className="text-green-500 h-6 w-6" />}
        description="Finished tasks"
      />
    </AnimatedContainer>
  );
}
