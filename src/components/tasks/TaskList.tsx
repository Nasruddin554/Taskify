import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useTask } from '@/contexts/TaskContext';
import { useTaskRealtime } from '@/hooks/use-task-realtime';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  // Mobile Filter Sheet content
  const renderFilterControls = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="mobile-status" className="text-sm font-medium block mb-2">Status</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="mobile-status" className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="mobile-priority" className="text-sm font-medium block mb-2">Priority</label>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger id="mobile-priority" className="w-full">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Reset
        </Button>
        <Button className="flex-1" onClick={() => setIsFilterSheetOpen(false)}>
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Search & Filters - Mobile */}
      {isMobile && (
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="px-3">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[350px]">
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
                <SheetDescription>
                  Apply filters to find the tasks you're looking for
                </SheetDescription>
              </SheetHeader>
              {renderFilterControls()}
            </SheetContent>
          </Sheet>
        </div>
      )}
      
      {/* Search & Filters - Desktop */}
      {!isMobile && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-40">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Only show on desktop */}
            <Button onClick={handleCreateTask} className="hidden md:flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      )}
      
      {/* Active Filters Pills */}
      {(statusFilter !== 'all' || priorityFilter !== 'all') && (
        <div className="flex flex-wrap gap-2 mb-4">
          {statusFilter !== 'all' && (
            <div className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center">
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <button 
                onClick={() => setStatusFilter('all')} 
                className="ml-1 hover:text-primary"
                aria-label="Clear status filter"
              >
                ×
              </button>
            </div>
          )}
          
          {priorityFilter !== 'all' && (
            <div className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center">
              Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
              <button 
                onClick={() => setPriorityFilter('all')} 
                className="ml-1 hover:text-primary"
                aria-label="Clear priority filter"
              >
                ×
              </button>
            </div>
          )}
          
          <button 
            onClick={resetFilters}
            className="text-xs text-primary hover:text-primary/80 underline"
          >
            Clear all
          </button>
        </div>
      )}
      
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
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
          <p className="mt-2 text-muted-foreground">
            {tasks.length === 0 
              ? "Create your first task to get started" 
              : "Try adjusting your filters to see more results"}
          </p>
          {tasks.length === 0 && (
            <Button onClick={handleCreateTask} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      )}
      
      <TaskDialog
        task={currentTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
      />
    </div>
  );
}
