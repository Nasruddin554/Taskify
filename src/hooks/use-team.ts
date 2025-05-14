
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

export interface TeamMember extends Omit<User, 'role'> {
  joinedAt: string;
  teamRole: string;
  lastActive?: string;
  role: UserRole; // This will be the user's role as UserRole type
}

export function useTeam() {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch team members from profiles table with team_members data
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          avatar,
          last_active,
          team_members (
            joined_at,
            role
          )
        `)
        .order('name');
        
      if (error) {
        throw error;
      }

      // Transform the data to match our TeamMember interface
      const teamMembers: TeamMember[] = data.map(profile => {
        // Handle potentially missing team_members array
        const teamMember = profile.team_members && 
          Array.isArray(profile.team_members) && 
          profile.team_members.length > 0 
            ? profile.team_members[0] 
            : null;

        return {
          id: profile.id,
          name: profile.name || 'Unknown',
          email: profile.email || '',
          role: (profile.role as UserRole) || 'user',
          avatar: profile.avatar,
          lastActive: profile.last_active,
          joinedAt: teamMember ? teamMember.joined_at : new Date().toISOString(),
          teamRole: teamMember ? teamMember.role : 'member'
        };
      });
      
      setTeam(teamMembers);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Implement team member removal functionality
  const removeTeamMember = async (memberId: string) => {
    try {
      // Remove from team_members table
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', memberId);
      
      if (error) throw error;
      
      // Update local state
      setTeam(team.filter(member => member.id !== memberId));
      
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
      
      return true;
    } catch (err) {
      console.error('Error removing team member:', err);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Implement role management functionality
  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('user_id', memberId);
      
      if (error) throw error;
      
      // Update local state
      setTeam(team.map(member => 
        member.id === memberId 
          ? { ...member, teamRole: newRole } 
          : member
      ));
      
      toast({
        title: "Success",
        description: `Role updated to ${newRole}`,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating team member role:', err);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const inviteMember = async (email: string, role: string) => {
    try {
      // In a real application, this would send an invitation email
      // For now we'll just show a toast message
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    team,
    isLoading,
    error,
    fetchTeamMembers,
    inviteMember,
    removeTeamMember,
    updateMemberRole
  };
}
