import type { User, Role } from '../../data/types/users.types';
import type { IUserRepository, IRoleRepository } from './interfaces';

/**
 * User Service Interface (ISP - Interface Segregation Principle)
 */
export interface IUserService {
  getUsers(): User[];
  getUserById(id: string): User | undefined;
  findUserByEmailOrName(input: string): User | undefined;
  addUser(user: User): void;
  updateUser(updatedUser: User): void;
  deleteUser(id: string): void;
  getRoles(): Role[];
  getRoleById(id: string): Role | undefined;
  addRole(role: Role): void;
  updateRole(role: Role): void;
  deleteRole(id: string): void;
}

/**
 * User Service Implementation (SRP - Single Responsibility Principle)
 * Coordinates operations between users and roles
 * Follows DIP - Depends on abstractions (IUserRepository, IRoleRepository)
 */
export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private roleRepository: IRoleRepository;

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  // User operations
  getUsers(): User[] {
    return this.userRepository.getAll();
  }

  getUserById(id: string): User | undefined {
    return this.userRepository.getById(id);
  }

  findUserByEmailOrName(input: string): User | undefined {
    const lowerInput = input.toLowerCase();
    return this.userRepository.findByEmail(lowerInput) 
      || this.userRepository.findByName(lowerInput);
  }

  addUser(user: User): void {
    // Find and update role count
    const role = this.findRoleForUser(user);
    if (role?.id) {
      this.roleRepository.incrementUsersCount(role.id);
    }
    this.userRepository.add(user);
  }

  updateUser(updatedUser: User): void {
    const oldUser = this.userRepository.getById(updatedUser.id);
    if (!oldUser) {
      console.warn('Usuario no encontrado para actualizar');
      return;
    }

    const oldRole = this.findRoleForUser(oldUser);
    const newRole = this.findRoleForUser(updatedUser);

    // Update role counts if role changed
    if (oldRole?.id && newRole?.id && oldRole.id !== newRole.id) {
      this.roleRepository.decrementUsersCount(oldRole.id);
      this.roleRepository.incrementUsersCount(newRole.id);
    }

    this.userRepository.update(updatedUser);
  }

  deleteUser(id: string): void {
    const user = this.userRepository.getById(id);
    if (user) {
      const role = this.findRoleForUser(user);
      if (role?.id) {
        this.roleRepository.decrementUsersCount(role.id);
      }
    }
    this.userRepository.delete(id);
  }

  // Role operations
  getRoles(): Role[] {
    return this.roleRepository.getAll();
  }

  getRoleById(id: string): Role | undefined {
    return this.roleRepository.getById(id);
  }

  addRole(role: Role): void {
    this.roleRepository.add(role);
  }

  updateRole(role: Role): void {
    this.roleRepository.update(role);
  }

  deleteRole(id: string): void {
    this.roleRepository.delete(id);
  }

  // Private helper
  private findRoleForUser(user: User): Role | undefined {
    const roles = this.roleRepository.getAll();
    return roles.find(r => r.id === user.roleId || r.name === user.role);
  }
}
