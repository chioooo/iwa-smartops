import { demoDataService } from "../services/usersService";

export function usePermissions(user: any) {
    if (!user) {
        return {
            hasPermission: () => false,
            hasAnyPermission: () => false,
            hasAllPermissions: () => false
        };
    }

    const roles = demoDataService.getRoles();
    const role = roles.find(r => r.id === user.roleId);

    const permissions: string[] = role?.permissions || [];

    return {
        permissions,
        hasPermission: (perm: string) => permissions.includes(perm),

        hasAnyPermission: (perms: string[]) =>
            perms.some(p => permissions.includes(p)),

        hasAllPermissions: (perms: string[]) =>
            perms.every(p => permissions.includes(p)),
    };
}
