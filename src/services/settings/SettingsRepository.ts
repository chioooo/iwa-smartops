import type { AppSettings, AISettings, CFDISettings, CompanySettings } from './settings.types';
import type { ISettingsRepository } from './interfaces/ISettingsRepository';
import type { IStorageProvider } from '../core/interfaces/IStorageProvider';
import { DEMO_APP_SETTINGS } from './settings.data';

const SETTINGS_KEY = 'appSettings';

/**
 * Normalizes stored settings to ensure all required fields exist
 */
function normalizeStoredSettings(raw: unknown): AppSettings {
  if (!raw || typeof raw !== 'object') {
    return DEMO_APP_SETTINGS;
  }

  const record = raw as Record<string, unknown>;

  const company = (record.company ?? record.companySettings) as CompanySettings | undefined;
  const cfdi = (record.cfdi ?? record.cfdiSettings) as CFDISettings | undefined;
  const ai = (record.ai ?? record.aiSettings) as AISettings | undefined;

  const lastUpdated = typeof record.lastUpdated === 'string'
    ? record.lastUpdated
    : DEMO_APP_SETTINGS.lastUpdated;

  return {
    company: company ?? DEMO_APP_SETTINGS.company,
    cfdi: cfdi ?? DEMO_APP_SETTINGS.cfdi,
    ai: ai ?? DEMO_APP_SETTINGS.ai,
    lastUpdated,
  };
}

/**
 * Settings Repository Implementation (SRP - Single Responsibility Principle)
 * Only handles settings data persistence operations
 * Follows DIP - Depends on IStorageProvider abstraction
 */
export class SettingsRepository implements ISettingsRepository {
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    this.storage = storage;
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const existing = this.storage.getItem(SETTINGS_KEY);
    if (!existing) {
      this.storage.setItem(SETTINGS_KEY, JSON.stringify(DEMO_APP_SETTINGS));
    } else {
      // Normalize existing settings
      const normalized = this.get();
      this.storage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
    }
  }

  get(): AppSettings {
    const data = this.storage.getItem(SETTINGS_KEY);
    if (!data) return DEMO_APP_SETTINGS;

    try {
      const parsed = JSON.parse(data) as unknown;
      return normalizeStoredSettings(parsed);
    } catch {
      return DEMO_APP_SETTINGS;
    }
  }

  save(settings: AppSettings): void {
    this.storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  update(partial: Partial<AppSettings>): AppSettings {
    const current = this.get();

    const next: AppSettings = {
      ...current,
      ...partial,
      company: { ...current.company, ...(partial.company ?? {}) },
      cfdi: { ...current.cfdi, ...(partial.cfdi ?? {}) },
      ai: { ...current.ai, ...(partial.ai ?? {}) },
      lastUpdated: partial.lastUpdated ?? new Date().toISOString(),
    };

    this.save(next);
    return next;
  }

  reset(): AppSettings {
    const next: AppSettings = {
      ...DEMO_APP_SETTINGS,
      lastUpdated: new Date().toISOString(),
    };
    this.save(next);
    return next;
  }
}
