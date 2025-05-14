
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

export interface TeamMember extends Omit<User, 'role'> {
  joinedAt: string;
  teamRole: string;
  lastActive?: string;
  role: string; // This will be the user's role, not necessarily the team role
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
      const teamMembers = data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unknown',
        email: profile.email || '',
        role: profile.role || 'user',
        avatar: profile.avatar,
        lastActive: profile.last_active,
        joinedAt: profile.team_members && profile.team_members[0] 
          ? profile.team_members[0].joined_at 
          : new Date().toISOString(),
        teamRole: profile.team_members && profile.team_members[0] 
          ? profile.team_members[0].role 
          : 'member'
      }));
      
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
  };
}
