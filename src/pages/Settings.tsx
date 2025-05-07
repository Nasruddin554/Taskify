
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import UserAvatar from '@/components/dashboard/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }).optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    taskAssignments: true,
    taskUpdates: true,
    taskCompletions: true,
    reminders: true,
    emailNotifications: false,
  });
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    compactMode: false,
    animations: true,
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [accountAction, setAccountAction] = useState<'delete' | 'deactivate' | null>(null);
  
  // Default form values
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    setIsPasswordSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setIsPasswordSubmitting(false);
      passwordForm.reset();
    }, 1000);
  }

  function saveNotificationSettings() {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  }

  function saveAppearanceSettings() {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Appearance settings saved",
        description: "Your appearance settings have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  }

  function handleAccountAction() {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (accountAction === 'delete') {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
          variant: "destructive",
        });
      } else if (accountAction === 'deactivate') {
        toast({
          title: "Account deactivated",
          description: "Your account has been temporarily deactivated.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
      setIsConfirmDialogOpen(false);
      setAccountAction(null);
    }, 2000);
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                {user && <UserAvatar user={user} className="h-16 w-16" />}
                <div>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Avatar upload will be available in a future update.",
                    });
                  }}>
                    Change Avatar
                  </Button>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed in your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the email associated with your account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Maximum 500 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </> : 
                      <>
                        <Check className="mr-2 h-4 w-4" /> 
                        Save changes
                      </>
                    }
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <Button type="submit" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? 
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </> : 
                      "Change Password"
                    }
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings} disabled={isSubmitting}>
                {isSubmitting ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </> : 
                  "Save Preferences"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={appearanceSettings.theme === 'system' ? 'default' : 'outline'} 
                      className="justify-center"
                      onClick={() => setAppearanceSettings({
                        ...appearanceSettings, theme: 'system'
                      })}
                    >
                      System
                    </Button>
                    <Button 
                      variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'} 
                      className="justify-center"
                      onClick={() => setAppearanceSettings({
                        ...appearanceSettings, theme: 'light'
                      })}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'} 
                      className="justify-center"
                      onClick={() => setAppearanceSettings({
                        ...appearanceSettings, theme: 'dark'
                      })}
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
                    checked={appearanceSettings.compactMode}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({...appearanceSettings, compactMode: checked})
                    }
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
                    checked={appearanceSettings.animations}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({...appearanceSettings, animations: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAppearanceSettings} disabled={isSubmitting}>
                {isSubmitting ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </> : 
                  "Save Preferences"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-600 dark:text-orange-400">Account management</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Deactivating your account will temporarily hide your profile and content. 
                        Deleting your account is permanent and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setAccountAction('deactivate');
                      setIsConfirmDialogOpen(true);
                    }}
                  >
                    Deactivate Account
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setAccountAction('delete');
                      setIsConfirmDialogOpen(true);
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Account Actions */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {accountAction === 'delete' ? 'Delete Account?' : 'Deactivate Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accountAction === 'delete' 
                ? 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.'
                : 'Your account will be hidden and you will not receive notifications. You can reactivate your account at any time by logging in again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAccountAction}
              className={accountAction === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {accountAction === 'delete' ? 'Deleting...' : 'Deactivating...'}
                </>
              ) : (
                accountAction === 'delete' ? 'Delete Account' : 'Deactivate Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
