import type { Product } from '../inventory.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * Product Repository Interface (ISP - Interface Segregation Principle)
 */
export interface IProductRepository extends IRepository<Product, string> {
  findByCategory(category: string): Product[];
  findLowStock(): Product[];
  findBySku(sku: string): Product | undefined;
}
