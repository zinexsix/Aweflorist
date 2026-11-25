import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    FolderTree,
    LayoutGrid,
    Package,
    ReceiptText,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { index as eventsIndex } from '@/routes/admin/events';
import { index as ordersIndex } from '@/routes/admin/orders';
import { index as productsIndex } from '@/routes/admin/products';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    // US-19 Latif: Produk
    {
        title: 'Produk',
        href: productsIndex(),
        icon: Package,
    },
    // US-20 Latif: Kategori, Acara
    {
        title: 'Kategori',
        href: categoriesIndex(),
        icon: FolderTree,
    },
    {
        title: 'Acara',
        href: eventsIndex(),
        icon: CalendarDays,
    },
    // US-21 Suci: Pesanan
    {
        title: 'Pesanan',
        href: ordersIndex(),
        icon: ReceiptText,
    },
    // US-22 Nabila: Status pesanan (bagian dari detail pesanan)
    // US-23 Suci: Dashboard (sudah tersedia)
    // US-24 Prety: Buket Custom
    // US-25 Prety: Stok
    // US-26 Nabila: Pembayaran (bagian dari detail pesanan)
    // US-27 Nabila: Pelanggan
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={adminDashboard()} prefetch>
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
