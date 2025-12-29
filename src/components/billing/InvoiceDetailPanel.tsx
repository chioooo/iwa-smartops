import { X, Download, Mail, XCircle, FileText, Calendar, DollarSign, User } from 'lucide-react';
import type {Invoice} from './BillingScreen';
import { invoiceGeneratorService } from '../../services/billing/invoiceGeneratorService';

type Props = {
  invoice: Invoice;
  onClose: () => void;
  onCancel: () => void;
};

export function InvoiceDetailPanel({ invoice, onClose, onCancel }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: Invoice['estado']) => {
    const colors = {
      vigente: 'bg-blue-50 text-blue-700 border-blue-200',
      pagada: 'bg-green-50 text-green-700 border-green-200',
      cancelada: 'bg-red-50 text-red-700 border-red-200',
      pendiente_timbrado: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[estado];
  };

  const getEstadoLabel = (estado: Invoice['estado']) => {
    const labels = {
      vigente: 'Vigente',
      pagada: 'Pagada',
      cancelada: 'Cancelada',
      pendiente_timbrado: 'Pendiente de Timbrado'
    };
    return labels[estado];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-white mb-1">Detalle de Factura</h2>
              <p className="text-white/90 text-sm font-mono">{invoice.folio}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm border ${getEstadoColor(invoice.estado)}`}>
            {getEstadoLabel(invoice.estado)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* UUID */}
            {invoice.uuid && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Folio Fiscal (UUID)</p>
                <p className="text-xs font-mono text-gray-900 break-all">{invoice.uuid}</p>
              </div>
            )}

            {/* Cliente */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-gray-900 text-sm">Datos del Cliente</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Nombre / Razón Social</p>
                  <p className="text-sm text-gray-900">{invoice.cliente}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">RFC</p>
                  <p className="text-sm text-gray-900 font-mono">{invoice.rfc}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uso de CFDI</p>
                  <p className="text-sm text-gray-900">{invoice.usoCFDI}</p>
                </div>
              </div>
            </div>

            {/* Fecha y Lugar */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h3 className="text-gray-900 text-sm">Fecha y Lugar</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Fecha de Emisión</p>
                  <p className="text-sm text-gray-900">{formatDate(invoice.fechaEmision)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lugar de Expedición</p>
                  <p className="text-sm text-gray-900">CP: {invoice.lugarExpedicion}</p>
                </div>
              </div>
            </div>

            {/* Totales */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <h3 className="text-gray-900 text-sm">Importes</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">IVA</span>
                  <span className="text-gray-900">{formatCurrency(invoice.iva)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-gray-900">Total</span>
                  <span className="text-xl text-[#D0323A]">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Datos Fiscales */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="text-gray-900 text-sm">Datos Fiscales</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tipo CFDI</p>
                  <p className="text-sm text-gray-900">{invoice.tipoCFDI}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Moneda</p>
                  <p className="text-sm text-gray-900">{invoice.moneda}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Método Pago</p>
                  <p className="text-sm text-gray-900">{invoice.metodoPago}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Forma Pago</p>
                  <p className="text-sm text-gray-900">{invoice.formaPago}</p>
                </div>
              </div>
            </div>

            {/* Conceptos */}
            <div>
              <h3 className="text-gray-900 text-sm mb-3">Conceptos</h3>
              <div className="space-y-2">
                {invoice.conceptos.map((concepto) => (
                  <div key={concepto.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-900 flex-1">{concepto.descripcion}</p>
                      <span className="text-sm text-[#D0323A] ml-2">{formatCurrency(concepto.total)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Cant: {concepto.cantidad}</span>
                      <span>P.U: {formatCurrency(concepto.precioUnitario)}</span>
                      <span>IVA: {formatCurrency(concepto.iva)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => invoiceGeneratorService.downloadPDF(invoice)}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => invoiceGeneratorService.downloadXML(invoice)}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              XML
            </button>
          </div>
          <button
            onClick={() => alert('Enviando por correo...')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Enviar al Cliente
          </button>
          {invoice.estado === 'vigente' && (
            <button
              onClick={onCancel}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancelar Factura
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
