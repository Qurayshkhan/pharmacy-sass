import { Head, InfiniteScroll, router } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Label from '@/components/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import { highlightText } from '@/lib/utils'
import { index } from '@/routes/medicines'
import type { BreadcrumbItem } from '@/types'
import type { CursorPagination } from '@/types/pagination'
import type { Medicine } from './types'

interface MedicineProps {
    medicines: CursorPagination<Medicine>
    filters: {
        search?: string
    }
}

const Medicines = ({ medicines, filters }: MedicineProps) => {

    const tableHeader = useRef<HTMLDivElement | null>(null);
    const tableBody = useRef<HTMLDivElement | null>(null);

    const [localSearch, setLocalSearch] = useState(filters?.search ?? '')

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Global medicines', href: index().url },
    ]

    const debounceSearch = useDebouncedCallback((value: string) => {
        router.get(index().url, { search: value }, {
            preserveScroll: true,
            preserveState: true,
        })
    }, 300)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLocalSearch(value)
        debounceSearch(value)
    }

    const searchForHighlight = filters?.search ?? localSearch;

    const handleOpenModal = (item) => {
        console.log("🚀 ~ handleOpenModal ~ item:", item)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Global Medicines" />

            <div className="space-y-6 p-6">
                <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                        id="search"
                        value={localSearch}
                        onChange={handleSearch}
                        placeholder="Search by name, company"
                        className="w-full"
                    />
                </div>

                <Card>
                    <CardContent>
                        {medicines.data.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                No record found.
                            </div>
                        ) : (
                            <InfiniteScroll
                                data="medicines"
                                key={`medicines-${filters?.search ?? ''}`}
                                itemsElement={tableBody}
                                startElement={tableHeader}
                            >
                                <div className="overflow-x-auto">
                                    <div
                                        ref={tableHeader}
                                        className="bg-slate-50 border-b border-slate-200"
                                    >
                                        <div className="grid grid-cols-6 gap-4 px-6 py-3">
                                            <div className="text-sm font-semibold">Name</div>
                                            <div className="text-sm font-semibold">Company</div>
                                            <div className="text-sm font-semibold">Sale Price</div>
                                            <div className="text-sm font-semibold">Pack Size</div>
                                            <div className="text-sm font-semibold">MRP</div>
                                            <div className="text-sm font-semibold">Action</div>
                                        </div>
                                    </div>
                                    <div ref={tableBody}>
                                        {medicines.data.map(item => (
                                            <div
                                                key={item.id}
                                                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-slate-200 hover:bg-slate-50"
                                            >
                                                <div className="font-medium">
                                                    {highlightText(item.name, searchForHighlight)}
                                                </div>
                                                <div>
                                                    {highlightText(item.company, searchForHighlight)}
                                                </div>
                                                <div>
                                                    {item.sale_price
                                                        ? Number(item.sale_price).toFixed(2)
                                                        : '0.00'}
                                                </div>
                                                <div>{item.pack_size}</div>
                                                <div>
                                                    {item.mrp
                                                        ? Number(item.mrp).toFixed(2)
                                                        : '0.00'}
                                                </div>
                                                <div className="">
                                                    <Button type='button' onClick={() => handleOpenModal(item)}>
                                                        Add to my pharmacy
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </InfiniteScroll>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

export default Medicines
