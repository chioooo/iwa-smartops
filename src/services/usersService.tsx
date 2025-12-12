import { DEMO_USERS, DEMO_ROLES } from "../data/users.data";
import type { User, Role } from "../data/types/users.types";

const USERS_KEY = "demo-users";
const ROLES_KEY = "demo-roles";

class UsersService {

    constructor() {
        if (!localStorage.getItem(USERS_KEY)) {
            localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
        }
        if (!localStorage.getItem(ROLES_KEY)) {
            localStorage.setItem(ROLES_KEY, JSON.stringify(DEMO_ROLES));
        }
    }

    getUsers(): User[] {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveUsers(users: User[]) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    addUser(user: User) {
        const currentUsers = this.getUsers();
        const currentRoles = this.getRoles();

        // Encontrar el rol asignado (roleId o por nombre)
        const assignedRole = currentRoles.find(r =>
            r.id === user.roleId || r.name === user.role
        );

        if (assignedRole) {
            assignedRole.usersCount = (assignedRole.usersCount || 0) + 1;
            this.saveRoles(currentRoles);
        }

        this.saveUsers([...currentUsers, user]);
    }

    updateUser(updatedUser: User) {
        const users = this.getUsers();
        const roles = this.getRoles();

        const oldUser = users.find(u => u.id === updatedUser.id);

        if (!oldUser) {
            console.warn("Usuario no encontrado para actualizar");
            return;
        }

        const oldRole = roles.find(r =>
            r.id === oldUser.roleId || r.name === oldUser.role
        );

        const newRole = roles.find(r =>
            r.id === updatedUser.roleId || r.name === updatedUser.role
        );

        // actualizar contadores
        if (oldRole && newRole && oldRole.id !== newRole.id) {
            oldRole.usersCount = Math.max(0, (oldRole.usersCount || 0) - 1);
            newRole.usersCount = (newRole.usersCount || 0) + 1;
            console.log("ROLES: ",roles)
            this.saveRoles(roles);
        }

        const updatedUsers = users.map(u =>
            u.id === updatedUser.id ? updatedUser : u
        );

        this.saveUsers(updatedUsers);
    }

    deleteUser(id: string) {
        const users = this.getUsers();
        const roles = this.getRoles();

        const userToDelete = users.find(u => u.id === id);

        if (userToDelete) {
            const role = roles.find(r =>
                r.id === userToDelete.roleId || r.name === userToDelete.role
            );

            if (role) {
                role.usersCount = Math.max(0, (role.usersCount || 0) - 1);
                this.saveRoles(roles);
            }
        }

        const updatedUsers = users.filter(u => u.id !== id);
        this.saveUsers(updatedUsers);
    }

    getRoles(): Role[] {
        const data = localStorage.getItem(ROLES_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveRoles(roles: Role[]) {
        localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    }

    addRole(role: Role) {
        const current = this.getRoles();
        this.saveRoles([...current, role]);
    }

    updateRole(updatedRole: Role) {
        const roles = this.getRoles().map(r =>
            r.id === updatedRole.id ? updatedRole : r
        );
        this.saveRoles(roles);
    }

    deleteRole(id: string) {
        const roles = this.getRoles().filter(r => r.id !== id);
        this.saveRoles(roles);
    }
}

export const demoDataService = new UsersService();
