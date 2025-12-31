import { Link, usePage } from "@inertiajs/react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "../ui/sidebar"
import AppLogo from "../app-logo"
import { NavMain } from "../nav-main"
import { NavUser } from "../nav-user"
import { SharedData, type NavItem } from "@/types"
import { Bug, Home, Leaf, Newspaper, Users, Worm, MessageSquare } from "lucide-react"

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: Home
    },
    {
        title: 'Kelola Pengguna',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'Kelola Tanaman',
        href: '/admin/plant',
        icon: Leaf
    },
    {
        title: 'Kelola Hama',
        href: '/admin/pest',
        icon: Bug
    },
    {
        title: 'Kelola Artikel',
        href: '/admin/article',
        icon: Newspaper
    },
    {
        title: 'Kelola Penyakit',
        href: '/admin/disease',
        icon: Worm
    },
    {
        title: 'Kelola Komunitas',
        href: '/admin/community',
        icon: MessageSquare
    },
]

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    return (<>

        <SidebarProvider defaultOpen={isOpen}>
            <Sidebar collapsible="offcanvas" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size='lg' asChild>
                                <Link href={'/admin/dashboard'}>
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
            {children}
        </SidebarProvider>
    </>)
}