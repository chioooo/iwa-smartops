import React, { useState, useEffect } from 'react';
import { sendEmail, getEmailProviders } from '../../services/azure';
import type { EmailProvider, EmailProviderInfo } from '../../services/azure';
import { Search, Download, Mail, Eye, XCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import type {Invoice} from './BillingScreen';

type Props = {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onCancelInvoice: (invoice: Invoice) => void;
  selectedInvoiceId?: string;
};

export function InvoiceTable({ invoices, onSelectInvoice, onCancelInvoice, selectedInvoiceId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterMetodoPago, setFilterMetodoPago] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrado
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.rfc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEstado = filterEstado === 'all' || invoice.estado === filterEstado;
    const matchesMetodoPago = filterMetodoPago === 'all' || invoice.metodoPago === filterMetodoPago;

    return matchesSearch && matchesEstado && matchesMetodoPago;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: Invoice['estado']) => {
    const badges = {
      vigente: 'bg-blue-50 text-blue-700 border-blue-200',
      pagada: 'bg-green-50 text-green-700 border-green-200',
      cancelada: 'bg-red-50 text-red-700 border-red-200',
      pendiente_timbrado: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };

    const labels = {
      vigente: 'Vigente',
      pagada: 'Pagada',
      cancelada: 'Cancelada',
      pendiente_timbrado: 'Pendiente Timbrado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${badges[estado]}`}>
        {labels[estado]}
      </span>
    );
  };

  const getTipoCFDIBadge = (tipo: Invoice['tipoCFDI']) => {
    const badges = {
      I: { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Ingreso' },
      E: { color: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Egreso' },
      P: { color: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'Pago' }
    };

    const badge = badges[tipo];
    return (
      <span className={`px-3 py-1 rounded-full text-xs border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const handleDownloadPDF = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Descargando PDF de factura ${invoice.folio}`);
  };

  const handleDownloadXML = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Descargando XML de factura ${invoice.folio}`);
  };

  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailProviders, setEmailProviders] = useState<EmailProviderInfo[]>([]);
  const [showEmailModal, setShowEmailModal] = useState<Invoice | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | ''>('');
  const [destinatario, setDestinatario] = useState('');

  // Cargar proveedores de correo al montar
  useEffect(() => {
    getEmailProviders().then(providers => {
      setEmailProviders(providers);
      if (providers.length > 0) {
        setSelectedProvider(providers[0].id);
      }
    });
  }, []);

  const openEmailModal = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmailModal(invoice);
    setDestinatario('');
  };

  const closeEmailModal = () => {
    setShowEmailModal(null);
    setDestinatario('');
  };

  const handleSendEmail = async () => {
    if (!showEmailModal || !destinatario || !selectedProvider) return;

    const invoice = showEmailModal;
    setSendingEmail(invoice.id);
    closeEmailModal();

    try {
      const result = await sendEmail({
        to: destinatario,
        subject: `Factura ${invoice.folio} - ${invoice.cliente}`,
        provider: selectedProvider,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D0323A;">Factura Electrónica</h2>
            <p>Estimado cliente,</p>
            <p>Adjunto encontrará su factura con los siguientes datos:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Folio:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${invoice.folio}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>UUID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${invoice.uuid || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Fecha:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${invoice.fechaEmision}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${invoice.total.toFixed(2)} ${invoice.moneda}</td></tr>
            </table>
            <p style="color: #666; font-size: 12px;">Este correo fue generado automáticamente.</p>
          </div>
        `,
      });

      if (result.success) {
        alert(`✅ Factura enviada exitosamente a ${destinatario}`);
      } else {
        alert(`❌ Error al enviar: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error inesperado al enviar el correo`);
      console.error(error);
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por folio, cliente o RFC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
            />
          </div>

          {/* Estado Filter */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="vigente">Vigente</option>
            <option value="pagada">Pagada</option>
            <option value="pendiente_timbrado">Pendiente Timbrado</option>
            <option value="cancelada">Cancelada</option>
          </select>

          {/* Método de Pago Filter */}
          <select
            value={filterMetodoPago}
            onChange={(e) => setFilterMetodoPago(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los métodos de pago</option>
            <option value="PUE">PUE - Pago en una sola exhibición</option>
            <option value="PPD">PPD - Pago en parcialidades</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Folio</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Cliente</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">RFC</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Fecha</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Total</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Estado</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Tipo</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Método Pago</th>
                <th className="text-right px-6 py-4 text-gray-700 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice)}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedInvoiceId === invoice.id ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Folio */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-mono">{invoice.folio}</p>
                        {invoice.uuid && (
                          <p className="text-xs text-gray-500 font-mono">{invoice.uuid.slice(0, 8)}...</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{invoice.cliente}</p>
                    <p className="text-xs text-gray-500">Uso CFDI: {invoice.usoCFDI}</p>
                  </td>

                  {/* RFC */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-mono text-sm">{invoice.rfc}</span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm">{formatDate(invoice.fechaEmision)}</span>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-xs text-gray-500">{invoice.moneda}</p>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    {getEstadoBadge(invoice.estado)}
                  </td>

                  {/* Tipo CFDI */}
                  <td className="px-6 py-4">
                    {getTipoCFDIBadge(invoice.tipoCFDI)}
                  </td>

                  {/* Método Pago */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm">{invoice.metodoPago}</span>
                    <p className="text-xs text-gray-500">{invoice.formaPago}</p>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInvoice(invoice);
                        }}
                        className="p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDownloadPDF(invoice, e)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDownloadXML(invoice, e)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Descargar XML"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => openEmailModal(invoice, e)}
                        disabled={sendingEmail === invoice.id}
                        className={`p-2 rounded-lg transition-colors ${
                          sendingEmail === invoice.id 
                            ? 'text-purple-400 bg-purple-50 cursor-wait' 
                            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                        }`}
                        title="Enviar por correo"
                      >
                        <Mail className={`w-4 h-4 ${sendingEmail === invoice.id ? 'animate-pulse' : ''}`} />
                      </button>
                      {invoice.estado === 'vigente' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelInvoice(invoice);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancelar factura"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredInvoices.length)} de {filteredInvoices.length} facturas
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-[#D0323A] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No se encontraron facturas</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal para enviar correo */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeEmailModal}>
          <div 
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enviar Factura {showEmailModal.folio}
            </h3>
            
            {/* Selector de proveedor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enviar desde:
              </label>
              <div className="flex gap-2">
                {emailProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      selectedProvider === provider.id
                        ? 'border-[#D0323A] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{provider.name}</div>
                  </button>
                ))}
              </div>
              {emailProviders.length === 0 && (
                <p className="text-sm text-red-500">No hay proveedores configurados. Verifica que el servidor esté corriendo.</p>
              )}
            </div>

            {/* Campo de destinatario */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo del destinatario:
              </label>
              <input
                type="email"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="cliente@ejemplo.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={closeEmailModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!destinatario || !selectedProvider}
                className="flex-1 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#b02a31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
