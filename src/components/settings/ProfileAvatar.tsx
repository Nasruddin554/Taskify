
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAvatar } from '@/hooks/use-avatar-upload';

type ProfileAvatarProps = {
  user: { id: string; name?: string; avatar?: string } | null;
  updateProfile: (data: { avatar: string }) => Promise<boolean>;
};

export function ProfileAvatar({ user, updateProfile }: ProfileAvatarProps) {
  const { toast } = useToast();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpdate = () => fileInputRef.current?.click();

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // IMAGE VALIDATION: Only JPG/JPEG and ≤5MB
    const isJpeg =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      (file.name && /\.(jpe?g)$/i.test(file.name));
    const isSmallEnough = file.size <= 5 * 1024 * 1024;

    if (!isJpeg) {
      toast({
        title: "Invalid file type",
        description: "Only JPG or JPEG images are allowed.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    if (!isSmallEnough) {
      toast({
        title: "File too large",
        description: "Image must be 5MB or smaller.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setAvatarUploading(true);
    const avatarUrl = await uploadAvatar(user.id, file);
    if (avatarUrl) {
      await updateProfile({ avatar: avatarUrl });
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to upload new avatar. Please try again.",
        variant: "destructive",
      });
    }
    setAvatarUploading(false);
    e.target.value = "";
  };

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
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
          disabled={avatarUploading}
        >
          {avatarUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>Change Avatar</>
          )}
        </Button>
        <input
          type="file"
          accept="image/jpeg,image/jpg"
          ref={fileInputRef}
          className="hidden"
          onChange={onAvatarFileChange}
        />
      </div>
    </div>
  );
}
