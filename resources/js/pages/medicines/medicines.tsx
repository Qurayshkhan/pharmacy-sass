import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Label from '@/components/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { highlightText } from '@/lib/utils';
import { index } from '@/routes/medicines';
import type { BreadcrumbItem } from '@/types';
import type { CursorPagination } from '@/types/pagination';
import type { Medicine } from './types';
interface MedicineProps {
    medicines: CursorPagination<Medicine>,
    filters: {
        search?: string
    }
}

const Medicines = ({ medicines, filters }: MedicineProps) => {
    // Always use localSearch for immediate, responsive input updates
    // Initialize from filters.search on mount (e.g., when page loads with search param)
    const [localSearch, setLocalSearch] = useState(filters?.search ?? "");
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Global medicines', href: index().url },
    ];

    const debounceSearch = useDebouncedCallback((value) => {
        router.get(index().url, { search: value }, {
            preserveScroll: true,
            preserveState: true // Preserve state to maintain input focus
            // InfiniteScroll will still reset due to the key prop changing
        })
    }, 300)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setLocalSearch(value); // Update immediately for responsive UI - no delay!
        debounceSearch(value);
    }

    // Use filters.search for highlighting (what was actually searched on server)
    // Use localSearch for input display (immediate user feedback)
    const searchForHighlight = filters?.search ?? localSearch;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Global Medicines" />
            <div className="space-y-6 p-6">
                <div >
                    <Label htmlFor='search'>
                        Search
                    </Label>
                    <Input name='search' id='search' value={localSearch} onChange={handleSearch} placeholder='Search by name, company' className='w-full' />
                </div>
                <Card>
                    <CardContent>
                        {medicines.data && medicines.data.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                {/* <FullPageSpinner /> */}
                                No record found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <div className="w-full">
                                    <div className="bg-slate-50 border-b border-slate-200">
                                        <div className="grid grid-cols-5 gap-4 px-6 py-3">
                                            <div className="text-sm font-semibold text-slate-700">Name</div>
                                            <div className="text-sm font-semibold text-slate-700">Company</div>
                                            <div className="text-sm font-semibold text-slate-700">Sale Price</div>
                                            <div className="text-sm font-semibold text-slate-700">Pack Size</div>
                                            <div className="text-sm font-semibold text-slate-700">MRP</div>
                                        </div>
                                    </div>
                                    <InfiniteScroll
                                        data="medicines"
                                        key={`medicines-${filters?.search ?? ''}`}
                                    >
                                        {medicines.data.map((item) => (
                                            <div
                                                key={item.id}
                                                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="text-sm text-slate-900 font-medium">
                                                    {highlightText(item?.name, searchForHighlight)}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    {highlightText(item?.company, searchForHighlight)}
                                                </div>
                                                <div className="text-sm text-slate-900">{item?.sale_price ? parseFloat(item.sale_price).toFixed(2) : '0.00'}</div>
                                                <div className="text-sm text-slate-600">{item.pack_size}</div>
                                                <div className="text-sm text-slate-900">{item?.mrp ? parseFloat(item.mrp).toFixed(2) : '0.00'}</div>
                                            </div>
                                        ))}
                                    </InfiniteScroll>
                                </div>

                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );

}
export default Medicines;
