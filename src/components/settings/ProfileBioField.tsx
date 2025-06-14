
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

type ProfileBioFieldProps = {
  control: Control<any>;
};

export function ProfileBioField({ control }: ProfileBioFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
