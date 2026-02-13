export interface Stores {
    id: number,
    user_id: number,
    contact: number | null,
    is_active: boolean,
    branch: string | null,
    user: {
        id: number,
        name: string,
        email: string,
    }
}
