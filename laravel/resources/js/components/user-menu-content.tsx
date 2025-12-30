import { useState } from 'react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { route } from 'ziggy-js';

interface UserMenuContentProps {
    user: User;
    variant?: 'default' | 'minimal';
}

export function UserMenuContent({ user, variant = 'default' }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.post(logout());
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLogoutDialog(true);
    };

    const dashboardHref =
        user.role === 'admin'
            ? route('admin.dashboard')
            : route('dashboard');

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {variant === 'minimal' ? (
                <>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full hover:cursor-pointer" href={dashboardHref} prefetch onClick={cleanup}>
                                <LayoutDashboard className="mr-2" />
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className="hover:cursor-pointer"
                        data-test="logout-button"
                    >
                        <LogOut className="mr-2" />
                        Log out
                    </DropdownMenuItem>
                </>
            ) : (
                <>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full hover:cursor-pointer" href={edit()} as="button" prefetch onClick={cleanup}>
                                <Settings className="mr-2" />
                                Pengaturan
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className="hover:cursor-pointer"
                        data-test="logout-button"
                    >
                        <LogOut className="mr-2" />
                        Log out
                    </DropdownMenuItem>
                </>
            )}

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari akun ini?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>
                            Ya, Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}