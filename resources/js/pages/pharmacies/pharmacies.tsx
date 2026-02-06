import { Deferred, Form, Head } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus } from "lucide-react"
import { useState } from 'react';
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogHeader } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FullPageSpinner from '@/components/ui/full-page-spinner';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import AppLayout from '@/layouts/app-layout';
import { store, update } from '@/routes/pharmacies';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Pharmacy } from './types';




interface PharmacyProps {
    pharmacies?: PaginationType<Pharmacy>;
}

const Pharmacies = ({ pharmacies }: PharmacyProps) => {

    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [open, setOpen] = useState(false);


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
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <h1 className="text-2xl font-semibold">Pharmacies</h1>

                            <Dialog>
                                <form>
                                    <DialogTrigger asChild>
                                        <Button variant="outline"> <Plus /> Add Pharmacy</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle>Add Pharmacy</DialogTitle>
                                        </DialogHeader>
                                        <Form {...store.form()} method='POST'>
                                            {({ processing, errors }) => (
                                                <>

                                                    <Label htmlFor="email" required>Email</Label>
                                                    <Input id="email" name="email" placeholder='Enter email address' />
                                                    <InputError
                                                        message={errors.email}
                                                        className="mt-2"
                                                    />
                                                    <DialogFooter className='py-4'>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="submit" disabled={processing}>
                                                            {processing && <Spinner />}
                                                            Send Invite
                                                        </Button>
                                                    </DialogFooter>
                                                </>
                                            )}
                                        </Form>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        </div>
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
                                                                ? 'Active'
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
                                                                <DropdownMenuItem onSelect={() => {
                                                                    setPharmacy(pharmacy);
                                                                    setOpen(true)
                                                                }
                                                                }>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem variant="destructive">
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pharmacy</DialogTitle>
                    </DialogHeader>
                    <Form
                        {...update.form()}
                        onSuccess={() => {
                            setOpen(false);
                            setPharmacy(null);
                        }}
                        options={{
                            preserveScroll: true,
                        }}
                    >

                        {({ processing, resetAndClearErrors, errors }) => (
                            <>
                                <input type="hidden" name='uuid' value={String(pharmacy?.user?.uuid)} />
                                <input type="hidden" name='is_update_pharmacy' defaultValue={String(true)} />
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" required>Pharmacy
                                            name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            defaultValue={String(pharmacy?.user?.name)}
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>



                                    <div className="grid gap-2">
                                        <Label htmlFor="license_number" required>License number</Label>
                                        <Input
                                            id="license_number"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="license_number"
                                            placeholder="License number"
                                            defaultValue={String(pharmacy?.license_number)}
                                        />
                                        <InputError
                                            message={errors.license_number}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact" required>Contact</Label>
                                        <Input
                                            id="contact"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="contact"
                                            placeholder="Contact number"
                                            defaultValue={String(pharmacy?.contact)}
                                        />
                                        <InputError
                                            message={errors.contact}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="branch">Branch Name (optional)</Label>
                                        <Input
                                            id="branch"
                                            type="text"
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="branch"
                                            placeholder="Branch name"
                                            defaultValue={String(pharmacy?.branch)}
                                        />
                                        <InputError
                                            message={errors.branch}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address" required>Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="address"
                                            placeholder="Address"
                                            defaultValue={String(pharmacy?.address)}
                                        />
                                        <InputError
                                            message={errors.address}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="gap-2 py-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => {
                                                resetAndClearErrors();
                                                setOpen(false);
                                                setPharmacy(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        type='submit'
                                        variant="default"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Update
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
};

export default Pharmacies;
