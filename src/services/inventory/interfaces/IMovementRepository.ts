import type { InventoryMovement } from '../inventory.types';
import type { IRepository } from '../../core/interfaces/IRepository';

/**
 * Movement Repository Interface (ISP - Interface Segregation Principle)
 */
export interface IMovementRepository extends IRepository<InventoryMovement, string> {
  findByProductId(productId: string): InventoryMovement[];
  findByType(type: InventoryMovement['type']): InventoryMovement[];
  findByDateRange(startDate: string, endDate: string): InventoryMovement[];
}
