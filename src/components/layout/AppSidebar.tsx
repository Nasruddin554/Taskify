
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '../dashboard/UserAvatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    label: 'Tasks',
    icon: <ClipboardList className="w-5 h-5" />,
    href: '/tasks',
  },
  {
    label: 'Team',
    icon: <Users className="w-5 h-5" />,
    href: '/team',
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
  },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const renderNavItems = () => (
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant={location.pathname === item.href ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              location.pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );

  const renderNavContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Taskify</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <nav>{renderNavItems()}</nav>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user!} className="h-9 w-9" />
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  // Mobile sidebar with slide-in sheet
  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-10">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            {renderNavContent()}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden md:flex h-screen w-[280px] flex-col border-r bg-background">
      {renderNavContent()}
    </div>
  );
}
