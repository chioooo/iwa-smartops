export type InventoryStatus = 'active' | 'inactive';

export type InventoryMovementType = 'entry' | 'exit' | 'adjustment' | 'transfer';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  purchasePrice: number;
  unit: string;
  supplier: string;
  description: string;
  status: InventoryStatus;
  image?: string;
  warehouse?: string;
}

export interface Supply {
  id: string;
  name: string;
  unit: string;
  stock: number;
  category: string;
  supplier: string;
  status: InventoryStatus;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  color: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  date: string;
  reason: string;
  user: string;
}
