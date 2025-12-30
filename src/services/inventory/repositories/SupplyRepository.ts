import type { Supply } from '../inventory.types';
import type { ISupplyRepository } from '../interfaces/ISupplyRepository';
import type { IStorageProvider } from '../../core/interfaces/IStorageProvider';
import { BaseRepository } from '../../core/BaseRepository';
import { DEMO_SUPPLIES } from '../inventory.data';

const SUPPLIES_KEY = 'inventory_supplies';

/**
 * Supply Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles supply data persistence operations
 */
export class SupplyRepository extends BaseRepository<Supply> implements ISupplyRepository {
  constructor(storage: IStorageProvider) {
    super(SUPPLIES_KEY, storage, DEMO_SUPPLIES);
  }

  findByCategory(category: string): Supply[] {
    return this.getAll().filter(
      supply => supply.category.toLowerCase() === category.toLowerCase()
    );
  }
}
