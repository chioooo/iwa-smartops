import type { Category } from '../inventory.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * Category Repository Interface (ISP - Interface Segregation Principle)
 */
export interface ICategoryRepository extends IRepository<Category, string> {
  findByName(name: string): Category | undefined;
  incrementProductsCount(categoryId: string): void;
  decrementProductsCount(categoryId: string): void;
}
