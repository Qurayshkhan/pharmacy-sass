import { Head, useForm } from '@inertiajs/react'
import { Plus, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import InputError from '@/components/input-error'
import Label from '@/components/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { store, store as StoreIndex } from '@/routes/stores'
import type { BreadcrumbItem } from '@/types'
const Stores = () => {
    const [isOpen, setIsOpen] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stores',
            href: StoreIndex().url,
        },
    ]

    const handleOpen = () => {
        setIsOpen(true);
    }

    const form = useForm({
        email: "",
    });

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
                                <TableHead className='border text-center'>Address</TableHead>
                                <TableHead className='border text-center'>Status</TableHead>
                                <TableHead className="border text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Hassan Pharmacy
                                </TableCell>
                                <TableCell>
                                    hassan@email.com
                                </TableCell>
                                <TableCell>
                                    +92 300 1234567
                                </TableCell>
                                <TableCell>
                                    LIC-102938dasas
                                </TableCell>
                                <TableCell>
                                    <Badge variant="default">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
        </AppLayout>

    )
}

export default Stores
