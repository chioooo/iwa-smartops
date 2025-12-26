import { localStorageProvider } from '../core/storage';
import { SettingsRepository } from './SettingsRepository';

/**
 * Factory function to create SettingsRepository instance
 * Allows for easy testing by injecting different storage providers
 */
export function createSettingsRepository() {
  return new SettingsRepository(localStorageProvider);
}

/**
 * Default singleton instance for application use
 */
export const settingsRepository = createSettingsRepository();
