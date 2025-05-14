
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isSubmitting } = useUserSettings();
  const { toast } = useToast();
  
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

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    const success = await updateProfile(data);
    if (success) {
      // Form was already reset in updateProfile
    }
  }

  const handleAvatarUpdate = () => {
    toast({
      title: "Feature coming soon",
      description: "Avatar upload will be available in a future update.",
    });
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAvatarUpdate}
          >
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
    </>
  );
}
