
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
import { 
  Clock, 
  Mail, 
  UserPlus, 
  Users, 
  MessagesSquare,
  MessageSquarePlus 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();
  
  // For a real app, we would fetch this data from an API
  const [team, setTeam] = useState<User[]>(teamMembers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');

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

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to send an invitation
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
    
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedMember) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to send a message
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedMember.name}`,
    });
    
    setMessage('');
    setIsMessageDialogOpen(false);
    setSelectedMember(null);
  };

  const openMessageDialog = (member: User) => {
    setSelectedMember(member);
    setIsMessageDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your team members
            </p>
          </div>
          <Button 
            onClick={() => setIsInviteDialogOpen(true)}
            className="mt-4 sm:mt-0 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Team stats summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Size</div>
                <div className="text-xl font-bold">{team.length} members</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Task Completion</div>
                <div className="text-xl font-bold">
                  {team.length > 0 ? 
                    Math.round(team.reduce((acc, member) => 
                      acc + getTaskStats(member.id).completionRate, 0) / team.length) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
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
              
              <CardFooter className="pt-3 mt-auto flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => openMessageDialog(member)}
                >
                  <MessagesSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Profile viewed",
                      description: `Viewing ${member.name}'s detailed profile`
                    });
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you'd like to invite to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="user"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder="I'd like to invite you to join our team..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Member Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              {selectedMember && `Compose a message to ${selectedMember.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedMember && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <UserAvatar user={selectedMember} className="h-10 w-10" />
                <div>
                  <div className="font-medium">{selectedMember.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedMember.email}</div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message here..."
                className="resize-none min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}
