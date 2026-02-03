import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';

const useAuthUser = () => {
    const { props } = usePage<PageProps>();
    return props.auth.user;
};

export default useAuthUser;
