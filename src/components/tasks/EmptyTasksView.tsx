
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyTasksViewProps {
  hasTasks: boolean;
  onCreateTask: () => void;
}

export default function EmptyTasksView({ hasTasks, onCreateTask }: EmptyTasksViewProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
      <p className="mt-2 text-muted-foreground">
        {hasTasks 
          ? "Try adjusting your filters to see more results" 
          : "Create your first task to get started"}
      </p>
      {!hasTasks && (
        <Button onClick={onCreateTask} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      )}
    </div>
  );
}
