import React, { useState, useEffect, useRef } from 'react';
import { Building2, FileText, Bot, MessageSquare } from 'lucide-react';
import { SmsSettings } from './settings/SmsSettings';

import { settingsService } from '../services/settings/settingsService';
import type { CompanySettings, CFDISettings, AISettings } from '../services/settings/settings.types';

const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({ type: null, message: '' });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = settingsService.getSettings();
        setCompany(saved.company);
        setCfdi(saved.cfdi);
        setAi(saved.ai);
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
    apiKey: '',
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
      settingsService.updateSettings({
        company,
        cfdi,
        ai,
        lastUpdated: new Date().toISOString(),
      });
      
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
    { id: 'company', label: 'Datos Fiscales', icon: Building2 },
    { id: 'cfdi', label: 'Proveedor CFDI', icon: FileText },
    { id: 'ai', label: 'Configuración IA', icon: Bot },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-2">Configuración del Sistema</h1>
              <p className="text-gray-600">Administra la configuración de la empresa y servicios</p>
            </div>
            {saveStatus.message && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${saveStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {saveStatus.message}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#D0323A] text-[#D0323A]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }}>
          {/* Datos Fiscales */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos Fiscales del Emisor</h2>
                <p className="text-sm text-gray-600">
                  Información que aparecerá en todas las facturas emitidas
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razón Social */}
                <div className="md:col-span-2">
                  <label htmlFor="businessName" className="block text-sm text-gray-700 mb-2">
                    Razón Social / Nombre <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    id="businessName"
                    value={company.businessName}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="Empresa S.A. de C.V."
                    required
                  />
                </div>

                {/* RFC */}
                <div>
                  <label htmlFor="rfc" className="block text-sm text-gray-700 mb-2">
                    RFC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    id="rfc"
                    value={company.rfc}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent font-mono"
                    placeholder="XAXX010101000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="taxRegime" className="block text-sm font-medium text-gray-700 mb-2">
                    Régimen Fiscal <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="taxRegime"
                    name="taxRegime"
                    value={company.taxRegime}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent appearance-none bg-white"
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
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={company.postalCode}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="01000"
                    required
                  />
                </div>

                {/* Domicilio Fiscal */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm text-gray-700 mb-2">
                    Domicilio Fiscal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={company.address}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="Calle, Número, Colonia, Ciudad, Estado"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={company.phone}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="5512345678"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    Email de facturación
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={company.email}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Proveedor CFDI */}
          {activeTab === 'cfdi' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Proveedor CFDI (PAC)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pac" className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor PAC <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="pac"
                    name="pac"
                    value={cfdi.pac}
                    onChange={handleCFDIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="FACTURAMA">FACTURAMA</option>
                    <option value="SOLUCION_FACTIBLE">Solución Factible</option>
                    <option value="FACTURE_FACIL">Facture Fácil</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={cfdi.username}
                    onChange={handleCFDIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="Usuario del PAC"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={cfdi.password}
                    onChange={handleCFDIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Servicio <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    value={cfdi.url}
                    onChange={handleCFDIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="https://api.pac.com"
                    required
                  />
                </div>

                <div className="flex items-center md:col-span-2">
                  <input
                    id="testMode"
                    name="testMode"
                    type="checkbox"
                    checked={cfdi.testMode}
                    onChange={handleCFDIChange}
                    className="h-5 w-5 text-[#D0323A] focus:ring-[#D0323A] border-gray-300 rounded"
                  />
                  <label htmlFor="testMode" className="ml-3 block text-sm text-gray-700">
                    Modo de Pruebas (Timbrar en modo pruebas)
                  </label>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> Asegúrate de tener los certificados CSD correctamente configurados antes de emitir facturas en producción.
                </p>
              </div>
            </div>
          )}

          {/* Configuración IA */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuración de Inteligencia Artificial</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={apiKeyRef}
                    type="password"
                    name="apiKey"
                    id="apiKey"
                    value={ai.apiKey}
                    onChange={handleAIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="sk-..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">Tu clave de API de OpenAI. Mantenla segura y no la compartas.</p>
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="model"
                    name="model"
                    value={ai.model}
                    onChange={handleAIChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura: {ai.temperature}
                  </label>
                  <input
                    type="range"
                    name="temperature"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={ai.temperature}
                    onChange={handleAIChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D0323A]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Preciso (0)</span>
                    <span>Creativo (1)</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Tokens
                  </label>
                  <input
                    type="number"
                    name="maxTokens"
                    id="maxTokens"
                    value={ai.maxTokens}
                    onChange={handleAIChange}
                    min="100"
                    max="8000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-gray-500">Límite de tokens por respuesta (100-8000)</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> La configuración de la IA afecta cómo el sistema genera respuestas. Ajusta estos parámetros según tus necesidades de precisión y creatividad.
                </p>
              </div>
            </div>
          )}

          {/* SMS */}
          {activeTab === 'sms' && <SmsSettings />}

          {/* Footer con botones */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {(() => {
                  try {
                    const { lastUpdated } = settingsService.getSettings();
                    return lastUpdated
                      ? `Último guardado: ${new Date(lastUpdated).toLocaleString()}`
                      : 'Los cambios no se han guardado';
                  } catch (e) {
                    console.error('Error parsing last saved date', e);
                    return 'Los cambios no se han guardado';
                  }
                })()}
              </div>
              <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  const saved = settingsService.getSettings();
                  setCompany(saved.company);
                  setCfdi(saved.cfdi);
                  setAi(saved.ai);
                  setSaveStatus({ type: 'success', message: 'Cambios descartados' });
                  setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Descartar cambios
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default SettingsScreen;
