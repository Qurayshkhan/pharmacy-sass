import { Deferred, Form, Head, useForm } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus, Copy } from "lucide-react"
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout'
import { index, store, update, destroy, copyFromGlobal } from '@/routes/pharmacy-suppliers';
import type { BreadcrumbItem } from '@/types';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { PharmacySupplier, GlobalSupplier } from './types';

interface PharmacySupplierProps {
    pharmacySuppliers?: PaginationType<PharmacySupplier>;
    pharmacySupplier?: PharmacySupplier;
    globalSuppliers?: GlobalSupplier[];
}

const PharmacySuppliers = ({ pharmacySuppliers, pharmacySupplier: editPharmacySupplier, globalSuppliers = [] }: PharmacySupplierProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<PharmacySupplier | null>(null);
    const [deletingSupplier, setDeletingSupplier] = useState<PharmacySupplier | null>(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pharmacy Suppliers',
            href: index().url,
        },
    ];

    const form = useForm({
        supplier_name: '',
        company_name: '',
        contact: '',
        address: '',
    });

    const copyForm = useForm({
        global_supplier_id: '',
        supplier_name: '',
        company_name: '',
        contact: '',
        address: '',
    });

    useEffect(() => {
        if (editPharmacySupplier && !showModal) {
            form.setData({
                supplier_name: editPharmacySupplier.supplier_name || '',
                company_name: editPharmacySupplier.company_name || '',
                contact: editPharmacySupplier.contact || '',
                address: editPharmacySupplier.address || '',
            });

            setTimeout(() => {
                setIsEdit(true);
                setEditingSupplier(editPharmacySupplier);
                setShowModal(true);
            }, 0);
        }

    }, [editPharmacySupplier, form, showModal]);

    const handleOpenModal = () => {
        setIsEdit(false);
        form.reset();
        form.clearErrors();
        setShowModal(true);
    };

    const handleOpenCopyModal = () => {
        copyForm.reset();
        copyForm.clearErrors();
        setShowCopyModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setEditingSupplier(null);
        form.reset();
        form.clearErrors();
    };

    const handleCloseCopyModal = () => {
        setShowCopyModal(false);
        copyForm.reset();
        copyForm.clearErrors();
    };

    const handleEdit = (supplier: PharmacySupplier) => {
        setIsEdit(true);
        setEditingSupplier(supplier);
        form.setData({
            supplier_name: supplier.supplier_name || '',
            company_name: supplier.company_name || '',
            contact: supplier.contact || '',
            address: supplier.address || '',
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleGlobalSupplierSelect = (supplierId: string) => {
        const selectedSupplier = globalSuppliers.find(s => s.id.toString() === supplierId);
        if (selectedSupplier) {
            copyForm.setData({
                global_supplier_id: supplierId,
                supplier_name: selectedSupplier.name || '',
                company_name: selectedSupplier.company_name || '',
                contact: selectedSupplier.phone || '',
                address: selectedSupplier.address || '',
            });
        }
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

    const handleCopySubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        copyForm.post(copyFromGlobal().url, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseCopyModal();
            },
        });
    };

    const handleDelete = (supplier: PharmacySupplier) => {
        setDeletingSupplier(supplier);
        setOpenConfirmation(true);
    };

    if (!pharmacySuppliers) {
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
            <Head title='Pharmacy Suppliers' />
            <Deferred data={['pharmacySuppliers', 'globalSuppliers']} fallback={<FullPageSpinner />}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-end gap-2">
                        {globalSuppliers && globalSuppliers.length > 0 && (
                            <Button variant="outline" onClick={handleOpenCopyModal}>
                                <Copy className="mr-2 h-4 w-4" />
                                Add from Global Supplier
                            </Button>
                        )}
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
                                            <TableHead>Supplier Name</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!pharmacySuppliers?.data || pharmacySuppliers.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    No suppliers found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pharmacySuppliers.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.supplier_name ?? 'N/A'}</TableCell>
                                                    <TableCell>{item.company_name ?? 'N/A'}</TableCell>
                                                    <TableCell>{item.contact ?? 'N/A'}</TableCell>
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

                            {pharmacySuppliers.links && pharmacySuppliers.links.length > 0 && (
                                <Pagination
                                    links={pharmacySuppliers.links}
                                    from={pharmacySuppliers.from}
                                    to={pharmacySuppliers.to}
                                    total={pharmacySuppliers.total}
                                    infoLabel={`Showing ${pharmacySuppliers.from || 0} to ${pharmacySuppliers.to || 0} of ${pharmacySuppliers.total} suppliers`}
                                    className="mt-6"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Deferred>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="px-4 py-4">
                    <h1 className="text-xl font-semibold mb-4">
                        {isEdit ? 'Edit Supplier' : 'Add Supplier'}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="supplier_name" required>
                                    Supplier Name
                                </Label>
                                <Input
                                    id="supplier_name"
                                    name="supplier_name"
                                    value={form.data.supplier_name}
                                    onChange={(e) => form.setData('supplier_name', e.target.value)}
                                    placeholder="Supplier name"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.supplier_name} />
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
                                <Label htmlFor="contact">
                                    Contact
                                </Label>
                                <Input
                                    id="contact"
                                    name="contact"
                                    value={form.data.contact}
                                    onChange={(e) => form.setData('contact', e.target.value)}
                                    placeholder="Contact number"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.contact} />
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

            {/* Copy from Global Modal */}
            <Modal show={showCopyModal} onClose={handleCloseCopyModal}>
                <div className="px-4 py-4">
                    <h1 className="text-xl font-semibold mb-4">
                        Add from Global Supplier
                    </h1>
                    <form onSubmit={handleCopySubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="global_supplier_id" required>
                                    Select Global Supplier
                                </Label>
                                <Select
                                    value={copyForm.data.global_supplier_id}
                                    onValueChange={handleGlobalSupplierSelect}
                                    disabled={copyForm.processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a global supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {globalSuppliers.map((supplier) => (
                                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                {supplier.name} {supplier.company_name ? `(${supplier.company_name})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={copyForm.errors.global_supplier_id} />
                            </div>
                            <div>
                                <Label htmlFor="supplier_name" required>
                                    Supplier Name
                                </Label>
                                <Input
                                    id="supplier_name"
                                    name="supplier_name"
                                    value={copyForm.data.supplier_name}
                                    onChange={(e) => copyForm.setData('supplier_name', e.target.value)}
                                    placeholder="Supplier name"
                                    disabled={copyForm.processing}
                                />
                                <InputError message={copyForm.errors.supplier_name} />
                            </div>
                            <div>
                                <Label htmlFor="company_name">
                                    Company Name
                                </Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={copyForm.data.company_name}
                                    onChange={(e) => copyForm.setData('company_name', e.target.value)}
                                    placeholder="Company name"
                                    disabled={copyForm.processing}
                                />
                                <InputError message={copyForm.errors.company_name} />
                            </div>
                            <div>
                                <Label htmlFor="contact">
                                    Contact
                                </Label>
                                <Input
                                    id="contact"
                                    name="contact"
                                    value={copyForm.data.contact}
                                    onChange={(e) => copyForm.setData('contact', e.target.value)}
                                    placeholder="Contact number"
                                    disabled={copyForm.processing}
                                />
                                <InputError message={copyForm.errors.contact} />
                            </div>
                            <div>
                                <Label htmlFor="address">
                                    Address
                                </Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={copyForm.data.address}
                                    onChange={(e) => copyForm.setData('address', e.target.value)}
                                    placeholder="Address"
                                    disabled={copyForm.processing}
                                    rows={3}
                                />
                                <InputError message={copyForm.errors.address} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCloseCopyModal}
                                disabled={copyForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={copyForm.processing}>
                                {copyForm.processing ? 'Adding...' : 'Add Supplier'}
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

export default PharmacySuppliers;
