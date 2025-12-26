import type { InventoryMovement } from '../inventory.types';
import type { IMovementRepository } from '../interfaces/IMovementRepository';
import type { IStorageProvider } from '../../core/interfaces/IStorageProvider';
import { BaseRepository } from '../../core/BaseRepository';
import { DEMO_MOVEMENTS } from '../inventory.data';

const MOVEMENTS_KEY = 'inventory_movements';

/**
 * Movement Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles inventory movement data persistence operations
 */
export class MovementRepository extends BaseRepository<InventoryMovement> implements IMovementRepository {
  constructor(storage: IStorageProvider) {
    super(MOVEMENTS_KEY, storage, DEMO_MOVEMENTS);
  }

  findByProductId(productId: string): InventoryMovement[] {
    return this.getAll().filter(movement => movement.productId === productId);
  }

  findByType(type: InventoryMovement['type']): InventoryMovement[] {
    return this.getAll().filter(movement => movement.type === type);
  }

  findByDateRange(startDate: string, endDate: string): InventoryMovement[] {
    return this.getAll().filter(movement => {
      const movementDate = new Date(movement.date);
      return movementDate >= new Date(startDate) && movementDate <= new Date(endDate);
    });
  }
}
