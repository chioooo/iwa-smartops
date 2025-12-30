import type { Category } from '../inventory.types';
import type { ICategoryRepository } from '../interfaces/ICategoryRepository';
import type { IStorageProvider } from '../../core/interfaces/IStorageProvider';
import { BaseRepository } from '../../core/BaseRepository';
import { DEMO_CATEGORIES } from '../inventory.data';

const CATEGORIES_KEY = 'inventory_categories';

/**
 * Category Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles category data persistence operations
 */
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  constructor(storage: IStorageProvider) {
    super(CATEGORIES_KEY, storage, DEMO_CATEGORIES);
  }

  findByName(name: string): Category | undefined {
    return this.getAll().find(
      category => category.name.toLowerCase() === name.toLowerCase()
    );
  }

  incrementProductsCount(categoryId: string): void {
    const category = this.getById(categoryId);
    if (category) {
      this.update({
        ...category,
        productsCount: (category.productsCount || 0) + 1
      });
    }
  }

  decrementProductsCount(categoryId: string): void {
    const category = this.getById(categoryId);
    if (category) {
      this.update({
        ...category,
        productsCount: Math.max(0, (category.productsCount || 0) - 1)
      });
    }
  }
}
