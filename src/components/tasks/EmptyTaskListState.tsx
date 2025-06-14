
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyTaskListStateProps {
  filteredTasksLength: number;
  tasksLength: number;
  onCreateTask: () => void;
}

export default function EmptyTaskListState({
  filteredTasksLength,
  tasksLength,
  onCreateTask,
}: EmptyTaskListStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
      <p className="mt-2 text-muted-foreground">
        {tasksLength === 0 
          ? "Create your first task to get started" 
          : "Try adjusting your filters to see more results"}
      </p>
      {tasksLength === 0 && (
        <Button onClick={onCreateTask} className="mt-4 dark:bg-primary dark:text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      )}
    </div>
  );
}
