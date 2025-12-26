import type { Role } from '../../../data/types/users.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * Role Repository Interface (ISP - Interface Segregation Principle)
 * Specific contract for role operations
 */
export interface IRoleRepository extends IRepository<Role, string> {
  findByName(name: string): Role | undefined;
  incrementUsersCount(roleId: string): void;
  decrementUsersCount(roleId: string): void;
}
