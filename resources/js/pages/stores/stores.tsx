import { Deferred, Head, useForm } from '@inertiajs/react'
import { Edit, Plus, Trash } from 'lucide-react'
import React, { useState } from 'react'
import InputError from '@/components/input-error'
import Label from '@/components/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
import { store, store as StoreIndex } from '@/routes/stores'
import type { BreadcrumbItem } from '@/types'
import type { Pagination as PaginationType } from '@/types/pagination'
import type { Stores as StoresType } from './types'


interface storeProps {
    stores: PaginationType<StoresType>,
}

const Stores = ({ stores }: storeProps) => {
    console.log("🚀 ~ Stores ~ stores:", stores)
    const [isOpen, setIsOpen] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stores',
            href: StoreIndex().url,
        },
    ]


    const form = useForm({
        email: "",
    });
    const handleOpen = () => {
        setIsOpen(true);
        form.clearErrors();
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
                            <Deferred data={["stores"]} fallback={<Spinner />}>
                                {stores && stores.data.length > 0 ?
                                    stores?.data?.map((item) => {
                                        return <TableRow key={item.id}>
                                            <TableCell className='border'>
                                                {item?.user?.name ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                {item?.user.email ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                {item?.contact ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {item?.branch ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className='border'>
                                                <Badge variant={item?.is_active ? "default" : "secondary"}>
                                                    {item?.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='flex gap-2 justify-center'>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={"outline"} size={"icon"}>
                                                            <Edit />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Edit store
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={"destructive"} size={"icon"}>
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
                                        <TableCell colSpan={3}>No record found.</TableCell>
                                    </TableRow>}
                            </Deferred>
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
        </AppLayout >

    )
}

export default Stores
