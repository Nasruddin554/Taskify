
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
        return 'bg-gray-200 text-gray-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-700';
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
        return 'bg-gray-200 text-gray-700';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  // Helper function to render action button based on task status
  const renderActionButton = () => {
    if (task.status === 'completed') {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-amber-600 gap-2 px-4"
          onClick={() => handleStatusChange('todo')}
        >
          Reopen
        </Button>
      );
    }
    
    if (task.status === 'review') {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-600 gap-2 px-4"
          onClick={() => handleStatusChange('completed')}
        >
          <CheckCircle2 className="w-4 h-4" />
          Complete
        </Button>
      );
    }
    
    if (task.status === 'in-progress') {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-600 gap-2 px-4"
          onClick={() => handleStatusChange('review')}
        >
          <ArrowRightCircle className="w-4 h-4" />
          Review
        </Button>
      );
    }
    
    // Todo status
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="text-blue-600 gap-2 px-4"
        onClick={() => handleStatusChange('in-progress')}
      >
        <Play className="w-4 h-4" />
        Start
      </Button>
    );
  };

  return (
    <Card className={`w-full hover:shadow-md transition-shadow ${isOverdue ? 'border-red-400' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{task.title}</h3>
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
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            
            {isOverdue && (
              <Badge variant="destructive" className="ml-2 text-xs py-0">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 bg-muted/30">
        <div className="w-full flex flex-col sm:flex-row">
          {/* Action buttons - Edit and Delete */}
          <div className="flex border-b sm:border-b-0 sm:border-r border-border">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(task)}
              className="flex-1 rounded-none h-11 gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="flex-1 rounded-none h-11 gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
          
          {/* Status action button */}
          <div className="flex-1 flex justify-center">
            {renderActionButton()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
