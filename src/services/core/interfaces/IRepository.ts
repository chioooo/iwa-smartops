/**
 * Generic Repository Interface (DIP - Dependency Inversion Principle)
 * Provides a contract for CRUD operations on any entity type
 */
export interface IRepository<T, ID = string> {
  getAll(): T[];
  getById(id: ID): T | undefined;
  save(items: T[]): void;
  add(item: T): void;
  update(item: T): void;
  delete(id: ID): void;
}

/**
 * Read-only repository interface (ISP - Interface Segregation Principle)
 * For components that only need read access
 */
export interface IReadOnlyRepository<T, ID = string> {
  getAll(): T[];
  getById(id: ID): T | undefined;
}

/**
 * Write-only repository interface (ISP - Interface Segregation Principle)
 * For components that only need write access
 */
export interface IWriteRepository<T, ID = string> {
  save(items: T[]): void;
  add(item: T): void;
  update(item: T): void;
  delete(id: ID): void;
}
