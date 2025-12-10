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
        const current = this.getUsers();
        this.saveUsers([...current, user]);
    }

    updateUser(updatedUser: User) {
        const users = this.getUsers().map(u =>
            u.id === updatedUser.id ? updatedUser : u
        );
        this.saveUsers(users);
    }

    deleteUser(id: string) {
        const users = this.getUsers().filter(u => u.id !== id);
        this.saveUsers(users);
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
