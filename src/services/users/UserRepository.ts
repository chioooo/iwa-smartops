import type { User } from '../../data/types/users.types';
import type { IUserRepository } from './interfaces/IUserRepository';
import type { IStorageProvider } from '../core/interfaces/IStorageProvider';
import { BaseRepository } from '../core/BaseRepository';
import { DEMO_USERS } from '../../data/users.data';

const USERS_KEY = 'demo-users';

/**
 * User Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles user data persistence operations
 */
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(storage: IStorageProvider) {
    super(USERS_KEY, storage, DEMO_USERS);
  }

  findByEmail(email: string): User | undefined {
    return this.getAll().find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  findByName(name: string): User | undefined {
    return this.getAll().find(
      user => user.name.toLowerCase() === name.toLowerCase()
    );
  }

  findByRoleId(roleId: string): User[] {
    return this.getAll().filter(user => user.roleId === roleId);
  }
}
