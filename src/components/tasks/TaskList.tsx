
import { useState } from 'react';
import { Task } from '@/types';
import { useTask } from '@/contexts/TaskContext';
import { useTaskRealtime } from '@/hooks/use-task-realtime';
import TaskDialog from './TaskDialog';
import TaskSearch from './TaskSearch';
import TaskFilters from './TaskFilters';
import FilterPills from './FilterPills';
import EmptyTasksView from './EmptyTasksView';
import MobileFilterSheet from './MobileFilterSheet';
import TaskGrid from './TaskGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function TaskList() {
  // Initialize real-time subscription
  useTaskRealtime();
  
  const { tasks } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Handle filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks by due date (most recent first)
  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setCurrentTask(undefined);
  };

  // Reset filters helper
  const resetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
    setIsFilterSheetOpen(false);
  };

  return (
    <div className="w-full">
      {/* Search & Filters - Mobile */}
      {isMobile && (
        <div className="flex gap-2 mb-4">
          <TaskSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <MobileFilterSheet
            isOpen={isFilterSheetOpen}
            setIsOpen={setIsFilterSheetOpen}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            resetFilters={resetFilters}
          />
        </div>
      )}
      
      {/* Search & Filters - Desktop */}
      {!isMobile && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <TaskSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="flex flex-col md:flex-row gap-4">
            <TaskFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
            
            {/* Only show on desktop */}
            <Button onClick={handleCreateTask} className="hidden md:flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      )}
      
      {/* Active Filters Pills */}
      <FilterPills
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        setStatusFilter={setStatusFilter}
        setPriorityFilter={setPriorityFilter}
        resetFilters={resetFilters}
      />
      
      {/* Task List - Responsive Grid */}
      {sortedTasks.length > 0 ? (
        <TaskGrid tasks={sortedTasks} onEditTask={handleEditTask} />
      ) : (
        <EmptyTasksView hasTasks={tasks.length > 0} onCreateTask={handleCreateTask} />
      )}
      
      <TaskDialog
        task={currentTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
      />
    </div>
  );
}
