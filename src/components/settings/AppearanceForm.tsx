
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Button } from '@/components/ui/button';
import { Loader2, Sun, Moon, Monitor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AppearanceForm() {
  const { user } = useAuth();
  const { updateAppearanceSettings, isSubmitting } = useUserSettings();
  const { toast } = useToast();
  const [theme, setTheme] = useState('system');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    // Apply theme from local storage on component mount
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    
    // Apply the theme to the document
    if (savedTheme === 'system') {
      applySystemTheme();
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applySystemTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
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
            
            // Apply theme
            if (data.theme_preference === 'system') {
              applySystemTheme();
            } else {
              document.documentElement.setAttribute('data-theme', data.theme_preference);
            }
            
            // Save to localStorage for persistence across sessions
            localStorage.setItem('theme', data.theme_preference);
          }
        } catch (err) {
          console.error('Error fetching theme preference:', err);
        }
      }
    };
    
    fetchSettings();
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [user, theme]);

  const applySystemTheme = () => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // Apply the theme immediately
    if (newTheme === 'system') {
      applySystemTheme();
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    
    // Save to localStorage for persistence across sessions
    localStorage.setItem('theme', newTheme);
    
    // Show a toast to inform the user
    toast({
      title: "Theme updated",
      description: `Theme has been changed to ${newTheme}`,
    });
  };

  const handleSaveSettings = async () => {
    await updateAppearanceSettings(theme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant={theme === 'system' ? 'default' : 'outline'} 
            className="flex flex-col items-center gap-2 py-3 h-auto px-5"
            onClick={() => handleThemeChange('system')}
          >
            <Monitor className="w-5 h-5" />
            <span>System</span>
          </Button>
          <Button 
            variant={theme === 'light' ? 'default' : 'outline'} 
            className="flex flex-col items-center gap-2 py-3 h-auto px-5"
            onClick={() => handleThemeChange('light')}
          >
            <Sun className="w-5 h-5" />
            <span>Light</span>
          </Button>
          <Button 
            variant={theme === 'dark' ? 'default' : 'outline'} 
            className="flex flex-col items-center gap-2 py-3 h-auto px-5"
            onClick={() => handleThemeChange('dark')}
          >
            <Moon className="w-5 h-5" />
            <span>Dark</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
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

      <Button onClick={handleSaveSettings} disabled={isSubmitting} className="mt-6">
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
