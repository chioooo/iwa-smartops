import type { IStorageProvider } from '../interfaces/IStorageProvider';

/**
 * LocalStorage implementation of IStorageProvider
 * Can be swapped for other implementations (sessionStorage, IndexedDB, API, etc.)
 */
export class LocalStorageProvider implements IStorageProvider {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = typeof localStorage !== 'undefined';
  }

  getItem(key: string): string | null {
    if (!this.isAvailable) return null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (!this.isAvailable) return;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (!this.isAvailable) return;
    localStorage.removeItem(key);
  }
}

export const localStorageProvider = new LocalStorageProvider();
