
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Edit,
  Trash2, 
  CheckCircle2,
  AlertCircle,
  ArrowRightCircle,
  Play  
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask, updateTask } = useTask();
  
  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'review' | 'completed') => {
    updateTask(task.id, { status: newStatus });
  };

  // BADGE colors for dark mode to match screenshot
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-200 text-gray-700 dark:bg-[#252533] dark:text-white';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100';
      case 'review':
        return 'bg-amber-100 text-amber-700 dark:bg-yellow-700 dark:text-yellow-100';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-[#252533] dark:text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100';
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-yellow-900 dark:text-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-600 dark:text-red-100';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card
      className={
        `w-full hover:shadow-lg transition-shadow 
        border border-border dark:border-[#512529] 
        bg-white dark:bg-[#181820] dark:backdrop-blur 
        ${
          isOverdue 
            ? 'border-red-400 dark:border-red-800 shadow-[0_4px_20px_rgba(255,0,0,0.05)]' 
            : 'shadow-sm'
        }`
      }
      style={{
        // For subtle background blending in dark mode
        ...(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? { background: 'rgba(22,22,32,0.98)' }
          : {})
      }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-foreground dark:text-white">{task.title}</h3>
          <div className="flex gap-1">
            <Badge className={`${getPriorityColor(task.priority)} !rounded-full !px-3 !py-1.5 font-medium` }>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge className={`${getStatusColor(task.status)} !rounded-full !px-3 !py-1.5 font-medium`}>
              {task.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 dark:text-muted">{task.description}</p>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-muted-foreground dark:text-muted">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            
            {isOverdue && (
              <Badge variant="destructive" className="ml-2 text-xs py-0 px-2 font-semibold rounded-full">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground dark:text-muted">
            <Clock className="w-3 h-3 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 flex sm:flex-row justify-between bg-[#f5f5fa] dark:bg-[#20202a] border-t border-gray-200 dark:border-[#2a2020] flex-col gap-2 sm:gap-0">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="bg-transparent border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#262634] dark:text-white"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="bg-transparent border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#291617] text-red-500 dark:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          {task.status !== 'completed' ? (
            task.status === 'review' ? (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 w-full sm:w-auto justify-center"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 w-full sm:w-auto justify-center"
                onClick={() => handleStatusChange(
                  task.status === 'todo' ? 'in-progress' : 'review'
                )}
              >
                {task.status === 'todo' ? (
                  <Play className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowRightCircle className="w-4 h-4 mr-1" />
                )}
                {task.status === 'todo' ? 'Start' : 'Review'}
              </Button>
            )
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-amber-600 dark:text-amber-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 w-full sm:w-auto justify-center"
              onClick={() => handleStatusChange('todo')}
            >
              Reopen
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
