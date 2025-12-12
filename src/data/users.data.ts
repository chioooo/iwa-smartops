import type {Role, User} from "./types/users.types.ts";

export const DEMO_USERS: User[] = [
    {
        id: '1',
        name: 'María González',
        email: 'maria.gonzalez@iwa.com',
        roleId: '1',
        role: 'Admin',
        status: 'active',
        createdAt: '2024-01-15',
        avatar: 'MG'
    },
    {
        id: '2',
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@iwa.com',
        roleId: '2',
        role: 'Usuario',
        status: 'active',
        createdAt: '2024-02-20',
        avatar: 'CR'
    },
    {
        id: '3',
        name: 'Ana Martínez',
        email: 'ana.martinez@iwa.com',
        roleId: '3',
        role: 'Operador',
        status: 'active',
        createdAt: '2024-03-10',
        avatar: 'AM'
    },
    {
        id: '4',
        name: 'Luis Fernández',
        email: 'luis.fernandez@iwa.com',
        roleId: '2',
        role: 'Usuario',
        status: 'inactive',
        createdAt: '2024-02-05',
        avatar: 'LF'
    },
    {
        id: '5',
        name: 'Patricia López',
        email: 'patricia.lopez@iwa.com',
        roleId: '1',
        role: 'Admin',
        status: 'active',
        createdAt: '2024-01-20',
        avatar: 'PL'
    },
];

export const DEMO_ROLES: Role[] = [
    {
        id: '1',
        name: 'Admin',
        description: 'Acceso completo al sistema',
        permissionsCount: 24,
        usersCount: 2,
        permissions: [
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'inventory.view', 'inventory.create',
            'billing.view', 'billing.create',
            'reports.view',
            'settings.edit'
        ]
    },
    {
        id: '2',
        name: 'Usuario',
        description: 'Acceso estándar con permisos limitados',
        permissionsCount: 12,
        usersCount: 2,
        permissions: [
            'users.view',
            'inventory.view',
            'billing.view',
            'reports.view'
        ]
    },
    {
        id: '3',
        name: 'Operador',
        description: 'Gestión de operaciones y servicios',
        permissionsCount: 16,
        usersCount: 1,
        permissions: [
            'inventory.view', 'inventory.create', 'inventory.edit',
            'operations.view', 'operations.create',
            'billing.view'
        ]
    },
];
