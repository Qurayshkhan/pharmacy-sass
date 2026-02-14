import { Deferred, Head, useForm } from '@inertiajs/react'
import { Edit, Plus, Trash } from 'lucide-react'
import React, { useState } from 'react'
import InputError from '@/components/input-error'
import Label from '@/components/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import FullPageSpinner from '@/components/ui/full-page-spinner';
import { Input } from '@/components/ui/input'
import Pagination from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AppLayout from '@/layouts/app-layout'
import { deleteMethod, store, store as StoreIndex, update } from '@/routes/stores'
import type { BreadcrumbItem } from '@/types'
import type { Pagination as PaginationType } from '@/types/pagination'
import type { Stores, Stores as StoresType } from './types'


interface storeProps {
    stores: PaginationType<StoresType>,
}

const Stores = ({ stores }: storeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    // const [storeEdit, setStoreEdit] = useState<Stores | null>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [uuid, setUuid] = useState("");
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stores',
            href: StoreIndex().url,
        },
    ]


    const form = useForm({
        id: "",
        user_id: "",
        name: "",
        email: "",
        contact: "",
        address: "",
        is_active: false as boolean,
        branch: "",
    });
    const handleOpen = () => {
        setIsOpen(true);
        form.resetAndClearErrors();
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(store().url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsOpen(false);
            }
        })

    }

    const handleOpenEdit = (store: Stores) => {
        form.setData('id', String(store.id));
        form.setData('user_id', String(store.user_id));
        form.setData('name', store.user.name);
        form.setData('email', store.user.email);
        form.setData('contact', store?.contact ?? "");
        form.setData('address', store?.address ?? "");
        form.setData('branch', store?.branch ?? "");
        form.setData('is_active', Boolean(store?.is_active));
        setIsEditOpen(true);
    }

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.put(update().url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsEditOpen(false);
                form.resetAndClearErrors();
            }
        })
    }

    const handleOpenDelete = (uuid: string) => {
        setUuid(uuid);
        setIsDeleteOpen(true);
    }

    const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.delete(deleteMethod({ uuid: uuid }).url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stores" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-end">
                    <Button onClick={handleOpen}>
                        <Plus className="h-4 w-4" />
                        Add store
                    </Button>
                </div>
                <Deferred data={["stores"]} fallback={<FullPageSpinner />}>
                    <div className="rounded border overflow-x-auto">
                        <Table className='text-center'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='border text-center'>Name</TableHead>
                                    <TableHead className='border text-center'>Email</TableHead>
                                    <TableHead className='border text-center'>Contact</TableHead>
                                    <TableHead className='border text-center'>Branch</TableHead>
                                    <TableHead className='border text-center'>Status</TableHead>
                                    <TableHead className='border text-center'>Action</TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {stores && stores.data.length > 0 ?
                                    stores?.data?.map((store) => {
                                        return <TableRow key={store.id}>
                                            <TableCell className='border'>
                                                {store?.user?.name ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                {store?.user.email ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                {store?.contact ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {store?.branch ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                <Badge variant={store?.is_active ? "default" : "secondary"}>
                                                    {store?.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='flex gap-2 justify-center'>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={"outline"} size={"icon"} onClick={() => handleOpenEdit(store)}>
                                                            <Edit />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Edit store
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={"destructive"} size={"icon"} onClick={() => handleOpenDelete(store.user.uuid)}>
                                                            <Trash />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Dele store
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>

                                        </TableRow>
                                    })
                                    : <TableRow>
                                        <TableCell colSpan={5}>No record found.</TableCell>
                                    </TableRow>}
                            </TableBody>
                        </Table>
                        <div className='p-2'>
                            {stores?.links?.length > 0 && (
                                <Pagination
                                    links={stores.links}
                                    from={stores.from}
                                    to={stores.to}
                                    total={stores.total}
                                    infoLabel={`Showing ${stores.from || 0} to ${stores.to || 0} of ${stores.total} Stores`}
                                    className="mt-6"
                                />
                            )}

                        </div>
                    </div>
                </Deferred>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add Store
                        </DialogTitle>
                        <DialogDescription>
                            Send invite to stores to register
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className=''>
                            <Label required htmlFor='email'>
                                Email
                            </Label>
                            <Input name='email' id='email' placeholder='Enter email address' value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />

                            <InputError message={form.errors.email} />
                        </div>
                        <div className='flex justify-end gap-2 py-3'>
                            <Button type='button' variant={"secondary"} onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button type='submit' variant={"default"} disabled={form.processing}>
                                {form.processing && <Spinner />}
                                Send invite
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit Store
                        </DialogTitle>
                        <DialogDescription>
                            Update store information
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>

                        <div className='mb-2'>
                            <Label required htmlFor='name'>
                                Name
                            </Label>
                            <Input name='name' id='name' placeholder='Enter name' value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />

                            <InputError message={form.errors.name} />
                        </div>
                        <div className='mb-2'>
                            <Label required htmlFor='email'>
                                Email
                            </Label>
                            <Input name='email' id='email' placeholder='Enter email address' value={form.data.email} readOnly className='bg-gray-200' />

                            <InputError message={form.errors.email} />
                        </div>
                        <div className='mb-2'>
                            <Label htmlFor='contact' required>
                                Contact
                            </Label>
                            <Input name='contact' id='contact' placeholder='Enter contact' value={form.data.contact} onChange={(e) => form.setData('contact', e.target.value)} />

                            <InputError message={form.errors.contact} />
                        </div>
                        <div className='mb-2'>
                            <Label htmlFor='address' required>
                                Address
                            </Label>
                            <Input name='address' id='address' placeholder='Enter address' value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} />

                            <InputError message={form.errors.address} />
                        </div>
                        <div className='mb-2'>
                            <Label htmlFor='branch'>
                                Branch
                            </Label>
                            <Input name='branch' id='branch' placeholder='Enter branch' value={form.data.branch} onChange={(e) => form.setData('branch', e.target.value)} />

                            <InputError message={form.errors.address} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) =>
                                    form.setData('is_active', Boolean(checked))
                                }
                            />
                            <Label htmlFor="is_active">Active</Label>

                            <InputError message={form.errors.is_active} />
                        </div>
                        <div className='flex justify-end gap-2 py-3'>
                            <Button type='button' variant={"secondary"} onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type='submit' variant={"default"} disabled={form.processing}>
                                {form.processing && <Spinner />}
                                Update
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete Store
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this store.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDelete}>
                        <div className='flex justify-end gap-2'>
                            <Button type='button' variant={"secondary"} onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                            <Button type='submit' variant={"destructive"} disabled={form.processing}>
                                {form.processing && <Spinner />}
                                Delete it!
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout >

    )
}

export default Stores;
