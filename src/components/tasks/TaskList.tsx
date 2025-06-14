
import { useState } from 'react';
import { Task } from '@/types';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskFilters from './TaskFilters';
import TaskFiltersSheet from './TaskFiltersSheet';
import ActiveFilters from './ActiveFilters';
import EmptyTaskListState from './EmptyTaskListState';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function TaskList() {
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
      {/* Search & Filters */}
      {isMobile ? (
        <div>
          <TaskFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            isMobile
          />
          <TaskFiltersSheet
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            isOpen={isFilterSheetOpen}
            setIsOpen={setIsFilterSheetOpen}
            resetFilters={resetFilters}
          />
        </div>
      ) : (
        <TaskFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onCreateTask={handleCreateTask}
        />
      )}
      
      {/* Active Filters Pills */}
      <ActiveFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        resetFilters={resetFilters}
      />
      
      {/* Task List - Responsive Grid */}
      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-1">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      ) : (
        <EmptyTaskListState 
          filteredTasksLength={sortedTasks.length}
          tasksLength={tasks.length}
          onCreateTask={handleCreateTask}
        />
      )}
      
      <TaskDialog
        task={currentTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
      />
    </div>
  );
}
