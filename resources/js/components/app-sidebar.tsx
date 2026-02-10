import { Link, usePage } from '@inertiajs/react';
import { Box, LayoutGrid, Store, Package, Building2 } from 'lucide-react';
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
import { index as pharmaciesIndex } from '@/routes/pharmacies';
import { index as pharmacySuppliersIndex } from '@/routes/pharmacy-suppliers';
import { index as suppliersIndex } from '@/routes/suppliers';
import type { NavItem } from '@/types';
import type { SharedData } from '@/types';
import type { AuthUser } from '@/types/page-props';
import AppLogo from './app-logo';



export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user as unknown as AuthUser | null;
    const userType = user?.type;

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
    ];

    // Add Global Suppliers for Admin only
    if (userType === 1) { // User::TYPE_ADMIN
        mainNavItems.push({
            title: 'Global Suppliers',
            href: suppliersIndex(),
            icon: Package,
        });
    }

    // Add Pharmacy Suppliers for Pharmacy users
    if (userType === 2) { // User::TYPE_PHARMACY
        mainNavItems.push({
            title: 'My Suppliers',
            href: pharmacySuppliersIndex(),
            icon: Building2,
        });
    }

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
