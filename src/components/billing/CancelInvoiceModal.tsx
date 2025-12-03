import { useState } from 'react';
import { X, AlertTriangle, XCircle } from 'lucide-react';
import type {Invoice} from './BillingScreen';

type Props = {
  invoice: Invoice;
  onClose: () => void;
  onCancel: (invoiceId: string, motivo: string, folioSustitucion?: string) => void;
};

const motivosCancelacion = [
  { value: '01', label: '01 - Comprobante emitido con errores con relación' },
  { value: '02', label: '02 - Comprobante emitido con errores sin relación' },
  { value: '03', label: '03 - No se llevó a cabo la operación' },
  { value: '04', label: '04 - Operación nominativa relacionada en una factura global' },
];

export function CancelInvoiceModal({ invoice, onClose, onCancel }: Props) {
  const [motivo, setMotivo] = useState('');
  const [folioSustitucion, setFolioSustitucion] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const requiresSustitucion = motivo === '01';

  const handleSubmit = () => {
    if (!motivo || !confirmed) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (requiresSustitucion && !folioSustitucion) {
      alert('Debes indicar el folio de sustitución');
      return;
    }

    onCancel(invoice.id, motivo, folioSustitucion || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white mb-1">Cancelar Factura</h2>
                <p className="text-white/90 text-sm">Folio: {invoice.folio}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 mb-1">
                  <strong>Atención:</strong> Esta acción no se puede deshacer
                </p>
                <p className="text-xs text-yellow-700">
                  La cancelación de una factura es un proceso irreversible que debe realizarse conforme
                  a las disposiciones del SAT. Asegúrate de seleccionar el motivo correcto.
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Cliente</p>
                <p className="text-sm text-gray-900">{invoice.cliente}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">RFC</p>
                <p className="text-sm text-gray-900 font-mono">{invoice.rfc}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-sm text-gray-900">
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(invoice.total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Fecha</p>
                <p className="text-sm text-gray-900">
                  {new Date(invoice.fechaEmision).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
          </div>

          {/* Motivo de Cancelación */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Motivo de cancelación *
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Selecciona un motivo...</option>
              {motivosCancelacion.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Catálogo de motivos de cancelación según el SAT
            </p>
          </div>

          {/* Folio de Sustitución */}
          {requiresSustitucion && (
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">
                Folio de sustitución *
              </label>
              <input
                type="text"
                value={folioSustitucion}
                onChange={(e) => setFolioSustitucion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="UUID de la factura que sustituye a esta"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa el UUID de la nueva factura que reemplaza a esta
              </p>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 rounded"
              />
              <span className="text-sm text-gray-700">
                Confirmo que deseo cancelar esta factura y entiendo que esta acción es irreversible.
                La cancelación será notificada al SAT y al cliente.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleSubmit}
              disabled={!motivo || !confirmed || (requiresSustitucion && !folioSustitucion)}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Cancelación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
