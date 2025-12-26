/**
 * Services Index - SOLID Architecture
 * 
 * This module exports all services following SOLID principles:
 * - S: Single Responsibility - Each service/repository has one job
 * - O: Open/Closed - Extend via new implementations, not modifications
 * - L: Liskov Substitution - All repositories follow base contracts
 * - I: Interface Segregation - Small, focused interfaces per domain
 * - D: Dependency Inversion - Depend on abstractions, not concretions
 */

// Core infrastructure
export * from './core';

// User services
export { userService } from './users/userServiceInstance';
export { UserService } from './users/UserService';
export { UserRepository } from './users/UserRepository';
export { RoleRepository } from './users/RoleRepository';
export type { IUserRepository, IRoleRepository } from './users/interfaces';
export type { IUserService } from './users/UserService';

// Inventory services
export { inventoryServiceNew } from './inventory/inventoryServiceInstance';
export { InventoryServiceImpl } from './inventory/InventoryServiceNew';
export type { IInventoryService } from './inventory/InventoryServiceNew';
export * from './inventory/repositories';
export type { 
  IProductRepository, 
  ISupplyRepository, 
  ICategoryRepository, 
  IMovementRepository 
} from './inventory/interfaces';

// Settings services
export { settingsRepository } from './settings/settingsServiceInstance';
export { SettingsRepository } from './settings/SettingsRepository';
export type { ISettingsRepository } from './settings/interfaces';

// Legacy exports (deprecated - for backwards compatibility)
export { demoDataService } from './usersService';
export { inventoryService } from './inventory/inventoryService';
export { settingsService } from './settings/settingsService';
