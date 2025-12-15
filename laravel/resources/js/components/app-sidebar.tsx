import { NavFooter } from '@/components/nav-footer';
import { route } from 'ziggy-js';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Home, ScanEye, History, Bug, MessageSquare } from 'lucide-react';
import AppLogo from './app-logo';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Home,
    },
    {
        title: 'Deteksi',
        href: route('detect.index'),
        icon: ScanEye,
    },
    {
        title: 'Riwayat',
        href: route('detect.history'),
        icon: History,
    },
    {
        title: 'Info Hama',
        href: route('pest.user.index'),
        icon: Bug,
    },
    {
        title: 'Komunitas',
        href: route('community.index'),
        icon: MessageSquare,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>

    );
}