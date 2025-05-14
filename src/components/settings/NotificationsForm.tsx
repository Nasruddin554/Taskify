
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NotificationSettings {
  taskAssignments: boolean;
  taskUpdates: boolean;
  taskCompletions: boolean;
  reminders: boolean;
  emailNotifications: boolean;
  [key: string]: boolean; // Index signature to allow use as Record<string, boolean>
}

export default function NotificationsForm() {
  const { user } = useAuth();
  const { updateNotificationSettings, isSubmitting } = useUserSettings();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    taskAssignments: true,
    taskUpdates: true,
    taskCompletions: true,
    reminders: true,
    emailNotifications: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('notification_settings')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data?.notification_settings) {
            // Safely parse the settings with explicit type casting and defaults
            const settings = data.notification_settings as Record<string, boolean>;
            setNotificationSettings({
              taskAssignments: settings.taskAssignments ?? true,
              taskUpdates: settings.taskUpdates ?? true,
              taskCompletions: settings.taskCompletions ?? true,
              reminders: settings.reminders ?? true,
              emailNotifications: settings.emailNotifications ?? false,
            });
          }
        } catch (err) {
          console.error('Error fetching notification settings:', err);
        }
      }
    };
    
    fetchSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    // NotificationSettings has index signature so it can be used directly
    await updateNotificationSettings(notificationSettings);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Task Assignments</p>
            <p className="text-sm text-muted-foreground">
              Receive notifications when tasks are assigned to you
            </p>
          </div>
          <Switch 
            checked={notificationSettings.taskAssignments}
            onCheckedChange={(checked) => 
              setNotificationSettings({...notificationSettings, taskAssignments: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Task Updates</p>
            <p className="text-sm text-muted-foreground">
              Receive notifications when your assigned tasks are updated
            </p>
          </div>
          <Switch 
            checked={notificationSettings.taskUpdates}
            onCheckedChange={(checked) => 
              setNotificationSettings({...notificationSettings, taskUpdates: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Task Completions</p>
            <p className="text-sm text-muted-foreground">
              Receive notifications when your assigned tasks are completed
            </p>
          </div>
          <Switch 
            checked={notificationSettings.taskCompletions}
            onCheckedChange={(checked) => 
              setNotificationSettings({...notificationSettings, taskCompletions: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reminders</p>
            <p className="text-sm text-muted-foreground">
              Receive reminders for upcoming due dates
            </p>
          </div>
          <Switch 
            checked={notificationSettings.reminders}
            onCheckedChange={(checked) => 
              setNotificationSettings({...notificationSettings, reminders: checked})
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </p>
          </div>
          <Switch 
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(checked) => 
              setNotificationSettings({...notificationSettings, emailNotifications: checked})
            }
          />
        </div>
      </div>

      <Button onClick={handleSaveSettings} disabled={isSubmitting} className="mt-4">
        {isSubmitting ? 
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </> : 
          "Save Preferences"
        }
      </Button>
    </div>
  );
}
