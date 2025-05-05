
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}
