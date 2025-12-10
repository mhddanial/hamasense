'use client';
import { Head, usePage } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import { type SharedData } from '@/types';
import {
  Navbar, NavBody, NavItems, MobileNav, NavbarLogo,
  NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu
} from '@/components/ui/navbar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { UserMenuContent } from '@/components/user-menu-content';
import Footer from '@/components/ui/footer';
import clsx from 'clsx';
import { type User } from '@/types';
import { IconX } from '@tabler/icons-react';

type NavItem = { name: string; link: string };

type HeroBg = { imageUrl?: string; overlay?: string };
type HeroSlot = {
  content: ReactNode;              
  size?: 'full' | 'half';          
  bg?: HeroBg;                     
  className?: string;              
};

type Props = {
    title?: string;
    navItems: NavItem[];
    children: ReactNode;
    hero?: HeroSlot;
    user?: User;
};

export default function HomeLayout({ title, navItems, children, hero }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const getInitials = useInitials();
    const getAvatarUrl = () => {
        const avatar = auth.user?.avatar;

        if (!avatar) return null;

        return avatar.startsWith("http")
            ? avatar
            : `/storage/${avatar}`;
    };


    const avatarUrl = getAvatarUrl();

    return (
        <>
            <Head title={title ?? 'HAMASENSE'}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen bg-[#FDFDFC]">
                {/* Navbar */}
                <div className="w-full">
                    <Navbar>
                        <NavBody>
                            <NavbarLogo />
                            <NavItems items={navItems} />
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="rounded-full p-1 hover:bg-white/10">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage src={avatarUrl ?? undefined} alt={auth.user.name} />
                                                <AvatarFallback className="rounded-full bg-neutral-200 text-black">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 z-[1000]" align="end">
                                        <DropdownMenuSeparator />
                                        <UserMenuContent user={auth.user as any} variant='minimal' />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                ) : (
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    href="/login"
                                >
                                    Login / Registrasi
                                </NavbarButton>
                                )}
                            </div>
                        </NavBody>

                        {/* Mobile */}
                        <MobileNav>
                            <MobileNavHeader>
                                <NavbarLogo />
                                <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                />
                            </MobileNavHeader>

                            <MobileNavMenu
                                isOpen={isMobileMenuOpen}
                                onClose={() => setIsMobileMenuOpen(false)}
                                >
                                {/* Header Drawer */}
                                <div className="flex items-center justify-between mb-6">
                                    <NavbarLogo visible />
                                    <IconX className="text-black h-6 w-6" onClick={() => setIsMobileMenuOpen(false)} />
                                </div>

                                {/* User info (jika login) */}
                                {auth.user && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                            <AvatarImage src={avatarUrl ?? undefined} />
                                            <AvatarFallback className="rounded-full bg-neutral-200 text-black">
                                            {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-black">{auth.user.name}</p>
                                            <p className="text-sm text-gray-600">{auth.user.email}</p>
                                        </div>
                                    </div>
                                )}
                                <hr className="border-t border-gray-300 mb-6" />
                                <nav className="flex flex-col gap-4 mb-6">
                                    {navItems.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-black text-lg"
                                    >
                                        {item.name}
                                    </a>
                                    ))}
                                </nav>

                                <div className="mt-auto border-t pt-6">
                                    {auth.user ? (
                                    <NavbarButton
                                        href="/dashboard"
                                        className="w-full justify-center bg-primary text-white"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </NavbarButton>
                                    ) : (
                                    <NavbarButton
                                        href="/login"
                                        className="w-full justify-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Masuk / Registrasi
                                    </NavbarButton>
                                    )}
                                </div>
                                </MobileNavMenu>

                        </MobileNav>
                    </Navbar>
                </div>

                {hero?.content && (
                <section
                    className={clsx(
                        'relative flex items-center',
                        hero.size === 'full'
                            ? 'min-h-screen'
                            : 'min-h-[25vh] md:min-h-[50vh]',
                        hero.className
                    )}
                >

                    {hero.bg?.imageUrl && (
                    <div className="absolute inset-0">
                        <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${hero.bg.imageUrl}')` }}
                        >
                        <div className={clsx('absolute inset-0', hero.bg.overlay ?? 'bg-black/50')} />
                        </div>
                    </div>
                    )}

                    <div className="relative z-10 w-full">
                    {hero.content}
                    </div>
                </section>
                )}

                <main>{children}</main>

                <Footer />
            </div>
        </>
    );
}
