export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
    avatar?: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissionsCount: number;
    usersCount: number;
    permissions: string[];
}
