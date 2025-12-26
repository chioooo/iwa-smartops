import type { Product } from '../inventory.types';
import type { IProductRepository } from '../interfaces/IProductRepository';
import type { IStorageProvider } from '../../core/interfaces/IStorageProvider';
import { BaseRepository } from '../../core/BaseRepository';
import { DEMO_PRODUCTS } from '../inventory.data';

const PRODUCTS_KEY = 'inventory_products';

/**
 * Product Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles product data persistence operations
 */
export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  constructor(storage: IStorageProvider) {
    super(PRODUCTS_KEY, storage, DEMO_PRODUCTS);
  }

  findByCategory(category: string): Product[] {
    return this.getAll().filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  findLowStock(): Product[] {
    return this.getAll().filter(product => product.stock <= product.minStock);
  }

  findBySku(sku: string): Product | undefined {
    return this.getAll().find(product => product.sku === sku);
  }
}
