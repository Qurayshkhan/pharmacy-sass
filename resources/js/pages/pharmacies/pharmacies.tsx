import { Deferred, Form, Head, Link } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus } from "lucide-react"
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FullPageSpinner from '@/components/ui/full-page-spinner';
import Pagination from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import AppLayout from '@/layouts/app-layout';
import { pharmacyCreate, adminEdit, pharmacyDestroy } from '@/routes/pharmacies';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Pharmacy } from './types';




interface PharmacyProps {
    pharmacies?: PaginationType<Pharmacy>;
}

const Pharmacies = ({ pharmacies }: PharmacyProps) => {
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>();
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
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
            <Head title='Pharmacies' />
            <Deferred data={['pharmacies']} fallback={<FullPageSpinner />}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Pharmacies</h1>
                        <Button variant="outline" asChild>
                            <Link href={pharmacyCreate()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Pharmacy
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pharmacy Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>License Number</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {!pharmacies?.data || pharmacies.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    No pharmacies found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pharmacies.data.map((pharmacy) => (
                                                <TableRow key={pharmacy.id}>
                                                    <TableCell>{pharmacy?.user?.name}</TableCell>
                                                    <TableCell>{pharmacy?.user?.email}</TableCell>
                                                    <TableCell>{pharmacy.contact}</TableCell>
                                                    <TableCell>{pharmacy.license_number ?? 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                pharmacy.user?.status === 1
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {pharmacy.user?.status === 1
                                                                ? 'Active '
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-8">
                                                                    <MoreHorizontalIcon />
                                                                    <span className="sr-only">Open menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={adminEdit(pharmacy.user?.uuid || '')}>
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        setPharmacy(pharmacy);
                                                                        setOpenConfirmation(true);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </DropdownMenuItem>

                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>

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
            <Dialog
                open={openConfirmation}
                onOpenChange={setOpenConfirmation}
            >

                <DialogContent>
                    <DialogTitle>
                        Are you sure you want to delete this account?
                    </DialogTitle>
                    <DialogDescription>
                        Once this account is deleted, all of its resources
                        and data will also be permanently deleted. Please
                        click on confirm button to
                        permanently delete pharmacy account.
                    </DialogDescription>

                    <Form
                        {...pharmacyDestroy.form({ uuid: String(pharmacy?.user?.uuid) })}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnSuccess
                        onSuccess={() => {
                            setOpenConfirmation(false);
                            setPharmacy(null);
                        }}
                        className="space-y-6"

                    >
                        {({ processing }) => (
                            <>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setOpenConfirmation(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        asChild
                                    >
                                        <button
                                            type="submit"
                                            data-test="confirm-delete-user-button"
                                        >
                                            Confirm
                                        </button>
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default Pharmacies;
