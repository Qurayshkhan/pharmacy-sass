export interface Pharmacy {
    uuid: string | null;
    id: number;
    contact: string | null;
    license_number: string | null;
    user_id: number | null;
    user?: {
        name: string | null;
        email: string | null;
        status: number | null;
    }

}

export interface User {
    id: number;
    uuid: string | null | '';
    name: string | null | '';
    email: string | '';
    pharmacy: Pharmacy
}
