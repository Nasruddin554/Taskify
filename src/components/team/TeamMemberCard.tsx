
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Shield, User } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { useRef, useEffect } from 'react';
import { AnimatedContainer } from '@/components/ui/animated-container';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  lastActive?: string;
  tasksCompleted: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onRoleChange?: (memberId: string, newRole: string) => void;
  onRemove?: (memberId: string) => void;
  currentUserRole?: string;
}

export default function TeamMemberCard({
  member,
  onRoleChange,
  onRemove,
  currentUserRole = 'user'
}: TeamMemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (!gsap || !cardRef.current) return;

    const card = cardRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gsap]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'manager':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const canManageRole = currentUserRole === 'admin' || 
                       (currentUserRole === 'manager' && member.role === 'user');

  return (
    <AnimatedContainer animation="scale" delay={0.1}>
      <Card ref={cardRef} className="transition-all duration-200 hover:shadow-lg dark:bg-card dark:border-border">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {member.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleColor(member.role)}`}
                  >
                    {getRoleIcon(member.role)}
                    <span className="ml-1 capitalize">{member.role}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {member.tasksCompleted} tasks completed
                  {member.lastActive && (
                    <span className="ml-2">
                      • Last active {member.lastActive}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canManageRole && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUserRole === 'admin' && (
                    <>
                      <DropdownMenuItem 
                        onClick={() => onRoleChange?.(member.id, 'admin')}
                        disabled={member.role === 'admin'}
                      >
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onRoleChange?.(member.id, 'manager')}
                        disabled={member.role === 'manager'}
                      >
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onRoleChange?.(member.id, 'user')}
                        disabled={member.role === 'user'}
                      >
                        Make User
                      </DropdownMenuItem>
                    </>
                  )}
                  {currentUserRole === 'manager' && member.role === 'user' && (
                    <DropdownMenuItem 
                      onClick={() => onRoleChange?.(member.id, 'manager')}
                    >
                      Make Manager
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onRemove?.(member.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    Remove from team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  );
}
