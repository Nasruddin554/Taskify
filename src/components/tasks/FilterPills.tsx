
interface FilterPillsProps {
  statusFilter: string;
  priorityFilter: string;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  resetFilters: () => void;
}

export default function FilterPills({
  statusFilter,
  priorityFilter,
  setStatusFilter,
  setPriorityFilter,
  resetFilters
}: FilterPillsProps) {
  if (statusFilter === 'all' && priorityFilter === 'all') {
    return null;
  }
  
  return (
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
  );
}
