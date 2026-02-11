import { Deferred, Form, Head, useForm } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus } from "lucide-react"
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Modal } from '@/components/modal';
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
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout'
import { index, store, update, destroy } from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Supplier } from './types';

interface SupplierProps {
    suppliers?: PaginationType<Supplier>;
    supplier?: Supplier;
}

const Suppliers = ({ suppliers, supplier: editSupplier }: SupplierProps) => {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Global Suppliers',
            href: index().url,
        },
    ];

    const form = useForm({
        name: '',
        company_name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (editSupplier && !showModal) {
            form.setData({
                name: editSupplier.name || '',
                company_name: editSupplier.company_name || '',
                phone: editSupplier.phone || '',
                address: editSupplier.address || '',
            });

            setTimeout(() => {
                setIsEdit(true);
                setEditingSupplier(editSupplier);
                setShowModal(true);
            }, 0);
        }

    }, [editSupplier, form, showModal]);

    const handleOpenModal = () => {
        setIsEdit(false);
        form.reset();
        form.clearErrors();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setEditingSupplier(null);
        form.reset();
        form.clearErrors();
    };

    const handleEdit = (supplier: Supplier) => {
        setIsEdit(true);
        setEditingSupplier(supplier);
        form.setData({
            name: supplier.name || '',
            company_name: supplier.company_name || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (isEdit && editingSupplier?.id) {
            form.put(update(editingSupplier.id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseModal();
                    setEditingSupplier(null);
                },
            });
        } else {
            form.post(store().url, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        }
    };

    const handleDelete = (supplier: Supplier) => {
        setDeletingSupplier(supplier);
        setOpenConfirmation(true);
    };

    if (!suppliers) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-6">
                    <FullPageSpinner />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Global Suppliers' />
            <Deferred data={['suppliers']} fallback={<FullPageSpinner />}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-end">
                        <Button variant="outline" onClick={handleOpenModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Supplier
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!suppliers?.data || suppliers.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    No suppliers found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            suppliers.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name ?? 'N/A'}</TableCell>
                                                    <TableCell>{item.company_name ?? 'N/A'}</TableCell>
                                                    <TableCell>{item.phone ?? 'N/A'}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {item.address ?? 'N/A'}
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
                                                                <DropdownMenuItem
                                                                    onClick={() => handleEdit(item)}
                                                                >
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onClick={() => handleDelete(item)}
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

                            {suppliers.links && suppliers.links.length > 0 && (
                                <Pagination
                                    links={suppliers.links}
                                    from={suppliers.from}
                                    to={suppliers.to}
                                    total={suppliers.total}
                                    infoLabel={`Showing ${suppliers.from || 0} to ${suppliers.to || 0} of ${suppliers.total} suppliers`}
                                    className="mt-6"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Deferred>

            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="px-4 py-4">
                    <h1 className="text-xl font-semibold mb-4">
                        {isEdit ? 'Edit Supplier' : 'Add Supplier'}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" required>
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Supplier name"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="company_name">
                                    Company Name
                                </Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={form.data.company_name}
                                    onChange={(e) => form.setData('company_name', e.target.value)}
                                    placeholder="Company name"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.company_name} />
                            </div>
                            <div>
                                <Label htmlFor="phone">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    placeholder="Phone number"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.phone} />
                            </div>
                            <div>
                                <Label htmlFor="address">
                                    Address
                                </Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    placeholder="Address"
                                    disabled={form.processing}
                                    rows={3}
                                />
                                <InputError message={form.errors.address} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCloseModal}
                                disabled={form.processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing
                                    ? (isEdit ? 'Updating...' : 'Creating...')
                                    : (isEdit ? 'Update Supplier' : 'Add Supplier')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Dialog
                open={openConfirmation}
                onOpenChange={setOpenConfirmation}
            >
                <DialogContent>
                    <DialogTitle>
                        Are you sure you want to delete this supplier?
                    </DialogTitle>
                    <DialogDescription>
                        Once this supplier is deleted, all of its data will be permanently
                        deleted. This action cannot be undone. Please click on confirm button
                        to permanently delete the supplier.
                    </DialogDescription>

                    <Form
                        {...destroy.form(deletingSupplier?.id || 0)}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnSuccess
                        onSuccess={() => {
                            setOpenConfirmation(false);
                            setDeletingSupplier(null);
                        }}
                        className="space-y-6"
                    >
                        {({ processing }) => (
                            <>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setOpenConfirmation(false);
                                                setDeletingSupplier(null);
                                            }}
                                            disabled={processing}
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
                                            data-test="confirm-delete-supplier-button"
                                        >
                                            {processing ? 'Deleting...' : 'Confirm'}
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

export default Suppliers;
