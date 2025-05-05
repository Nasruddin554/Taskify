
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import AppLayout from '@/components/layout/AppLayout';
import UserAvatar from '@/components/dashboard/UserAvatar';
import { User } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Mail } from 'lucide-react';

// Mock team members for demo
const teamMembers: User[] = [
  {
    id: "1",
    email: "johndoe@example.com",
    name: "John Doe",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=johndoe@example.com"
  },
  {
    id: "2",
    email: "janedoe@example.com",
    name: "Jane Doe",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?u=janedoe@example.com"
  },
  {
    id: "3",
    email: "mikebrown@example.com",
    name: "Mike Brown",
    role: "user",
    avatar: "https://i.pravatar.cc/150?u=mikebrown@example.com"
  },
  {
    id: "4",
    email: "sarahjohnson@example.com",
    name: "Sarah Johnson",
    role: "user",
    avatar: "https://i.pravatar.cc/150?u=sarahjohnson@example.com"
  },
  {
    id: "5",
    email: "alexwilliams@example.com",
    name: "Alex Williams",
    role: "user",
    avatar: "https://i.pravatar.cc/150?u=alexwilliams@example.com"
  }
];

export default function TeamPage() {
  const { tasks } = useTask();
  
  // For a real app, we would fetch this data from an API
  const [team] = useState<User[]>(teamMembers);

  const getTaskStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
    const reviewTasks = userTasks.filter(task => task.status === 'review');
    const todoTasks = userTasks.filter(task => task.status === 'todo');
    
    const completionRate = userTasks.length > 0 
      ? Math.round((completedTasks.length / userTasks.length) * 100) 
      : 0;
    
    return {
      total: userTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      review: reviewTasks.length,
      todo: todoTasks.length,
      completionRate
    };
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your team members
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {team.map((member) => {
          const stats = getTaskStats(member.id);
          
          return (
            <Card key={member.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar user={member} className="h-10 w-10" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </CardDescription>
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
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
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
              
              <CardFooter className="pt-3 mt-auto">
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
