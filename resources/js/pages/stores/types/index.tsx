export interface Stores {
    id: number,
    user_id: number,
    contact: string | null,
    is_active: boolean,
    branch: string | null,
    address: string | null,
    user: {
        id: number,
        name: string,
        email: string,
        uuid: string,
    }
}
