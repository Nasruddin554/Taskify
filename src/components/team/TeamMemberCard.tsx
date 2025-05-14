
import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { MessagesSquare, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamMember } from '@/hooks/use-team';

interface TeamMemberCardProps {
  member: TeamMember;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    review: number;
    todo: number;
    completionRate: number;
  };
  onMessageClick: (member: TeamMember) => void;
  onViewDetailsClick: (member: TeamMember) => void;
}

export default function TeamMemberCard({ 
  member, 
  stats, 
  onMessageClick,
  onViewDetailsClick 
}: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getLastActiveText = (lastActive: string | undefined) => {
    if (!lastActive) return "Never active";
    
    try {
      const lastActiveDate = new Date(lastActive);
      return `Last active: ${format(lastActiveDate, 'MMM d, h:mm a')}`;
    } catch (e) {
      return "Last active: Unknown";
    }
  };

  return (
    <Card 
      className={`flex flex-col h-full transition-all duration-200 ${
        isHovered ? 'shadow-md translate-y-[-4px]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{member.name}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="truncate">{member.email}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getLastActiveText(member.lastActive)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <Badge 
          variant="outline"
          className="capitalize absolute top-4 right-4"
        >
          {member.role}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Task Completion</span>
              <span className={`font-medium ${stats.completionRate > 70 ? 'text-green-600 dark:text-green-400' : 
                stats.completionRate > 30 ? 'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'}`}
              >
                {stats.completionRate}%
              </span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-2" 
              indicatorClassName={stats.completionRate > 70 ? 'bg-green-600 dark:bg-green-400' : 
                stats.completionRate > 30 ? 'bg-amber-600 dark:bg-amber-400' : 
                'bg-red-600 dark:bg-red-400'} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.review}</div>
              <div className="text-xs text-muted-foreground">In Review</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 mt-auto flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onMessageClick(member)}
        >
          <MessagesSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onViewDetailsClick(member)}
        >
          <User className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
