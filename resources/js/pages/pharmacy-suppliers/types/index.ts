export interface PharmacySupplier {
    id: number;
    pharmacy_id: number;
    supplier_name: string;
    company_name?: string | null;
    contact?: string | null;
    address?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface GlobalSupplier {
    id: number;
    name: string;
    company_name?: string | null;
    phone?: string | null;
    address?: string | null;
}
