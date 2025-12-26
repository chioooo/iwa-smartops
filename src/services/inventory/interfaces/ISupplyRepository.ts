import type { Supply } from '../inventory.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * Supply Repository Interface (ISP - Interface Segregation Principle)
 */
export interface ISupplyRepository extends IRepository<Supply, string> {
  findByCategory(category: string): Supply[];
}
