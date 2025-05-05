
import { ReactNode, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import TaskDialog from '../tasks/TaskDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // If still loading auth state, show nothing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16' : ''}`}>
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
      
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
      />
    </div>
  );
}
