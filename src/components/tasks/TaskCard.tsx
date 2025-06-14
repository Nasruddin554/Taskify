
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
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`w-full hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : 'border-gray-100'} bg-white text-gray-900 shadow rounded-xl`}>
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
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            
            {isOverdue && (
              <Badge variant="destructive" className="ml-2 text-xs py-0">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 flex sm:flex-row justify-between bg-transparent border-t border-gray-100 flex-col gap-2 sm:gap-0">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="bg-white border-gray-200 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="bg-white border-gray-200 hover:bg-gray-100 text-red-500 hover:text-red-400"
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
                className="text-green-600 hover:bg-green-100 w-full sm:w-auto justify-center"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 hover:bg-blue-100 w-full sm:w-auto justify-center"
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
              className="text-amber-600 hover:bg-amber-100 w-full sm:w-auto justify-center"
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

