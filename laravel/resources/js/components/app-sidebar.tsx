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
import { community, dashboard, detect } from '@/routes';
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
        href: route('pest.index'),
        icon: Bug,
    },
    {
        title: 'Komunitas',
        href: community(),
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
                            <Link href={dashboard()} prefetch>
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