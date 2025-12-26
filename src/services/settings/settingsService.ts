/**
 * Settings Service - Refactored with SOLID Principles
 * 
 * This file now acts as a facade that delegates to the new architecture:
 * - SRP: Settings repository handles only data persistence
 * - OCP: Can extend storage providers without modifying existing code
 * - DIP: Depends on abstractions, not concrete implementations
 */

import { settingsRepository } from './settingsServiceInstance';
import type { AppSettings } from './settings.types';

const SETTINGS_KEY = 'appSettings';

/**
 * Legacy adapter class for backwards compatibility
 * Delegates all operations to the new SettingsRepository
 * @deprecated Use settingsRepository directly from './settingsServiceInstance'
 */
class SettingsServiceAdapter {
  getSettings(): AppSettings {
    return settingsRepository.get();
  }

  saveSettings(settings: AppSettings): void {
    settingsRepository.save(settings);
  }

  updateSettings(partial: Partial<AppSettings>): AppSettings {
    return settingsRepository.update(partial);
  }

  resetSettings(): AppSettings {
    return settingsRepository.reset();
  }
}

/**
 * @deprecated Use settingsRepository from './settingsServiceInstance' instead
 * Maintained for backwards compatibility
 */
export const settingsService = new SettingsServiceAdapter();
export { SETTINGS_KEY };
