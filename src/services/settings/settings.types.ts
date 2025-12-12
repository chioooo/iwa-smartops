export type PacProvider = 'FACTURAMA' | 'SOLUCION_FACTIBLE' | 'FACTURE_FACIL';

export type AIModel = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

export interface CompanySettings {
  rfc: string;
  businessName: string;
  taxRegime: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

export interface CFDISettings {
  pac: PacProvider;
  username: string;
  password: string;
  url: string;
  testMode: boolean;
}

export interface AISettings {
  apiKey: string;
  model: AIModel;
  temperature: number;
  maxTokens: number;
}

export interface AppSettings {
  company: CompanySettings;
  cfdi: CFDISettings;
  ai: AISettings;
  lastUpdated: string;
}
