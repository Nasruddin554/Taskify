
import { Task } from '@/types';
import TaskCard from './TaskCard';

interface TaskGridProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export default function TaskGrid({ tasks, onEditTask }: TaskGridProps) {
  if (tasks.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-1">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
}
