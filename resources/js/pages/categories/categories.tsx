import { Head } from '@inertiajs/react';
import { MoreHorizontalIcon, Plus } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { index } from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Category } from './types';
interface categoryProps {
    categories: PaginationType<Category>
}

const categories = ({ categories }: categoryProps) => {
    const breadcrumb: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: index().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title='Categories' />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-end">
                    <Button variant="outline">
                        <Plus /> Add Category
                    </Button>
                </div>
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className=''>Name</TableHead>
                                        <TableHead className=''>Status</TableHead>
                                        <TableHead className=''>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!categories?.data || categories?.data?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                Category not found
                                            </TableCell>
                                        </TableRow>
                                    ) : (categories.data.map((item) => {
                                        return <TableRow key={item?.id}>
                                            <TableCell>{item?.name ?? 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                    {item?.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontalIcon />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    // setPharmacy(pharmacy);
                                                                    // setOpenConfirmation(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableCell>
                                        </TableRow>
                                    })
                                    )
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        {categories.links && categories.links?.length > 0 && (
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
        </AppLayout>

    )
}

export default categories;
