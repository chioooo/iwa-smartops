import React, { useState } from 'react';
import { Shield, FileText, Building2, Upload, Check, AlertCircle, Key } from 'lucide-react';

export function BillingSettings() {
  const [activeTab, setActiveTab] = useState<'certificados' | 'datos' | 'series'>('certificados');
  
  const [certificadoData, setCertificadoData] = useState({
    cerFile: null as File | null,
    keyFile: null as File | null,
    password: '',
    validUntil: '2025-12-31'
  });

  const [datosEmisor, setDatosEmisor] = useState({
    razonSocial: 'iWA SmartOps S.A. de C.V.',
    rfc: 'IWA010101ABC',
    regimenFiscal: '601',
    domicilioFiscal: 'Av. Reforma 123, Col. Centro, CDMX',
    codigoPostal: '06000',
    telefono: '55-1234-5678',
    email: 'facturacion@iwa-smartops.com'
  });

  const [serieData, setSerieData] = useState({
    serieFacturas: 'A',
    folioInicial: '001',
    folioActual: '003',
    serieNotas: 'NC',
    folioNotasInicial: '001'
  });

  return (
    <div className="space-y-6">
      {/* Info Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Configuración de Facturación</h3>
            <p className="text-sm text-gray-700 mb-3">
              Configura los certificados digitales, datos del emisor y series de facturación para cumplir 
              con los requisitos del SAT.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                <Check className="w-3 h-3" />
                Certificado válido
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Válido hasta: 31/12/2025
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('certificados')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'certificados'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-5 h-5" />
              Certificados Digitales
            </button>
            <button
              onClick={() => setActiveTab('datos')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'datos'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Datos del Emisor
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'series'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Series y Folios
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Certificados Tab */}
          {activeTab === 'certificados' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">Certificados de Sello Digital (CSD)</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Carga los archivos .cer y .key proporcionados por el SAT para poder timbrar facturas
                </p>
              </div>

              {/* Archivo .cer */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Archivo .cer (Certificado) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".cer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCertificadoData({ ...certificadoData, cerFile: file });
                    }}
                    className="hidden"
                    id="cer-file"
                  />
                  <label
                    htmlFor="cer-file"
                    className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D0323A] hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    {certificadoData.cerFile ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900">{certificadoData.cerFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Seleccionar archivo .cer</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Archivo .key */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Archivo .key (Llave privada) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".key"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCertificadoData({ ...certificadoData, keyFile: file });
                    }}
                    className="hidden"
                    id="key-file"
                  />
                  <label
                    htmlFor="key-file"
                    className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D0323A] hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    {certificadoData.keyFile ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900">{certificadoData.keyFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Seleccionar archivo .key</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Contraseña de la llave privada *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={certificadoData.password}
                    onChange={(e) => setCertificadoData({ ...certificadoData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="Contraseña proporcionada por el SAT"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Esta contraseña es necesaria para firmar las facturas electrónicamente
                </p>
              </div>

              {/* Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-900 mb-1">Certificado válido y activo</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-green-700">
                      <div>
                        <span className="text-green-600">RFC:</span> IWA010101ABC
                      </div>
                      <div>
                        <span className="text-green-600">Vigencia:</span> Hasta 31/12/2025
                      </div>
                      <div>
                        <span className="text-green-600">No. Certificado:</span> 20001000000300022323
                      </div>
                      <div>
                        <span className="text-green-600">Emisión:</span> 01/01/2024
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Probar Conexión
                </button>
                <button className="px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors">
                  Guardar Certificados
                </button>
              </div>
            </div>
          )}

          {/* Datos del Emisor Tab */}
          {activeTab === 'datos' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">Datos Fiscales del Emisor</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Información que aparecerá en todas las facturas emitidas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razón Social */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Razón Social / Nombre *
                  </label>
                  <input
                    type="text"
                    value={datosEmisor.razonSocial}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, razonSocial: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>

                {/* RFC */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    RFC *
                  </label>
                  <input
                    type="text"
                    value={datosEmisor.rfc}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, rfc: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent font-mono"
                  />
                </div>

                {/* Régimen Fiscal */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Régimen Fiscal *
                  </label>
                  <select
                    value={datosEmisor.regimenFiscal}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, regimenFiscal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="601">601 - General de Ley Personas Morales</option>
                    <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                    <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                  </select>
                </div>

                {/* Domicilio */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Domicilio Fiscal *
                  </label>
                  <input
                    type="text"
                    value={datosEmisor.domicilioFiscal}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, domicilioFiscal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={datosEmisor.codigoPostal}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, codigoPostal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={datosEmisor.telefono}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Email de facturación
                  </label>
                  <input
                    type="email"
                    value={datosEmisor.email}
                    onChange={(e) => setDatosEmisor({ ...datosEmisor, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Series y Folios Tab */}
          {activeTab === 'series' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">Series y Folios</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configura las series y folios para facturación y notas de crédito
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Facturas */}
                <div className="md:col-span-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-gray-900 mb-4">Facturas de Ingreso</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Serie</label>
                      <input
                        type="text"
                        value={serieData.serieFacturas}
                        onChange={(e) => setSerieData({ ...serieData, serieFacturas: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] bg-white"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Folio inicial</label>
                      <input
                        type="text"
                        value={serieData.folioInicial}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Folio actual</label>
                      <input
                        type="text"
                        value={serieData.folioActual}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Notas de Crédito */}
                <div className="md:col-span-3 bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-gray-900 mb-4">Notas de Crédito</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Serie</label>
                      <input
                        type="text"
                        value={serieData.serieNotas}
                        onChange={(e) => setSerieData({ ...serieData, serieNotas: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] bg-white"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Folio inicial</label>
                      <input
                        type="text"
                        value={serieData.folioNotasInicial}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Folio actual</label>
                      <input
                        type="text"
                        value="001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900 mb-1">
                      <strong>Importante:</strong> Los folios no se pueden reiniciar
                    </p>
                    <p className="text-xs text-yellow-700">
                      Una vez emitida una factura, el folio se incrementa automáticamente y no puede modificarse.
                      Solo puedes cambiar la serie de las nuevas facturas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors">
                  Guardar Series
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
