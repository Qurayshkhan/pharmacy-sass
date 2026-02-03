export interface Role{
    id:number;
    name: string;
    guard_name:string;
}


export interface AuthUser{
    id: number;
    name: string;
    email: string;
    username: string;
    type: number;
    status: number;
    roles: Role[];
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth:{
        user: AuthUser | null;
    }
    errors?: Record<string, string>;
    [key: string]: unknown;
}
