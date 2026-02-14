import { Form, Head } from '@inertiajs/react'
import InputError from '@/components/input-error';
import Label from '@/components/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout'
import { register } from '@/routes/stores'
import type { User } from '@/types';

interface UserProps {
    user: User;
}

const Register = ({ user }: UserProps) => {
    console.log("🚀 ~ Register ~ user:", user)
    const email = user?.email ?? '';


    return (
        <>
            <AuthLayout
                title="Create an account"
                description="Enter your details below to create your account"
            >
                <Head title="Register" />
                <Form
                    {...register.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name='user_id' value={String(user.id)} />
                            <input type="hidden" name='id' value={String(user.store.id)} />
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" required>
                                        Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Name e.g (Pharmacy, Bakery, General store)"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" required>Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        readOnly

                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact" required>Contact</Label>
                                    <Input
                                        id="contact"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="contact"
                                        placeholder="Contact number"
                                    />
                                    <InputError
                                        message={errors.contact}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="branch">Branch Name (optional)</Label>
                                    <Input
                                        id="branch"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="branch"
                                        placeholder="Branch name"
                                    />
                                    <InputError
                                        message={errors.branch}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address" required>Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="address"
                                        placeholder="Address"
                                    />
                                    <InputError
                                        message={errors.address}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" required>Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" required>
                                        Confirm password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Register
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </AuthLayout>
        </>
    )
}

export default Register;
