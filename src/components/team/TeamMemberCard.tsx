import { useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { TeamMember } from "@/hooks/use-team";
import { MessageSquare, UserMinus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/use-gsap";

interface TeamMemberCardProps {
  member: TeamMember;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    review: number;
    completionRate: number;
  };
  onMessageClick?: (member: TeamMember) => void;
  onRemoveClick?: (member: TeamMember) => void;
  onRoleClick?: (member: TeamMember) => void;
  onViewDetailsClick?: () => void;
  index?: number; // For staggered animations
}

export default function TeamMemberCard({
  member,
  stats,
  onMessageClick,
  onRemoveClick,
  onRoleClick,
  onViewDetailsClick,
  index = 0
}: TeamMemberCardProps) {
  const { fadeIn } = useGSAP();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Animation on mount
  useEffect(() => {
    if (cardRef.current) {
      fadeIn(cardRef.current, 0.5, 0.1 * (index || 0));
    }
  }, [fadeIn, index]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'; // Primary color
      case 'manager':
        return 'outline'; // Secondary color
      default:
        return 'secondary'; // Muted color
    }
  };

  const getTimeStatus = () => {
    if (!member.lastActive) return null;
    
    try {
      const lastActive = new Date(member.lastActive);
      const timeAgo = formatDistanceToNow(lastActive, { addSuffix: true });
      return `Active ${timeAgo}`;
    } catch (error) {
      return null;
    }
  };

  return (
    <Card ref={cardRef} className="opacity-0">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
          <Avatar className="w-16 h-16">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-between">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <Badge variant={getRoleBadgeVariant(member.role)} className="md:self-start">
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            {member.teamRole && member.teamRole !== member.role && (
              <Badge variant="outline" className="bg-primary/10">
                Team: {member.teamRole}
              </Badge>
            )}
            {getTimeStatus() && (
              <p className="text-xs text-muted-foreground">{getTimeStatus()}</p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Task Completion</span>
              <span className="font-medium">{stats.completionRate}%</span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-2"
              // Add custom color classes based on completion rate
              indicatorClassName={cn(
                stats.completionRate < 30 ? "bg-red-500" : 
                stats.completionRate < 70 ? "bg-yellow-500" : 
                "bg-green-500"
              )}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Total Tasks: {stats.total}</span>
            <span>Completed: {stats.completed}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-muted p-2 rounded text-center">
              <div className="text-lg font-semibold">{stats.todo}</div>
              <div className="text-xs text-muted-foreground">Todo</div>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <div className="text-lg font-semibold">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <div className="text-lg font-semibold">{stats.review}</div>
              <div className="text-xs text-muted-foreground">Review</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetailsClick}
        >
          View Details
        </Button>
        <div className="flex gap-2">
          {onRoleClick && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onRoleClick(member)}
              title="Manage Role"
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          {onMessageClick && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onMessageClick(member)}
              title="Send Message"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
          {onRemoveClick && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemoveClick(member)}
              title="Remove Member"
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
