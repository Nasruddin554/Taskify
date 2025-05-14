
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';

export default function AppearanceForm() {
  const { user } = useAuth();
  const { updateAppearanceSettings, isSubmitting } = useUserSettings();
  const [theme, setTheme] = useState('system');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme_preference')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data?.theme_preference) {
            setTheme(data.theme_preference);
          }
        } catch (err) {
          console.error('Error fetching theme preference:', err);
        }
      }
    };
    
    fetchSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    await updateAppearanceSettings(theme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={theme === 'system' ? 'default' : 'outline'} 
            className="justify-center"
            onClick={() => setTheme('system')}
          >
            System
          </Button>
          <Button 
            variant={theme === 'light' ? 'default' : 'outline'} 
            className="justify-center"
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button 
            variant={theme === 'dark' ? 'default' : 'outline'} 
            className="justify-center"
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Compact Mode</p>
          <p className="text-sm text-muted-foreground">
            Display more content with less spacing
          </p>
        </div>
        <Switch 
          checked={compactMode}
          onCheckedChange={setCompactMode}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Animations</p>
          <p className="text-sm text-muted-foreground">
            Enable animations and transitions
          </p>
        </div>
        <Switch 
          checked={animations}
          onCheckedChange={setAnimations}
        />
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
