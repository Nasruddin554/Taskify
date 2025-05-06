
import { useState, useEffect } from 'react';
import { useTeam } from '@/contexts/TeamContext';
import { useAuth } from '@/contexts/AuthContext';
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
  Users, 
  UserPlus,
  UserMinus,
  Plus,
  Settings,
  Share2,
  LogOut
} from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from "@/components/ui/drawer";

export default function TeamPage() {
  const { tasks } = useTask();
  const { user } = useAuth();
  const { 
    teams, 
    currentTeam, 
    teamMembers, 
    isLoading,
    createTeam,
    joinTeamByCode,
    leaveTeam,
    deleteTeam,
    setCurrentTeam,
    getTeamMembers,
    changeTeamMemberRole,
    removeTeamMember
  } = useTeam();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [joinTeamDialogOpen, setJoinTeamDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showMemberActions, setShowMemberActions] = useState('');
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Fetch team members when current team changes
  useEffect(() => {
    if (currentTeam) {
      getTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  const getTaskStats = (userId: string) => {
    const userTasks = tasks.filter(task => 
      task.assignedTo === userId && 
      (task.team_id === currentTeam?.id || !task.team_id)
    );
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

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const team = await createTeam(teamName, teamDescription);
    setIsSubmitting(false);
    
    if (team) {
      setCreateTeamDialogOpen(false);
      setTeamName('');
      setTeamDescription('');
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Join code required",
        description: "Please enter a team join code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    const success = await joinTeamByCode(joinCode.trim());
    setIsJoining(false);
    
    if (success) {
      setJoinTeamDialogOpen(false);
      setJoinCode('');
    }
  };

  const copyJoinCode = () => {
    if (currentTeam?.joinCode) {
      navigator.clipboard.writeText(currentTeam.joinCode);
      toast({
        title: "Join code copied",
        description: "Team join code has been copied to clipboard."
      });
    }
  };

  const handleLeaveTeam = async () => {
    if (currentTeam) {
      await leaveTeam(currentTeam.id);
      setConfirmLeaveOpen(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (currentTeam) {
      await deleteTeam(currentTeam.id);
      setConfirmDeleteOpen(false);
    }
  };

  const isTeamAdmin = () => {
    if (!user || !currentTeam || !teamMembers) return false;
    
    const membership = teamMembers.find(member => 
      member.userId === user.id && member.teamId === currentTeam.id
    );
    
    return membership?.role === 'admin' || currentTeam.createdBy === user.id;
  };

  const handlePromoteToAdmin = (memberId: string) => {
    changeTeamMemberRole(memberId, 'admin');
    setShowMemberActions('');
  };

  const handleDemoteToMember = (memberId: string) => {
    changeTeamMemberRole(memberId, 'member');
    setShowMemberActions('');
  };

  const handleRemoveMember = (memberId: string) => {
    removeTeamMember(memberId);
    setShowMemberActions('');
  };

  // Content to render when user has no teams
  const renderNoTeams = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create a team to collaborate with others or join an existing team using a join code.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {isMobile ? (
          <>
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Team</DrawerTitle>
                  <DrawerDescription>
                    Create a team to collaborate with others
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name-mobile">Team Name</Label>
                    <Input
                      id="team-name-mobile"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description-mobile">Description (Optional)</Label>
                    <Textarea
                      id="team-description-mobile"
                      placeholder="Enter team description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleCreateTeam} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Join Team
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Join Team</DrawerTitle>
                  <DrawerDescription>
                    Enter the team code to join an existing team
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-code-mobile">Team Code</Label>
                    <Input
                      id="join-code-mobile"
                      placeholder="Enter team code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleJoinTeam} disabled={isJoining}>
                    {isJoining ? "Joining..." : "Join Team"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <>
            <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Create a team to collaborate with others
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description">Description (Optional)</Label>
                    <Textarea
                      id="team-description"
                      placeholder="Enter team description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateTeam} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={joinTeamDialogOpen} onOpenChange={setJoinTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Join Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Team</DialogTitle>
                  <DialogDescription>
                    Enter the team code to join an existing team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="join-code">Team Code</Label>
                    <Input
                      id="join-code"
                      placeholder="Enter team code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinTeam} disabled={isJoining}>
                    {isJoining ? "Joining..." : "Join Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );

  // Team selector and actions
  const renderTeamSelector = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        {teams.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {currentTeam?.name || 'Select Team'}
                <Users className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {teams.map(team => (
                <DropdownMenuItem 
                  key={team.id} 
                  onClick={() => setCurrentTeam(team)}
                  className={team.id === currentTeam?.id ? 'bg-primary/10' : ''}
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {currentTeam && (
          <>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={copyJoinCode}
            >
              <Share2 className="h-4 w-4" />
              Share Join Code
            </Button>

            {isTeamAdmin() && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Team Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentTeam.createdBy === user?.id && (
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setConfirmDeleteOpen(true)}
                    >
                      Delete Team
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {currentTeam.createdBy !== user?.id && (
              <Button 
                variant="outline" 
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => setConfirmLeaveOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Leave Team
              </Button>
            )}
          </>
        )}
        
        {isMobile ? (
          <>
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="icon" className="gap-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Team</DrawerTitle>
                  <DrawerDescription>
                    Create a team to collaborate with others
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name-mobile-add">Team Name</Label>
                    <Input
                      id="team-name-mobile-add"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description-mobile-add">Description (Optional)</Label>
                    <Textarea
                      id="team-description-mobile-add"
                      placeholder="Enter team description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleCreateTeam} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Join Team</DrawerTitle>
                  <DrawerDescription>
                    Enter the team code to join an existing team
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-code-mobile-add">Team Code</Label>
                    <Input
                      id="join-code-mobile-add"
                      placeholder="Enter team code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleJoinTeam} disabled={isJoining}>
                    {isJoining ? "Joining..." : "Join Team"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <>
            <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="gap-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Create a team to collaborate with others
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="team-name-add">Team Name</Label>
                    <Input
                      id="team-name-add"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description-add">Description (Optional)</Label>
                    <Textarea
                      id="team-description-add"
                      placeholder="Enter team description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateTeam} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={joinTeamDialogOpen} onOpenChange={setJoinTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Team</DialogTitle>
                  <DialogDescription>
                    Enter the team code to join an existing team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="join-code-add">Team Code</Label>
                    <Input
                      id="join-code-add"
                      placeholder="Enter team code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinTeam} disabled={isJoining}>
                    {isJoining ? "Joining..." : "Join Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );

  // Team members list
  const renderTeamMembers = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {teamMembers.map((member) => {
        const stats = getTaskStats(member.userId);
        const memberUser: User = {
          id: member.userId,
          name: member.user?.name || 'Unknown User',
          email: member.user?.email || '',
          role: 'user',
          avatar: member.user?.avatar
        };
        
        const isCreator = currentTeam?.createdBy === member.userId;
        const isCurrentUser = user?.id === member.userId;
        
        return (
          <Card key={member.id} className="flex flex-col h-full relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <UserAvatar user={memberUser} className="h-10 w-10" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {memberUser.name} {isCurrentUser && "(You)"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{memberUser.email}</span>
                  </CardDescription>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {isCreator ? "Creator" : member.role}
                </Badge>
                
                {isTeamAdmin() && !isCurrentUser && !isCreator && (
                  <DropdownMenu 
                    onOpenChange={() => setShowMemberActions(member.id)}
                    open={showMemberActions === member.id}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role !== 'admin' && (
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.id)}>
                          Promote to Admin
                        </DropdownMenuItem>
                      )}
                      {member.role === 'admin' && (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(member.id)}>
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Remove from Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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
          </Card>
        );
      })}
    </div>
  );

  // Confirmation dialogs
  const renderConfirmationDialogs = () => (
    <>
      <Dialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this team? You will lose access to all team tasks and resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmLeaveOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLeaveTeam}
            >
              Leave Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone and will remove all team data including tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTeam}
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team and members
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse">Loading team data...</div>
          </div>
        ) : teams.length === 0 ? (
          renderNoTeams()
        ) : (
          <div className="space-y-6">
            {renderTeamSelector()}
            
            {currentTeam && (
              <>
                {teamMembers.length > 0 ? (
                  renderTeamMembers()
                ) : (
                  <div className="text-center py-10">
                    <p>No team members found.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {renderConfirmationDialogs()}
      </div>
    </AppLayout>
  );
}
