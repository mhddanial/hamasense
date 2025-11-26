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
import { dashboard, infoHama, riwayatDeteksi } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Home, ScanEye, History, Bug, MessageSquare, Newspaper } from 'lucide-react';
import AppLogo from './app-logo';
import RiwayatDeteksi from '@/pages/riwayatDeteksi';

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
        href: riwayatDeteksi(),
        icon: History,
    },
    {
        title: 'Info Hama',
        href: infoHama(),
        icon: Bug,
    },
    {
        title: 'Komunitas',
        href: "/community",
        icon: MessageSquare,
    },
    {
        title: 'Artikel',
        href: "/artikel",
        icon: Newspaper,
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