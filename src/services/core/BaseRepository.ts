import type { IRepository } from './interfaces/IRepository';
import type { IStorageProvider } from './interfaces/IStorageProvider';

/**
 * Base Repository implementation using generic storage provider
 * Follows OCP - Open for extension, closed for modification
 * Follows DIP - Depends on abstraction (IStorageProvider), not concrete implementation
 */
export abstract class BaseRepository<T extends { id: string }> implements IRepository<T, string> {
  protected readonly storageKey: string;
  protected readonly storage: IStorageProvider;
  protected readonly defaultData: T[];

  constructor(
    storageKey: string,
    storage: IStorageProvider,
    defaultData: T[] = []
  ) {
    this.storageKey = storageKey;
    this.storage = storage;
    this.defaultData = defaultData;
    this.initializeStorage();
  }

  protected initializeStorage(): void {
    if (!this.storage.getItem(this.storageKey)) {
      this.storage.setItem(this.storageKey, JSON.stringify(this.defaultData));
    }
  }

  protected safeParse(raw: string | null): T[] {
    if (!raw) return this.defaultData;
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return this.defaultData;
    }
  }

  getAll(): T[] {
    return this.safeParse(this.storage.getItem(this.storageKey));
  }

  getById(id: string): T | undefined {
    return this.getAll().find(item => item.id === id);
  }

  save(items: T[]): void {
    this.storage.setItem(this.storageKey, JSON.stringify(items));
  }

  add(item: T): void {
    const items = this.getAll();
    this.save([...items, item]);
  }

  update(item: T): void {
    const items = this.getAll().map(existing =>
      existing.id === item.id ? item : existing
    );
    this.save(items);
  }

  delete(id: string): void {
    const items = this.getAll().filter(item => item.id !== id);
    this.save(items);
  }
}
