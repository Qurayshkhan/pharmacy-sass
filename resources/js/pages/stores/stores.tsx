import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { store as StoreIndex } from '@/routes/stores';
import type { BreadcrumbItem } from '@/types';

const stores = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stores',
            href: StoreIndex().url,
        }
    ]
    return <>
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Stores' />
        </AppLayout>
    </>
}

export default stores;
