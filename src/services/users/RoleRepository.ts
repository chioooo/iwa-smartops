import type { Role } from '../../data/types/users.types';
import type { IRoleRepository } from './interfaces/IRoleRepository';
import type { IStorageProvider } from '../core/interfaces/IStorageProvider';
import { BaseRepository } from '../core/BaseRepository';
import { DEMO_ROLES } from '../../data/users.data';

const ROLES_KEY = 'demo-roles';

/**
 * Role Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles role data persistence operations
 */
export class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
  constructor(storage: IStorageProvider) {
    super(ROLES_KEY, storage, DEMO_ROLES);
  }

  findByName(name: string): Role | undefined {
    return this.getAll().find(
      role => role.name.toLowerCase() === name.toLowerCase()
    );
  }

  incrementUsersCount(roleId: string): void {
    const role = this.getById(roleId);
    if (role) {
      this.update({
        ...role,
        usersCount: (role.usersCount || 0) + 1
      });
    }
  }

  decrementUsersCount(roleId: string): void {
    const role = this.getById(roleId);
    if (role) {
      this.update({
        ...role,
        usersCount: Math.max(0, (role.usersCount || 0) - 1)
      });
    }
  }
}
