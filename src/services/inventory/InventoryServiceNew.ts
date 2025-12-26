import type { Product, Supply, Category, InventoryMovement } from './inventory.types';
import type { IProductRepository } from './interfaces/IProductRepository';
import type { ISupplyRepository } from './interfaces/ISupplyRepository';
import type { ICategoryRepository } from './interfaces/ICategoryRepository';
import type { IMovementRepository } from './interfaces/IMovementRepository';

/**
 * Inventory Service Interface (ISP - Interface Segregation Principle)
 */
export interface IInventoryService {
  // Products
  getProducts(): Product[];
  getProductById(id: string): Product | undefined;
  saveProducts(products: Product[]): void;
  addProduct(product: Product): void;
  updateProduct(product: Product): void;
  deleteProduct(id: string): void;
  getLowStockProducts(): Product[];

  // Supplies
  getSupplies(): Supply[];
  getSupplyById(id: string): Supply | undefined;
  saveSupplies(supplies: Supply[]): void;
  addSupply(supply: Supply): void;
  updateSupply(supply: Supply): void;
  deleteSupply(id: string): void;

  // Categories
  getCategories(): Category[];
  getCategoryById(id: string): Category | undefined;
  saveCategories(categories: Category[]): void;
  addCategory(category: Category): void;
  updateCategory(category: Category): void;
  deleteCategory(id: string): void;

  // Movements
  getMovements(): InventoryMovement[];
  getMovementsByProductId(productId: string): InventoryMovement[];
  saveMovements(movements: InventoryMovement[]): void;
  addMovement(movement: InventoryMovement): void;

  // Utility
  resetAll(): void;
}

/**
 * Inventory Service Implementation (SRP - Single Responsibility Principle)
 * Coordinates operations between products, supplies, categories, and movements
 * Follows DIP - Depends on abstractions (repositories interfaces)
 */
export class InventoryServiceImpl implements IInventoryService {
  private productRepository: IProductRepository;
  private supplyRepository: ISupplyRepository;
  private categoryRepository: ICategoryRepository;
  private movementRepository: IMovementRepository;

  constructor(
    productRepository: IProductRepository,
    supplyRepository: ISupplyRepository,
    categoryRepository: ICategoryRepository,
    movementRepository: IMovementRepository
  ) {
    this.productRepository = productRepository;
    this.supplyRepository = supplyRepository;
    this.categoryRepository = categoryRepository;
    this.movementRepository = movementRepository;
  }

  // Product operations
  getProducts(): Product[] {
    return this.productRepository.getAll();
  }

  getProductById(id: string): Product | undefined {
    return this.productRepository.getById(id);
  }

  saveProducts(products: Product[]): void {
    this.productRepository.save(products);
  }

  addProduct(product: Product): void {
    this.productRepository.add(product);
  }

  updateProduct(product: Product): void {
    this.productRepository.update(product);
  }

  deleteProduct(id: string): void {
    this.productRepository.delete(id);
  }

  getLowStockProducts(): Product[] {
    return this.productRepository.findLowStock();
  }

  // Supply operations
  getSupplies(): Supply[] {
    return this.supplyRepository.getAll();
  }

  getSupplyById(id: string): Supply | undefined {
    return this.supplyRepository.getById(id);
  }

  saveSupplies(supplies: Supply[]): void {
    this.supplyRepository.save(supplies);
  }

  addSupply(supply: Supply): void {
    this.supplyRepository.add(supply);
  }

  updateSupply(supply: Supply): void {
    this.supplyRepository.update(supply);
  }

  deleteSupply(id: string): void {
    this.supplyRepository.delete(id);
  }

  // Category operations
  getCategories(): Category[] {
    return this.categoryRepository.getAll();
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoryRepository.getById(id);
  }

  saveCategories(categories: Category[]): void {
    this.categoryRepository.save(categories);
  }

  addCategory(category: Category): void {
    this.categoryRepository.add(category);
  }

  updateCategory(category: Category): void {
    this.categoryRepository.update(category);
  }

  deleteCategory(id: string): void {
    this.categoryRepository.delete(id);
  }

  // Movement operations
  getMovements(): InventoryMovement[] {
    return this.movementRepository.getAll();
  }

  getMovementsByProductId(productId: string): InventoryMovement[] {
    return this.movementRepository.findByProductId(productId);
  }

  saveMovements(movements: InventoryMovement[]): void {
    this.movementRepository.save(movements);
  }

  addMovement(movement: InventoryMovement): void {
    this.movementRepository.add(movement);
  }

  // Utility
  resetAll(): void {
    // Reset is handled by re-initializing repositories with default data
    // This would require access to default data, which is encapsulated in repositories
    console.warn('resetAll should be implemented with proper default data injection');
  }
}
