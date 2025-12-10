import React, { useState, useEffect, useRef } from 'react';

// Types for our settings
interface CompanySettings {
  rfc: string;
  businessName: string;
  taxRegime: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

interface CFDISettings {
  pac: string;
  username: string;
  password: string;
  url: string;
  testMode: boolean;
}

interface AISettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('empresa');
  const [isSaving, setIsSaving] = useState(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({ type: null, message: '' });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.company) setCompany(parsed.company);
          if (parsed.cfdi) setCfdi(parsed.cfdi);
          if (parsed.ai) setAi(parsed.ai);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Clear success message after 3 seconds when saveStatus changes
  useEffect(() => {
    if (saveStatus.type === 'success') {
      const timer = setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Form states
  const [company, setCompany] = useState<CompanySettings>({
    rfc: 'XXXX000000XX',
    businessName: 'IWA CONSOLTI ',
    taxRegime: '601',
    postalCode: '94300',
    address: 'C. Norte 32 673, Adolfo Lopez Mateos, 94324 Orizaba, Ver.',
    phone: '272 115 3322',
    email: 'contacto@iwa.com.mx',
  });

  const [cfdi, setCfdi] = useState<CFDISettings>({
    pac: 'FACTURAMA',
    username: 'facturama@user.com',
    password: '12345678',
    url: 'https://dev.facturama.mx',
    testMode: true,
  });

  const [ai, setAi] = useState<AISettings>({
    apiKey: 'sk-proj-Pi3Khncc4a0p3Wuk3asRzEIeLhiEZk6Bob8T2kIaQ3I6YWrciK0KSTNOl6WxN2TrTN8ZlT3BlbkFJlL877Sp6FE2CD7kc3oPoiwXnVyRMy3CtXs1zr-yeQrKHYf01mYvjzybaosaYkMPgA',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setCompany(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCFDIChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setCfdi(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAIChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAi(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });
    
    try {
      const settingsToSave = {
        companySettings: company,
        cfdiSettings: cfdi,
        aiSettings: ai,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaveStatus({ 
        type: 'success', 
        message: 'Configuración guardada exitosamente' 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ 
        type: 'error', 
        message: 'Error al guardar la configuración' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Datos Fiscales' },
    { id: 'cfdi', label: 'Proveedor CFDI' },
    { id: 'ai', label: 'Configuración IA' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-1">Administra la configuración de la empresa y servicios</p>
      </div>

      {saveStatus.message && (
        <div className={`mb-6 p-4 rounded-md ${saveStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {saveStatus.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }}>
            {/* Datos Fiscales */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Datos Fiscales de la Empresa</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-1">
                        RFC <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="rfc"
                        id="rfc"
                        value={company.rfc}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="XAXX010101000"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Razón Social <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        id="businessName"
                        value={company.businessName}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Empresa S.A. de C.V."
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="taxRegime" className="block text-sm font-medium text-gray-700 mb-1">
                        Régimen Fiscal <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="taxRegime"
                        name="taxRegime"
                        value={company.taxRegime}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="601">General de Ley Personas Morales</option>
                        <option value="603">Personas Morales con Fines no Lucrativos</option>
                        <option value="605">Sueldos y Salarios</option>
                        <option value="606">Arrendamiento</option>
                        <option value="608">Demás ingresos</option>
                        <option value="609">Consolidación</option>
                        <option value="610">Residentes en el Extranjero sin Establecimiento en México</option>
                        <option value="611">Ingresos por Dividendos</option>
                        <option value="612">Personas Físicas con Actividades Empresariales y Profesionales</option>
                        <option value="614">Ingresos por intereses</option>
                        <option value="615">Régimen de los ingresos por obtención de premios</option>
                        <option value="616">Sin obligaciones fiscales</option>
                        <option value="620">Sociedades Cooperativas de Producción</option>
                        <option value="621">Incorporación Fiscal</option>
                        <option value="622">Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                        <option value="623">Opcional para Grupos de Sociedades</option>
                        <option value="624">Coordinados</option>
                        <option value="625">Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                        <option value="626">Régimen Simplificado de Confianza</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={company.postalCode}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="01000"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Fiscal <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={company.address}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Calle, Número, Colonia, Ciudad, Estado"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={company.phone}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5512345678"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={company.email}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contacto@empresa.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Proveedor CFDI */}
            {activeTab === 'cfdi' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Configuración del Proveedor CFDI (PAC)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pac" className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor PAC <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="pac"
                      name="pac"
                      value={cfdi.pac}
                      onChange={handleCFDIChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="FACTURAMA">FACTURAMA</option>
                      <option value="SOLUCION_FACTIBLE">Solución Factible</option>
                      <option value="FACTURE_FACIL">Facture Fácil</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Usuario <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={cfdi.username}
                      onChange={handleCFDIChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Usuario del PAC"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={cfdi.password}
                        onChange={handleCFDIChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Servicio <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      name="url"
                      id="url"
                      value={cfdi.url}
                      onChange={handleCFDIChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.pac.com"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="testMode"
                      name="testMode"
                      type="checkbox"
                      checked={cfdi.testMode}
                      onChange={handleCFDIChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="testMode" className="ml-2 block text-sm text-gray-700">
                      Modo de Pruebas (Timbrar en modo pruebas)
                    </label>
                  </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        La configuración de la IA afecta cómo el sistema genera respuestas. Ajusta estos parámetros según tus necesidades de precisión y creatividad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {(() => {
                  const lastSaved = localStorage.getItem('appSettings');
                  if (lastSaved) {
                    try {
                      const { lastUpdated } = JSON.parse(lastSaved);
                      if (lastUpdated) {
                        return `Último guardado: ${new Date(lastUpdated).toLocaleString()}`;
                      }
                    } catch (e) {
                      console.error('Error parsing last saved date', e);
                    }
                  }
                  return 'Los cambios no se han guardado';
                })()}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Reset form to last saved state
                    const savedSettings = localStorage.getItem('appSettings');
                    if (savedSettings) {
                      const parsed = JSON.parse(savedSettings);
                      if (parsed.company) setCompany(parsed.company);
                      if (parsed.cfdi) setCfdi(parsed.cfdi);
                      if (parsed.ai) setAi(parsed.ai);
                    }
                    setSaveStatus({ type: 'success', message: 'Cambios descartados' });
                    setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Descartar cambios
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
