
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TaskSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TaskSearch({ searchQuery, setSearchQuery }: TaskSearchProps) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
