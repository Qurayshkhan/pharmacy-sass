import { Deferred } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FullPageSpinner from '@/components/ui/full-page-spinner';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Pharmacy } from './types';

interface PharmacyProps {
    pharmacies?: PaginationType<Pharmacy>;
}

const Pharmacies = ({ pharmacies }: PharmacyProps) => {
    console.log("🚀 ~ Pharmacies ~ pharmacies:", pharmacies);

    if (!pharmacies) {
        return (
            <AppLayout>
                <div className="space-y-6 p-6">
                    <FullPageSpinner />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Deferred data={['pharmacies']} fallback={<FullPageSpinner />}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">Pharmacies</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Total {pharmacies.total || 0} pharmacies
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pharmacy List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                                                Pharmacy Name
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                                                Contact
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                                                License Number
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!pharmacies.data || pharmacies.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-8 px-4 text-center text-muted-foreground"
                                                >
                                                    No pharmacies found
                                                </td>
                                            </tr>
                                        ) : (
                                            pharmacies.data.map((pharmacy, index) => (
                                                <tr
                                                    key={pharmacy.user_id || index}
                                                    className={cn(
                                                        'border-b border-border transition-colors',
                                                        'hover:bg-muted/50'
                                                    )}
                                                >
                                                    <td className="py-4 px-4">
                                                        <div className="font-medium">
                                                            {pharmacy.user?.name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-muted-foreground">
                                                            {pharmacy.user?.email || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-muted-foreground">
                                                            {pharmacy.contact || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-mono text-sm">
                                                            {pharmacy.license_number || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge
                                                            variant={
                                                                pharmacy.user?.status === 1
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {pharmacy.user?.status === 1
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pharmacies.links && pharmacies.links.length > 0 && (
                                <Pagination
                                    links={pharmacies.links}
                                    from={pharmacies.from}
                                    to={pharmacies.to}
                                    total={pharmacies.total}
                                    infoLabel={`Showing ${pharmacies.from || 0} to ${pharmacies.to || 0} of ${pharmacies.total} pharmacies`}
                                    className="mt-6"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Deferred>
        </AppLayout>
    );
};

export default Pharmacies;
