/**
 * Inventory Service - Refactored with SOLID Principles
 * 
 * This file now acts as a facade that delegates to the new architecture:
 * - SRP: Each entity (Product, Supply, Category, Movement) has its own repository
 * - OCP: Can extend storage providers without modifying existing code
 * - LSP: All repositories follow the same base contract
 * - ISP: Interfaces are segregated by entity type
 * - DIP: Depends on abstractions, not concrete implementations
 */

import { inventoryServiceNew } from './inventoryServiceInstance';
import type { Category, InventoryMovement, Product, Supply } from './inventory.types';

const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  SUPPLIES: 'inventory_supplies',
  CATEGORIES: 'inventory_categories',
  MOVEMENTS: 'inventory_movements',
} as const;

/**
 * Legacy adapter class for backwards compatibility
 * Delegates all operations to the new InventoryService
 * @deprecated Use inventoryServiceNew directly from './inventoryServiceInstance'
 */
class InventoryServiceAdapter {
  getProducts(): Product[] {
    return inventoryServiceNew.getProducts();
  }

  saveProducts(products: Product[]): void {
    inventoryServiceNew.saveProducts(products);
  }

  getSupplies(): Supply[] {
    return inventoryServiceNew.getSupplies();
  }

  saveSupplies(supplies: Supply[]): void {
    inventoryServiceNew.saveSupplies(supplies);
  }

  getCategories(): Category[] {
    return inventoryServiceNew.getCategories();
  }

  saveCategories(categories: Category[]): void {
    inventoryServiceNew.saveCategories(categories);
  }

  getMovements(): InventoryMovement[] {
    return inventoryServiceNew.getMovements();
  }

  saveMovements(movements: InventoryMovement[]): void {
    inventoryServiceNew.saveMovements(movements);
  }

  resetAll(): void {
    inventoryServiceNew.resetAll();
  }
}

/**
 * @deprecated Use inventoryServiceNew from './inventoryServiceInstance' instead
 * Maintained for backwards compatibility
 */
export const inventoryService = new InventoryServiceAdapter();
export { STORAGE_KEYS };
