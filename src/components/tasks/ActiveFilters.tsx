
import React from "react";

interface ActiveFiltersProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  resetFilters: () => void;
}

export default function ActiveFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  resetFilters,
}: ActiveFiltersProps) {
  if (statusFilter === "all" && priorityFilter === "all") return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {statusFilter !== "all" && (
        <div className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center dark:bg-[#3f3f52] dark:text-white border border-gray-300 dark:border-[#2a2a36]">
          Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          <button 
            onClick={() => setStatusFilter('all')} 
            className="ml-1 hover:text-primary dark:hover:text-blue-400"
            aria-label="Clear status filter"
          >
            ×
          </button>
        </div>
      )}
      {priorityFilter !== "all" && (
        <div className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center dark:bg-[#3f3f52] dark:text-white border border-gray-300 dark:border-[#2a2a36]">
          Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
          <button 
            onClick={() => setPriorityFilter('all')} 
            className="ml-1 hover:text-primary dark:hover:text-blue-400"
            aria-label="Clear priority filter"
          >
            ×
          </button>
        </div>
      )}
      <button 
        onClick={resetFilters}
        className="text-xs text-primary hover:text-primary/80 underline dark:text-blue-400 dark:hover:text-blue-200"
      >
        Clear all
      </button>
    </div>
  );
}
