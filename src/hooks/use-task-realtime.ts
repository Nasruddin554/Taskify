
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useTaskRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to task changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('Real-time task change:', payload);
          
          // Invalidate and refetch task data
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          
          // Show toast notification based on event type
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New task created',
              description: `"${payload.new.title}" was added`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Task updated',
              description: `"${payload.new.title}" was updated`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Task deleted',
              description: 'A task was removed',
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
