
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TeamRole, Team, TeamMember } from '@/types';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  createTeam: (name: string, description?: string) => Promise<Team | null>;
  updateTeam: (teamId: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  joinTeamByCode: (code: string) => Promise<boolean>;
  leaveTeam: (teamId: string) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  getTeamMembers: (teamId: string) => Promise<TeamMember[]>;
  changeTeamMemberRole: (teamMemberId: string, role: TeamRole) => Promise<void>;
  removeTeamMember: (teamMemberId: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's teams when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserTeams = async () => {
    try {
      setIsLoading(true);
      
      // Get teams the user is a member of
      const { data: memberships, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);
        
      if (membershipError) throw membershipError;
      
      if (memberships && memberships.length > 0) {
        const teamIds = memberships.map(m => m.team_id);
        
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .in('id', teamIds);
          
        if (teamsError) throw teamsError;
        
        const formattedTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.name,
          description: team.description || undefined,
          createdAt: team.created_at,
          createdBy: team.created_by,
          joinCode: team.join_code,
          avatar: team.avatar || undefined
        })) || [];
        
        setTeams(formattedTeams);
        
        // If we found teams but there's no current team selected, set the first one
        if (formattedTeams.length > 0 && !currentTeam) {
          setCurrentTeam(formattedTeams[0]);
          // Also fetch members for this team
          await getTeamMembers(formattedTeams[0].id);
        }
      } else {
        setTeams([]);
        setCurrentTeam(null);
      }
    } catch (error: any) {
      console.error('Error fetching user teams:', error.message);
      toast({
        title: "Error fetching teams",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (name: string, description?: string): Promise<Team | null> => {
    try {
      if (!user) throw new Error("You must be logged in to create a team");
      
      // Generate a random join code for the team
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_team_join_code');
        
      if (joinCodeError) throw joinCodeError;
      
      const joinCode = joinCodeData || Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Create the team
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name,
          description,
          created_by: user.id,
          join_code: joinCode,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Add the creator as an admin team member
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: data.id,
            user_id: user.id,
            role: 'admin'
          });
          
        if (memberError) throw memberError;
        
        // Format the team data
        const formattedTeam: Team = {
          id: data.id,
          name: data.name,
          description: data.description || undefined,
          createdAt: data.created_at,
          createdBy: data.created_by,
          joinCode: data.join_code,
          avatar: data.avatar || undefined
        };
        
        // Update local state
        setTeams(prev => [...prev, formattedTeam]);
        setCurrentTeam(formattedTeam);
        
        toast({
          title: "Team created",
          description: `The team "${name}" has been created successfully.`,
        });
        
        return formattedTeam;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating team:', error.message);
      toast({
        title: "Error creating team",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeam = async (teamId: string, data: Partial<Team>) => {
    try {
      // Convert from our frontend model to DB schema
      const dbData: any = {};
      if (data.name) dbData.name = data.name;
      if (data.description !== undefined) dbData.description = data.description;
      if (data.avatar !== undefined) dbData.avatar = data.avatar;
      
      const { error } = await supabase
        .from('teams')
        .update(dbData)
        .eq('id', teamId);
        
      if (error) throw error;
      
      // Update local state
      setTeams(prev => prev.map(team => 
        team.id === teamId ? { ...team, ...data } : team
      ));
      
      if (currentTeam?.id === teamId) {
        setCurrentTeam(prev => prev ? { ...prev, ...data } : null);
      }
      
      toast({
        title: "Team updated",
        description: "The team details have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating team:', error.message);
      toast({
        title: "Error updating team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
        
      if (error) throw error;
      
      // Update local state
      setTeams(prev => prev.filter(team => team.id !== teamId));
      
      if (currentTeam?.id === teamId) {
        setCurrentTeam(teams.length > 0 ? teams[0] : null);
      }
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting team:', error.message);
      toast({
        title: "Error deleting team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const joinTeamByCode = async (code: string): Promise<boolean> => {
    try {
      if (!user) throw new Error("You must be logged in to join a team");
      
      // Find the team by join code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('join_code', code)
        .single();
        
      if (teamError) throw new Error("Invalid team code or team not found");
      
      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single();
        
      if (existingMember) {
        toast({
          title: "Already a member",
          description: "You are already a member of this team.",
        });
        return true;
      }
      
      // Add user to the team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'member'
        });
        
      if (joinError) throw joinError;
      
      // Format the team data and update local state
      const formattedTeam: Team = {
        id: team.id,
        name: team.name,
        description: team.description || undefined,
        createdAt: team.created_at,
        createdBy: team.created_by,
        joinCode: team.join_code,
        avatar: team.avatar || undefined
      };
      
      // Update local state
      setTeams(prev => [...prev, formattedTeam]);
      setCurrentTeam(formattedTeam);
      
      toast({
        title: "Team joined",
        description: `You have successfully joined the team "${team.name}".`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error joining team:', error.message);
      toast({
        title: "Error joining team",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      if (!user) throw new Error("You must be logged in");
      
      // Check if user is the team creator
      const team = teams.find(t => t.id === teamId);
      if (team?.createdBy === user.id) {
        throw new Error("As the team creator, you cannot leave the team. You must delete it instead.");
      }
      
      // Remove the user from the team
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setTeams(prev => prev.filter(team => team.id !== teamId));
      
      if (currentTeam?.id === teamId) {
        setCurrentTeam(teams.length > 0 ? teams[0] : null);
      }
      
      toast({
        title: "Team left",
        description: "You have successfully left the team.",
      });
    } catch (error: any) {
      console.error('Error leaving team:', error.message);
      toast({
        title: "Error leaving team",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    try {
      // First, fetch all team members for the specified team
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);
        
      if (memberError) throw memberError;
      
      // For each team member, fetch their profile data
      const members: TeamMember[] = [];
      
      for (const member of memberData || []) {
        // Fetch the user profile separately
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, avatar')
          .eq('id', member.user_id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
        }
        
        // Create the team member object with correct typing
        members.push({
          id: member.id,
          teamId: member.team_id,
          userId: member.user_id,
          role: member.role as TeamRole, // Cast the role to TeamRole
          joinedAt: member.joined_at,
          user: profile ? {
            name: profile.name || 'Unknown User',
            email: profile.email || '',
            avatar: profile.avatar
          } : undefined
        });
      }
      
      setTeamMembers(members);
      return members;
    } catch (error: any) {
      console.error('Error fetching team members:', error.message);
      return [];
    }
  };

  const changeTeamMemberRole = async (teamMemberId: string, role: TeamRole) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('id', teamMemberId);
        
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => prev.map(member => 
        member.id === teamMemberId ? { ...member, role } : member
      ));
      
      toast({
        title: "Role updated",
        description: `The team member's role has been updated to ${role}.`,
      });
    } catch (error: any) {
      console.error('Error changing role:', error.message);
      toast({
        title: "Error changing role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeTeamMember = async (teamMemberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', teamMemberId);
        
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => prev.filter(member => member.id !== teamMemberId));
      
      toast({
        title: "Member removed",
        description: "The team member has been removed successfully.",
      });
    } catch (error: any) {
      console.error('Error removing team member:', error.message);
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        teamMembers,
        isLoading,
        createTeam,
        updateTeam,
        deleteTeam,
        joinTeamByCode,
        leaveTeam,
        setCurrentTeam,
        getTeamMembers,
        changeTeamMemberRole,
        removeTeamMember
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
