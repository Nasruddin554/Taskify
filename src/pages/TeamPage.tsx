
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamHeader from '@/components/team/TeamHeader';
import { AnimatedContainer } from '@/components/ui/animated-container';

// Mock data - in a real app, this would come from your database
const mockTeamMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin' as const,
    avatar: '',
    lastActive: '2 hours ago',
    tasksCompleted: 24
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'manager' as const,
    avatar: '',
    lastActive: '1 day ago',
    tasksCompleted: 18
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'user' as const,
    avatar: '',
    lastActive: '3 hours ago',
    tasksCompleted: 12
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'user' as const,
    avatar: '',
    lastActive: '5 minutes ago',
    tasksCompleted: 31
  }
];

export default function TeamPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (memberId: string, newRole: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role: newRole as any } : member
      )
    );
    toast({
      title: "Role updated",
      description: "Team member role has been successfully updated.",
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    toast({
      title: "Member removed",
      description: "Team member has been removed from the team.",
    });
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    // Mock invite logic - in a real app, you'd send an actual invitation
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail}`,
    });
    
    setInviteEmail('');
    setInviteRole('user');
    setShowInviteDialog(false);
  };

  const currentUserRole = user?.role || 'user';
  const avgCompletionRate = Math.round(
    teamMembers.reduce((acc, member) => acc + member.tasksCompleted, 0) / teamMembers.length
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <TeamHeader
        teamSize={teamMembers.length}
        avgCompletionRate={avgCompletionRate}
        onInviteClick={() => setShowInviteDialog(true)}
      />

      <AnimatedContainer animation="slide-up" delay={0.3}>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade" delay={0.4}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <AnimatedContainer 
              key={member.id} 
              animation="scale" 
              delay={0.5 + index * 0.1}
            >
              <TeamMemberCard
                member={member}
                onRoleChange={handleRoleChange}
                onRemove={handleRemoveMember}
                currentUserRole={currentUserRole}
              />
            </AnimatedContainer>
          ))}
        </div>
      </AnimatedContainer>

      {filteredMembers.length === 0 && (
        <AnimatedContainer animation="fade" delay={0.3}>
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No team members found</h3>
                <p className="text-sm">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Invite team members to get started.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      )}

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  {currentUserRole === 'admin' && (
                    <SelectItem value="admin">Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
