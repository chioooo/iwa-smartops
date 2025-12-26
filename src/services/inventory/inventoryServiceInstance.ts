import { localStorageProvider } from '../core/storage';
import { ProductRepository } from './repositories/ProductRepository';
import { SupplyRepository } from './repositories/SupplyRepository';
import { CategoryRepository } from './repositories/CategoryRepository';
import { MovementRepository } from './repositories/MovementRepository';
import { InventoryServiceImpl } from './InventoryServiceNew';

/**
 * Factory function to create InventoryService instance
 * Allows for easy testing by injecting different storage providers
 */
export function createInventoryService() {
  const productRepository = new ProductRepository(localStorageProvider);
  const supplyRepository = new SupplyRepository(localStorageProvider);
  const categoryRepository = new CategoryRepository(localStorageProvider);
  const movementRepository = new MovementRepository(localStorageProvider);

  return new InventoryServiceImpl(
    productRepository,
    supplyRepository,
    categoryRepository,
    movementRepository
  );
}

/**
 * Default singleton instance for application use
 */
export const inventoryServiceNew = createInventoryService();
