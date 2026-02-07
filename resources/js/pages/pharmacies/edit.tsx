import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/pharmacies';
import type { Pharmacy } from './types';

interface EditPharmacyProps {
    pharmacy: Pharmacy;
}

const EditPharmacy = ({ pharmacy }: EditPharmacyProps) => {
    console.log("🚀 ~ EditPharmacy ~ pharmacy:", pharmacy)
    if (!pharmacy) {
        return null;
    }

    return (
        <AppLayout>
            <Head title="Edit Pharmacy" />
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Pharmacy</h1>
                        <p className="text-sm text-muted-foreground">
                            Update pharmacy information and status
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index()}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                </div>

                <Card className="">
                    <CardHeader>
                        <CardTitle>Pharmacy Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...update.form()}
                            method="PUT"
                            className="space-y-6"
                            options={{
                                preserveScroll: true,
                            }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="uuid"
                                        value={String(pharmacy?.user?.uuid)}
                                    />
                                    <input
                                        type="hidden"
                                        name="is_update_pharmacy"
                                        defaultValue="true"
                                    />
                                    <div className='grid sm:grid-cols-1 gap-2 lg:grid-cols-2'>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" required>
                                                Pharmacy Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                placeholder="Pharmacy name"
                                                defaultValue={String(pharmacy?.user?.name || '')}
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="license_number" required>
                                                License Number
                                            </Label>
                                            <Input
                                                id="license_number"
                                                name="license_number"
                                                type="text"
                                                required
                                                placeholder="License number"
                                                defaultValue={String(pharmacy?.license_number || '')}
                                            />
                                            <InputError
                                                message={errors.license_number}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-1 gap-2 lg:grid-cols-2'>
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact" required>
                                                Contact Number
                                            </Label>
                                            <Input
                                                id="contact"
                                                name="contact"
                                                type="text"
                                                required
                                                placeholder="Contact number"
                                                defaultValue={String(pharmacy?.contact || '')}
                                            />
                                            <InputError
                                                message={errors.contact}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="branch">
                                                Branch Name (Optional)
                                            </Label>
                                            <Input
                                                id="branch"
                                                name="branch"
                                                type="text"
                                                placeholder="Branch name"
                                                defaultValue={String(pharmacy?.branch || '')}
                                            />
                                            <InputError
                                                message={errors.branch}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className='grid sm:grid-cols-1 gap-2 lg:grid-cols-2'>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address" required>
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                type="text"
                                                required
                                                placeholder="Address"
                                                defaultValue={String(pharmacy?.address || '')}
                                            />
                                            <InputError
                                                message={errors.address}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="status" required>
                                                Status
                                            </Label>
                                            <Select
                                                name="status"
                                                defaultValue={String(pharmacy?.user?.status)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        <SelectItem value="1">Active</SelectItem>
                                                        <SelectItem value="0">Inactive</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.status}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 items-center justify-end">
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
                                            Update Pharmacy
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

export default EditPharmacy;
