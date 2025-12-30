import type { User } from '../../../data/types/users.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * User Repository Interface (ISP - Interface Segregation Principle)
 * Specific contract for user operations
 */
export interface IUserRepository extends IRepository<User, string> {
  findByEmail(email: string): User | undefined;
  findByName(name: string): User | undefined;
  findByRoleId(roleId: string): User[];
}
