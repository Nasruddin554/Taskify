
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  onCreateTask?: () => void;
  isMobile?: boolean;
}

export default function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onCreateTask,
  isMobile = false,
}: TaskFiltersProps) {
  // Mobile version does not show "create task" button, that's handled separately.
  return !isMobile ? (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 dark:text-[#a4a6b3]" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 dark:bg-[#232330] dark:text-white dark:border-[#34344a]"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="dark:bg-[#232330] dark:text-white border dark:border-[#34344a]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#232330] dark:text-white dark:border-[#34344a] z-40">
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
            <SelectTrigger className="dark:bg-[#232330] dark:text-white border dark:border-[#34344a]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#232330] dark:text-white dark:border-[#34344a] z-40">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Only show on desktop */}
        {onCreateTask && (
          <button
            className="hidden md:flex dark:bg-primary dark:text-white items-center px-4 py-2 rounded-md"
            type="button"
            onClick={onCreateTask}
          >
            + New Task
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="flex gap-2 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 dark:text-[#a4a6b3]" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 dark:bg-[#232330] dark:text-white dark:border-[#34344a]"
        />
      </div>
    </div>
  );
}
