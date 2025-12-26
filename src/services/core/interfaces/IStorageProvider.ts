/**
 * Interface for storage operations (DIP - Dependency Inversion Principle)
 * Allows swapping localStorage for other storage mechanisms
 */
export interface IStorageProvider {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
