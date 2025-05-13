
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MobileFilterSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  resetFilters: () => void;
}

export default function MobileFilterSheet({
  isOpen,
  setIsOpen,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  resetFilters
}: MobileFilterSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
