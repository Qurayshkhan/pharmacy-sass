import { Head, InfiniteScroll, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Label from '@/components/label';
import { Card, CardContent } from '@/components/ui/card';
import FullPageSpinner from '@/components/ui/full-page-spinner';
import { Input } from '@/components/ui/input';

import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/medicines';
import type { BreadcrumbItem } from '@/types';
import type { Pagination } from '@/types/pagination';
import type { Medicine } from './types';

interface MedicineProps {
    medicines: Pagination<Medicine>,
    filters: {
        search?: string
    }
}

const Medicines = ({ medicines, filters }: MedicineProps) => {
    console.log("🚀 ~ Medicines ~ filters:", filters)
    console.log("🚀 ~ Medicines ~ medicines:", medicines)
    // const { medicines, loading, error, search, searchQuery } = useMedicines();

    const [search, setSearch] = useState(filters?.search ?? "");
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Global medicines', href: index().url },
    ];


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                index().url,
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            )
        }, 400)

        return () => clearTimeout(delayDebounce)
    }, [search])



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Global Medicines" />
            <div className="space-y-6 p-6">
                <div>
                    <Label htmlFor='search'>
                        Search
                    </Label>
                    <Input name='search' id='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by name, company' className='w-full' />
                </div>
                <Card>
                    <CardContent>
                        {medicines.data && medicines.data.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <FullPageSpinner />
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
                                    <InfiniteScroll data="medicines">
                                        {medicines.data.map((item, index) => (
                                            <div
                                                key={item.id || index}
                                                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="text-sm text-slate-900 font-medium">{item?.name}</div>
                                                <div className="text-sm text-slate-600">{item?.company}</div>
                                                <div className="text-sm text-slate-900">{parseFloat(item?.sale_price)?.toFixed(2)}</div>
                                                <div className="text-sm text-slate-600">{item.pack_size}</div>
                                                <div className="text-sm text-slate-900">{parseFloat(item?.mrp)?.toFixed(2)}</div>
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
};

export default Medicines;
