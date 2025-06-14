

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
      case 'review':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-100';
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100';
      default:
        return 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-100';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`w-full hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300 dark:border-red-700' : 'border-gray-100 dark:border-zinc-800'} bg-white dark:bg-[#20212a]/80 dark:backdrop-blur-md text-gray-900 dark:text-gray-50 shadow rounded-xl`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <div className="flex gap-1">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            
            {isOverdue && (
              <Badge variant="destructive" className="ml-2 text-xs py-0">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 flex sm:flex-row justify-between bg-transparent border-t border-gray-100 dark:border-zinc-800 flex-col gap-2 sm:gap-0">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="bg-white dark:bg-transparent border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="bg-white dark:bg-transparent border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300"
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
                className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 w-full sm:w-auto justify-center"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 w-full sm:w-auto justify-center"
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
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 w-full sm:w-auto justify-center"
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

