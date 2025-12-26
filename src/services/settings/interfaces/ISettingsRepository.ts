import type { AppSettings } from '../settings.types';

/**
 * Settings Repository Interface (ISP - Interface Segregation Principle)
 */
export interface ISettingsRepository {
  get(): AppSettings;
  save(settings: AppSettings): void;
  update(partial: Partial<AppSettings>): AppSettings;
  reset(): AppSettings;
}
