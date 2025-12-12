import { DEMO_CATEGORIES, DEMO_MOVEMENTS, DEMO_PRODUCTS, DEMO_SUPPLIES } from './inventory.data';
import type { Category, InventoryMovement, Product, Supply } from './inventory.types';

const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  SUPPLIES: 'inventory_supplies',
  CATEGORIES: 'inventory_categories',
  MOVEMENTS: 'inventory_movements',
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

class InventoryService {
  constructor() {
    if (typeof localStorage === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIES)) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(DEMO_SUPPLIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(DEMO_MOVEMENTS));
    }
  }

  getProducts(): Product[] {
    if (typeof localStorage === 'undefined') return DEMO_PRODUCTS;
    return safeParse<Product[]>(localStorage.getItem(STORAGE_KEYS.PRODUCTS), DEMO_PRODUCTS);
  }

  saveProducts(products: Product[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  getSupplies(): Supply[] {
    if (typeof localStorage === 'undefined') return DEMO_SUPPLIES;
    return safeParse<Supply[]>(localStorage.getItem(STORAGE_KEYS.SUPPLIES), DEMO_SUPPLIES);
  }

  saveSupplies(supplies: Supply[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
  }

  getCategories(): Category[] {
    if (typeof localStorage === 'undefined') return DEMO_CATEGORIES;
    return safeParse<Category[]>(localStorage.getItem(STORAGE_KEYS.CATEGORIES), DEMO_CATEGORIES);
  }

  saveCategories(categories: Category[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  getMovements(): InventoryMovement[] {
    if (typeof localStorage === 'undefined') return DEMO_MOVEMENTS;
    return safeParse<InventoryMovement[]>(localStorage.getItem(STORAGE_KEYS.MOVEMENTS), DEMO_MOVEMENTS);
  }

  saveMovements(movements: InventoryMovement[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }

  resetAll() {
    this.saveProducts(DEMO_PRODUCTS);
    this.saveSupplies(DEMO_SUPPLIES);
    this.saveCategories(DEMO_CATEGORIES);
    this.saveMovements(DEMO_MOVEMENTS);
  }
}

export const inventoryService = new InventoryService();
export { STORAGE_KEYS };
