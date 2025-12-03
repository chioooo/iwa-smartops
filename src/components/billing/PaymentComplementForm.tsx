import { useState } from 'react';
import { Receipt, Plus, Calendar, DollarSign, CreditCard, Trash2 } from 'lucide-react';
import type {Invoice, Client} from './BillingScreen';

type Props = {
  invoices: Invoice[];
  clients: Client[];
  onCreatePayment: () => void;
};

type PaymentParcialidad = {
  id: string;
  facturaId: string;
  folio: string;
  montoPagado: number;
  saldoAnterior: number;
  saldoInsoluto: number;
};

export function PaymentComplementForm({ invoices, clients, onCreatePayment }: Props) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [formaPago, setFormaPago] = useState('03');
  const [parcialidades, setParcialidades] = useState<PaymentParcialidad[]>([]);

  // Facturas del cliente seleccionado
  const clientInvoices = selectedClient
    ? invoices.filter(inv => inv.rfc === selectedClient.rfc && inv.metodoPago === 'PPD')
    : [];

  const handleAddParcialidad = (invoice: Invoice) => {
    // Simulamos saldo pendiente
    const saldoAnterior = invoice.total;
    const existingPayment = parcialidades.find(p => p.facturaId === invoice.id);

    if (existingPayment) {
      alert('Esta factura ya está agregada');
      return;
    }

    const newParcialidad: PaymentParcialidad = {
      id: String(parcialidades.length + 1),
      facturaId: invoice.id,
      folio: invoice.folio,
      montoPagado: 0,
      saldoAnterior: saldoAnterior,
      saldoInsoluto: saldoAnterior
    };

    setParcialidades([...parcialidades, newParcialidad]);
  };

  const handleUpdateParcialidad = (id: string, montoPagado: number) => {
    setParcialidades(parcialidades.map(p => {
      if (p.id === id) {
        return {
          ...p,
          montoPagado: montoPagado,
          saldoInsoluto: p.saldoAnterior - montoPagado
        };
      }
      return p;
    }));
  };

  const handleRemoveParcialidad = (id: string) => {
    setParcialidades(parcialidades.filter(p => p.id !== id));
  };

  const totalPagado = parcialidades.reduce((sum, p) => sum + p.montoPagado, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Receipt className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Complemento de Pago (CFDI tipo P)</h3>
            <p className="text-sm text-gray-700 mb-3">
              Los complementos de pago se utilizan para registrar parcialidades en facturas con método de pago "PPD - Pago en parcialidades o diferido".
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                CFDI 4.0
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                Tipo P - Pago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-6">Datos del Complemento de Pago</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cliente */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                setSelectedClient(client || null);
                setParcialidades([]);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
            >
              <option value="">Selecciona un cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre} - {client.rfc}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Pago */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Fecha de pago *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
              />
            </div>
          </div>

          {/* Forma de Pago */}
          <div className="md:col-span-3">
            <label className="block text-sm text-gray-700 mb-2">
              Forma de pago *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="01">01 - Efectivo</option>
                <option value="02">02 - Cheque nominativo</option>
                <option value="03">03 - Transferencia electrónica</option>
                <option value="04">04 - Tarjeta de crédito</option>
                <option value="28">28 - Tarjeta de débito</option>
              </select>
            </div>
          </div>
        </div>

        {/* Facturas Disponibles */}
        {selectedClient && clientInvoices.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-900 mb-3">Facturas Pendientes de Pago</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clientInvoices
                .filter(inv => !parcialidades.find(p => p.facturaId === inv.id))
                .map((invoice) => (
                  <button
                    key={invoice.id}
                    onClick={() => handleAddParcialidad(invoice)}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-left"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-mono">{invoice.folio}</p>
                      <p className="text-xs text-gray-600">{formatCurrency(invoice.total)}</p>
                    </div>
                    <Plus className="w-5 h-5 text-blue-600" />
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Parcialidades */}
        {parcialidades.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-3">Parcialidades de Pago</h4>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-700">Folio</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-700">Saldo Anterior</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-700">Monto Pagado</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-700">Saldo Insoluto</th>
                    <th className="text-center px-4 py-3 text-xs text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {parcialidades.map((parcialidad) => (
                    <tr key={parcialidad.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 font-mono">{parcialidad.folio}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-600">{formatCurrency(parcialidad.saldoAnterior)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max={parcialidad.saldoAnterior}
                          step="0.01"
                          value={parcialidad.montoPagado}
                          onChange={(e) => handleUpdateParcialidad(parcialidad.id, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A]"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm ${parcialidad.saldoInsoluto === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {formatCurrency(parcialidad.saldoInsoluto)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveParcialidad(parcialidad.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <span className="text-gray-900">Total a pagar:</span>
                </div>
                <span className="text-3xl text-[#D0323A]">{formatCurrency(totalPagado)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {parcialidades.length > 0 && totalPagado > 0 && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedClient(null);
                setParcialidades([]);
                setFechaPago(new Date().toISOString().split('T')[0]);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert('Generando complemento de pago...');
                onCreatePayment();
              }}
              className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
            >
              Generar Complemento de Pago
            </button>
          </div>
        )}

        {/* Empty State */}
        {!selectedClient && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Selecciona un cliente</h3>
            <p className="text-gray-600">Elige un cliente para ver sus facturas pendientes de pago</p>
          </div>
        )}

        {selectedClient && clientInvoices.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Sin facturas pendientes</h3>
            <p className="text-gray-600">Este cliente no tiene facturas con método de pago PPD</p>
          </div>
        )}
      </div>
    </div>
  );
}
