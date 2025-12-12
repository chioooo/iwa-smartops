import type { AppSettings } from './settings.types';

export const DEMO_APP_SETTINGS: AppSettings = {
  company: {
    rfc: 'XXXX000000XX',
    businessName: 'IWA CONSOLTI',
    taxRegime: '601',
    postalCode: '94300',
    address: 'C. Norte 32 673, Adolfo Lopez Mateos, 94324 Orizaba, Ver.',
    phone: '272 115 3322',
    email: 'contacto@iwa.com.mx',
  },
  cfdi: {
    pac: 'FACTURAMA',
    username: 'facturama@user.com',
    password: '12345678',
    url: 'https://dev.facturama.mx',
    testMode: true,
  },
  ai: {
    apiKey: 'sk-...',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  },
  lastUpdated: '2024-01-01T00:00:00.000Z',
};
