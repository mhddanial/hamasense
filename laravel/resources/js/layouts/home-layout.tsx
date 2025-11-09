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

type NavItem = { name: string; link: string };

type HeroBg = { imageUrl?: string; overlay?: string };
type HeroSlot = {
  content: ReactNode;              // komponen teks/CTA hero kamu
  size?: 'full' | 'half';          // full = 100vh, half = 50vh (default: half)
  bg?: HeroBg;                     // background untuk hero saja
  className?: string;              // opsional: extra class
};

type Props = {
    title?: string;
    navItems: NavItem[];
    children: ReactNode;
    hero?: HeroSlot;
};

export default function HomeLayout({ title, navItems, children, hero }: Props) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                                    <Button variant="ghost" className="size-10 rounded-full p-1 hover:bg-white/10">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar ?? undefined} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
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
                            {navItems.map((item, idx) => (
                            <a key={`mobile-link-${idx}`} href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-black/100">
                                <span className="block">{item.name}</span>
                            </a>
                            ))}

                            {auth.user ? (
                            <NavbarButton
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="justify-start gap-3 rounded-lg border border-white/20 px-4 py-2 text-left text-black/100"
                                href="/dashboard"
                            >
                                Dashboard
                            </NavbarButton>
                            ) : (
                            <NavbarButton
                                onClick={() => setIsMobileMenuOpen(false)}
                                href="/login"
                            >
                                Masuk / Registrasi
                            </NavbarButton>
                            )}
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>
                </div>

                {/* HERO (opsional) */}
                {hero?.content && (
                <section
                    className={clsx(
                    'relative flex items-center',
                    hero.size === 'full' ? 'min-h-screen' : 'min-h-[50vh]',
                    hero.className
                    )}
                >
                    {/* BG hero hanya berlaku untuk area hero */}
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

                    {/* Konten hero */}
                    <div className="relative z-10 w-full">
                    {hero.content}
                    </div>
                </section>
                )}

                {/* Page content (di bawah hero) */}
                <main>{children}</main>

                <Footer />
            </div>
        </>
    );
}
