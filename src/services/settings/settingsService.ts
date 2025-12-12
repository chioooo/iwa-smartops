import { DEMO_APP_SETTINGS } from './settings.data';
import type { AppSettings, AISettings, CFDISettings, CompanySettings } from './settings.types';

const SETTINGS_KEY = 'appSettings';

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

class SettingsService {
  constructor() {
    if (typeof localStorage === 'undefined') return;

    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEMO_APP_SETTINGS));
    } else {
      const normalized = this.getSettings();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
    }
  }

  getSettings(): AppSettings {
    if (typeof localStorage === 'undefined') return DEMO_APP_SETTINGS;

    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEMO_APP_SETTINGS;

    try {
      const parsed = JSON.parse(data) as unknown;
      return normalizeStoredSettings(parsed);
    } catch {
      return DEMO_APP_SETTINGS;
    }
  }

  saveSettings(settings: AppSettings) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  updateSettings(partial: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();

    const next: AppSettings = {
      ...current,
      ...partial,
      company: { ...current.company, ...(partial.company ?? {}) },
      cfdi: { ...current.cfdi, ...(partial.cfdi ?? {}) },
      ai: { ...current.ai, ...(partial.ai ?? {}) },
      lastUpdated: partial.lastUpdated ?? new Date().toISOString(),
    };

    this.saveSettings(next);
    return next;
  }

  resetSettings(): AppSettings {
    const next: AppSettings = {
      ...DEMO_APP_SETTINGS,
      lastUpdated: new Date().toISOString(),
    };
    this.saveSettings(next);
    return next;
  }
}

export const settingsService = new SettingsService();
export { SETTINGS_KEY };
