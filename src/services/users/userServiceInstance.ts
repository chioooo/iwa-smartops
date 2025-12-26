import { localStorageProvider } from '../core/storage';
import { UserRepository } from './UserRepository';
import { RoleRepository } from './RoleRepository';
import { UserService } from './UserService';

/**
 * Factory function to create UserService instance
 * Allows for easy testing by injecting different storage providers
 */
export function createUserService() {
  const userRepository = new UserRepository(localStorageProvider);
  const roleRepository = new RoleRepository(localStorageProvider);
  return new UserService(userRepository, roleRepository);
}

/**
 * Default singleton instance for application use
 * Maintains backwards compatibility with existing code
 */
export const userService = createUserService();
