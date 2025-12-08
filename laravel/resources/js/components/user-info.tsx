import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    // Handle avatar path logic
    const getAvatarUrl = () => {
        if (!user.avatar) return null;

        // Absolute URL (Google OAuth, CDN, external)
        if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
            return user.avatar;
        }

        // Local storage path from Laravel
        return `/storage/${user.avatar}`;
    };

    const avatarUrl = getAvatarUrl();

    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />

                <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>

                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
