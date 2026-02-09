import { Deferred, Form, Head, useForm } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus } from "lucide-react"
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Modal } from '@/components/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import AppLayout from '@/layouts/app-layout'
import { index, store, update, destroy } from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Category } from './types';

interface CategoryProps {
    categories?: PaginationType<Category>;
    category?: Category;
}

const Categories = ({ categories, category: editCategory }: CategoryProps) => {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: index().url,
        },
    ];

    const form = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    useEffect(() => {
        if (editCategory && !showModal) {
            const isActive = typeof editCategory.is_active === 'number'
                ? editCategory.is_active === 1
                : Boolean(editCategory.is_active);

            form.setData({
                name: editCategory.name || '',
                description: editCategory.description || '',
                is_active: isActive,
            });

            setTimeout(() => {
                setIsEdit(true);
                setEditingCategory(editCategory);
                setShowModal(true);
            }, 0);
        }

    }, [editCategory, form, showModal]);

    const handleOpenModal = () => {
        setIsEdit(false);
        form.reset();
        form.clearErrors();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setEditingCategory(null);
        form.reset();
        form.clearErrors();
    };

    const handleEdit = (category: Category) => {
        setIsEdit(true);
        setEditingCategory(category);
        const isActive = typeof category.is_active === 'number'
            ? category.is_active === 1
            : Boolean(category.is_active);
        form.setData({
            name: category.name || '',
            description: category.description || '',
            is_active: isActive,
        });
        form.clearErrors();
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (isEdit && editingCategory?.id) {
            form.put(update(editingCategory.id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseModal();
                    setEditingCategory(null);
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

    const handleDelete = (category: Category) => {
        setDeletingCategory(category);
        setOpenConfirmation(true);
    };

    if (!categories) {
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
            <Head title='Categories' />
            <Deferred data={['categories']} fallback={<FullPageSpinner />}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-end">
                        <Button variant="outline" onClick={handleOpenModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!categories?.data || categories.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">
                                                    No categories found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            categories.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name ?? 'N/A'}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {item.description ?? 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                item.is_active
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {item.is_active ? 'Active' : 'Inactive'}
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

                            {categories.links && categories.links.length > 0 && (
                                <Pagination
                                    links={categories.links}
                                    from={categories.from}
                                    to={categories.to}
                                    total={categories.total}
                                    infoLabel={`Showing ${categories.from || 0} to ${categories.to || 0} of ${categories.total} categories`}
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
                        {isEdit ? 'Edit Category' : 'Add Category'}
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
                                    placeholder="Category name"
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Write description..."
                                    disabled={form.processing}
                                />
                                <InputError message={form.errors.description} />
                            </div>
                            {isEdit &&
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="is_active"
                                        checked={form.data.is_active}
                                        onCheckedChange={(checked) =>
                                            form.setData('is_active', Boolean(checked))
                                        }
                                        disabled={form.processing}
                                    />
                                    <Label htmlFor="is_active">Active</Label>

                                </div>
                            }
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
                                    : (isEdit ? 'Update Category' : 'Add Category')}
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
                        Are you sure you want to delete this category?
                    </DialogTitle>
                    <DialogDescription>
                        Once this category is deleted, all of its data will be permanently
                        deleted. This action cannot be undone. Please click on confirm button
                        to permanently delete the category.
                    </DialogDescription>

                    <Form
                        {...destroy.form(deletingCategory?.id || 0)}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnSuccess
                        onSuccess={() => {
                            setOpenConfirmation(false);
                            setDeletingCategory(null);
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
                                                setDeletingCategory(null);
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
                                            data-test="confirm-delete-category-button"
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

export default Categories;
