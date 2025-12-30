export interface User {
    id: string;
    name: string;
    email: string;
    roleId?: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
    avatar?: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissionsCount?: number;
    usersCount?: number;
    permissions?: string[];
}

/**
 * Type for creating a new role (id is optional, will be generated)
 */
export type CreateRoleInput = Omit<Role, 'id'> & { id?: string };
