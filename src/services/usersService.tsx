/**
 * Users Service - Refactored with SOLID Principles
 * 
 * This file now acts as a facade that delegates to the new architecture:
 * - SRP: User and Role operations are in separate repositories
 * - OCP: Can extend storage providers without modifying existing code
 * - LSP: All repositories follow the same base contract
 * - ISP: Interfaces are segregated by domain (IUserRepository, IRoleRepository)
 * - DIP: Depends on abstractions, not concrete implementations
 */

import { userService } from "./users/userServiceInstance";
import type { User, Role } from "../data/types/users.types";

/**
 * Legacy adapter class for backwards compatibility
 * Delegates all operations to the new UserService
 * @deprecated Use userService directly from './users/userServiceInstance'
 */
class UsersServiceAdapter {
    getUsers(): User[] {
        return userService.getUsers();
    }

    addUser(user: User): void {
        userService.addUser(user);
    }

    updateUser(updatedUser: User): void {
        userService.updateUser(updatedUser);
    }

    deleteUser(id: string): void {
        userService.deleteUser(id);
    }

    getRoles(): Role[] {
        return userService.getRoles();
    }

    addRole(role: Role): void {
        userService.addRole(role);
    }

    updateRole(updatedRole: Role): void {
        userService.updateRole(updatedRole);
    }

    deleteRole(id: string): void {
        userService.deleteRole(id);
    }
}

/**
 * @deprecated Use userService from './users/userServiceInstance' instead
 * Maintained for backwards compatibility
 */
export const demoDataService = new UsersServiceAdapter();
