import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { useTeam, TeamMember } from '@/hooks/use-team';
import AppLayout from '@/components/layout/AppLayout';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import { SkeletonTeamCard } from '@/components/ui/skeleton-card';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useGSAP } from '@/hooks/use-gsap';
import { 
  UserPlus, 
  Users, 
  Clock,
  Search,
  Filter,
  RefreshCcw,
  Loader2,
  Shield,
  UserMinus,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TeamPage() {
  const { tasks } = useTask();
  const { user } = useAuth();
  const { toast } = useToast();
  const { gsap, stagger, createTimeline } = useGSAP();
  const { 
    team, 
    isLoading, 
    error, 
    fetchTeamMembers, 
    inviteMember,
    removeTeamMember,
    updateMemberRole 
  } = useTeam();
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviteMessage, setInviteMessage] = useState('');
  const [message, setMessage] = useState('');
  const [newRole, setNewRole] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Ref for the team grid
  const teamGridRef = useState<HTMLDivElement | null>(null);
  
  // Animation for team stats
  useEffect(() => {
    if (!isLoading && team.length > 0) {
      const tl = createTimeline();
      tl.from('.team-stats-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, [isLoading, team.length, createTimeline]);

  // Animation for search and filter controls
  useEffect(() => {
    const tl = createTimeline({ delay: 0.3 });
    tl.from('.controls-animate', {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out'
    });
  }, [createTimeline]);

  // Animation for refresh button
  const animateRefresh = () => {
    gsap.to('.refresh-icon', {
      rotation: '+=360',
      duration: 1,
      ease: 'power1.inOut'
    });
  };

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

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const success = await inviteMember(inviteEmail, inviteRole);
    if (success) {
      setInviteEmail('');
      setInviteRole('user');
      setInviteMessage('');
      setIsInviteDialogOpen(false);
    }
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

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedMember.name}`,
    });
    
    setMessage('');
    setIsMessageDialogOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    const success = await removeTeamMember(selectedMember.id);
    if (success) {
      setIsRemoveDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole) return;
    
    const success = await updateMemberRole(selectedMember.id, newRole);
    if (success) {
      setIsRoleDialogOpen(false);
      setSelectedMember(null);
      setNewRole('');
    }
  };

  const openMessageDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsMessageDialogOpen(true);
  };

  const openRemoveDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsRemoveDialogOpen(true);
  };

  const openRoleDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setNewRole(member.teamRole);
    setIsRoleDialogOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    animateRefresh();
    await fetchTeamMembers();
    setIsRefreshing(false);
    toast({
      title: "Team refreshed",
      description: "Team data has been updated",
    });
  };

  // Filter and sort team members
  const filteredTeam = team
    .filter(member => {
      // Filter by search query
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by role
      const matchesRole = selectedRole === 'all' || member.role === selectedRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      // Sort by different properties
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'completion':
          return getTaskStats(b.id).completionRate - getTaskStats(a.id).completionRate;
        default:
          return 0;
      }
    });

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeam = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    return Array(itemsPerPage).fill(0).map((_, index) => (
      <SkeletonTeamCard key={`skeleton-${index}`} />
    ));
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
            className="mt-4 sm:mt-0 gap-2 controls-animate"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Team stats summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-3 mb-3 sm:mb-0 team-stats-item">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Size</div>
                <div className="text-xl font-bold">{team.length} members</div>
              </div>
            </div>
            <div className="flex items-center gap-3 team-stats-item">
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
        
        {/* Filters and search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 controls-animate">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search team members..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="controls-animate">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSelectedRole('all')}
                    className={selectedRole === 'all' ? 'bg-muted' : ''}
                  >
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSelectedRole('admin')}
                    className={selectedRole === 'admin' ? 'bg-muted' : ''}
                  >
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSelectedRole('manager')}
                    className={selectedRole === 'manager' ? 'bg-muted' : ''}
                  >
                    Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSelectedRole('user')}
                    className={selectedRole === 'user' ? 'bg-muted' : ''}
                  >
                    User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="controls-animate">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortBy('name')}
                    className={sortBy === 'name' ? 'bg-muted' : ''}
                  >
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('role')}
                    className={sortBy === 'role' ? 'bg-muted' : ''}
                  >
                    Role
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('completion')}
                    className={sortBy === 'completion' ? 'bg-muted' : ''}
                  >
                    Task Completion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 controls-animate" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 refresh-icon" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      )}
      
      {/* Team grid */}
      <div 
        ref={el => teamGridRef.current = el} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {isLoading ? (
          renderSkeletons()
        ) : paginatedTeam.length > 0 ? (
          paginatedTeam.map((member, idx) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              stats={getTaskStats(member.id)}
              onMessageClick={openMessageDialog}
              onRemoveClick={openRemoveDialog}
              onRoleClick={openRoleDialog}
              onViewDetailsClick={() => {
                toast({
                  title: "Profile viewed",
                  description: `Viewing ${member.name}'s detailed profile`
                });
              }}
              index={idx} // Add index for staggered animations
            />
          ))
        ) : (
          <div className="col-span-full p-10 text-center bg-muted/40 rounded-lg">
            <p className="text-muted-foreground">No team members found matching your filters.</p>
            {searchQuery || selectedRole !== 'all' ? (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('all');
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTeam.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="text-sm px-2">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

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
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder="I'd like to invite you to join our team..."
                className="resize-none"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
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
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>{selectedMember.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
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
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMember && 
                `Are you sure you want to remove ${selectedMember.name} from the team? 
                This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Team Role</DialogTitle>
            <DialogDescription>
              {selectedMember && `Update ${selectedMember.name}'s role in the team`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedMember && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>{selectedMember.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedMember.name}</div>
                  <div className="text-sm text-muted-foreground">Current role: {selectedMember.teamRole}</div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-role">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {newRole === 'admin' && (
                <div className="flex items-center mt-2 p-2 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
                  <span className="text-yellow-800 dark:text-yellow-400">
                    Admin users have full access to all team settings and data.
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="gap-2">
              <Shield className="h-4 w-4" />
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
