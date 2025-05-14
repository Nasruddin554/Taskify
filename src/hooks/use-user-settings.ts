
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useUserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    bio?: string;
  }) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          bio: data.bio,
          last_active: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateNotificationSettings = async (settings: Record<string, boolean>) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAppearanceSettings = async (theme: string) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          theme_preference: theme
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Appearance settings saved",
        description: "Your appearance settings have been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      toast({
        title: "Error",
        description: "Failed to update appearance settings. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    updateProfile,
    updatePassword,
    updateNotificationSettings,
    updateAppearanceSettings
  };
}
