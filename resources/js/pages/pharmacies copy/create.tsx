import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { index, pharmacyCreate, store } from '@/routes/pharmacies';
import type { BreadcrumbItem } from '@/types';

const CreatePharmacy = () => {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pharmacies',
            href: index().url,
        },
        {
            title: 'Add pharmacy',
            href: pharmacyCreate().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Pharmacy" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4 justify-between">
                    <Button variant="default" size="icon" asChild>
                        <Link href={index()}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <Form
                            {...store.form()}
                            method="POST"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" required>
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="pharmacy@example.com"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href={index()}>Cancel</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Send Invitation
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CreatePharmacy;
