import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const checkIsActive = (href: string) => {
        // Jika href kosong/null
        if (!href) return false;

        // Ambil path-nya saja (misal: http://localhost:8000/community -> /community)
        let path = href;
        try {
            // Coba parsing sebagai URL, jika berhasil ambil pathname-nya
            if (href.startsWith('http')) {
                const urlObj = new URL(href);
                path = urlObj.pathname;
            }
        } catch (e) {
            // Jika bukan valid URL (misal relatif), biarkan apa adanya
        }
        // Gunakan logic strict equality atau startsWith sesuai kebutuhan
        return page.url === path || page.url.startsWith(path + '/');
    };
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={checkIsActive(
                                typeof item.href === 'string' ? item.href : item.href.url
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
