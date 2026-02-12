import { Link, usePage } from '@inertiajs/react';
import { Box, LayoutGrid, Store, Package, Building2, ClipboardPlus } from 'lucide-react';
// import { NavFooter } from '@/components/nav-footer';
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
import { index as categories } from '@/routes/categories';
import { index as medicines } from '@/routes/medicines';
import { index as mySuppliersIndex } from '@/routes/my-suppliers';
import { index as pharmaciesIndex } from '@/routes/pharmacies';
import { index as suppliersIndex } from '@/routes/suppliers';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';



export function AppSidebar() {

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Pharmacies',
            href: pharmaciesIndex(),
            icon: Store,
        },
        {
            title: 'Categories',
            href: categories(),
            icon: Box,
        },
        {
            title: 'Global suppliers',
            href: suppliersIndex(),
            icon: Package,
        },
        {
            title: 'Global medicines',
            href: medicines(),
            icon: ClipboardPlus,
        },
        {
            title: 'My Suppliers',
            href: mySuppliersIndex(),
            icon: Building2,
        },
    ];


    return (
        <Sidebar collapsible="icon" variant="floating">
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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
