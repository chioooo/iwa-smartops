import React, { useState } from 'react';
import { FileText, Plus, Receipt } from 'lucide-react';
import { BillingDashboard } from './BillingDashboard';
import { InvoiceTable } from './InvoiceTable';
import { CreateInvoiceForm } from './CreateInvoiceForm';
import { InvoiceDetailPanel } from './InvoiceDetailPanel';
import { CancelInvoiceModal } from './CancelInvoiceModal';
import { PaymentComplementForm } from './PaymentComplementForm';

export type Invoice = {
  id: string;
  folio: string;
  uuid?: string;
  cliente: string;
  rfc: string;
  fechaEmision: string;
  total: number;
  subtotal: number;
  iva: number;
  estado: 'vigente' | 'pagada' | 'cancelada' | 'pendiente_timbrado';
  metodoPago: string;
  formaPago: string;
  usoCFDI: string;
  tipoCFDI: 'I' | 'E' | 'P';
  moneda: string;
  conceptos: InvoiceConcept[];
  lugarExpedicion: string;
  regimenFiscal: string;
};

export type InvoiceConcept = {
  id: string;
  claveProdServ: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  precioUnitario: number;
  iva: number;
  total: number;
};

export type Client = {
  id: string;
  nombre: string;
  rfc: string;
  domicilioFiscal: string;
  usoCFDI: string;
  email?: string;
};

export function BillingScreen() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'settings' | 'dashboard'>('invoices');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Mock data - clientes
  const [clients] = useState<Client[]>([
    {
      id: '1',
      nombre: 'Acme Corporation S.A. de C.V.',
      rfc: 'ACM990101ABC',
      domicilioFiscal: 'Av. Reforma 123, CDMX',
      usoCFDI: 'G03',
      email: 'facturacion@acme.com'
    },
    {
      id: '2',
      nombre: 'TechSolutions México',
      rfc: 'TSM850615XYZ',
      domicilioFiscal: 'Blvd. Tecnológico 456, Monterrey',
      usoCFDI: 'G01',
      email: 'contabilidad@techsolutions.mx'
    },
    {
      id: '3',
      nombre: 'Distribuidora Nacional',
      rfc: 'DNL920320KLM',
      domicilioFiscal: 'Av. Insurgentes 789, Guadalajara',
      usoCFDI: 'G03',
      email: 'facturas@distribuidora.mx'
    },
  ]);

  // Mock data - facturas
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      folio: 'A-001',
      uuid: '12345678-1234-1234-1234-123456789012',
      cliente: 'Acme Corporation S.A. de C.V.',
      rfc: 'ACM990101ABC',
      fechaEmision: '2024-11-26T10:30:00',
      total: 11600.00,
      subtotal: 10000.00,
      iva: 1600.00,
      estado: 'vigente',
      metodoPago: 'PUE',
      formaPago: '03',
      usoCFDI: 'G03',
      tipoCFDI: 'I',
      moneda: 'MXN',
      lugarExpedicion: '64000',
      regimenFiscal: '601',
      conceptos: [
        {
          id: '1',
          claveProdServ: '81112000',
          cantidad: 2,
          unidad: 'E48',
          descripcion: 'Servicio de consultoría tecnológica',
          precioUnitario: 5000.00,
          iva: 1600.00,
          total: 11600.00
        }
      ]
    },
    {
      id: '2',
      folio: 'A-002',
      uuid: '87654321-4321-4321-4321-210987654321',
      cliente: 'TechSolutions México',
      rfc: 'TSM850615XYZ',
      fechaEmision: '2024-11-25T14:15:00',
      total: 23200.00,
      subtotal: 20000.00,
      iva: 3200.00,
      estado: 'pagada',
      metodoPago: 'PPD',
      formaPago: '01',
      usoCFDI: 'G01',
      tipoCFDI: 'I',
      moneda: 'MXN',
      lugarExpedicion: '64000',
      regimenFiscal: '601',
      conceptos: [
        {
          id: '1',
          claveProdServ: '43231500',
          cantidad: 5,
          unidad: 'H87',
          descripcion: 'Licencias de software empresarial',
          precioUnitario: 4000.00,
          iva: 3200.00,
          total: 23200.00
        }
      ]
    },
    {
      id: '3',
      folio: 'A-003',
      cliente: 'Distribuidora Nacional',
      rfc: 'DNL920320KLM',
      fechaEmision: '2024-11-26T09:00:00',
      total: 5800.00,
      subtotal: 5000.00,
      iva: 800.00,
      estado: 'pendiente_timbrado',
      metodoPago: 'PUE',
      formaPago: '04',
      usoCFDI: 'G03',
      tipoCFDI: 'I',
      moneda: 'MXN',
      lugarExpedicion: '64000',
      regimenFiscal: '601',
      conceptos: [
        {
          id: '1',
          claveProdServ: '81111500',
          cantidad: 1,
          unidad: 'E48',
          descripcion: 'Servicio de mantenimiento preventivo',
          precioUnitario: 5000.00,
          iva: 800.00,
          total: 5800.00
        }
      ]
    },
  ]);

  const handleCreateInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: String(invoices.length + 1),
      folio: `A-${String(invoices.length + 1).padStart(3, '0')}`,
    };
    setInvoices([...invoices, newInvoice]);
    setShowCreateInvoice(false);
  };

  const handleUpdateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, ...updates } : inv));
    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, ...updates });
    }
  };

  const handleCancelInvoice = (invoiceId: string, motivo: string, folioSustitucion?: string) => {
    handleUpdateInvoice(invoiceId, { estado: 'cancelada' });
    setShowCancelModal(false);
    setSelectedInvoice(null);
  };

  const todayInvoices = invoices.filter(inv => {
    const today = new Date().toISOString().split('T')[0];
    return inv.fechaEmision.split('T')[0] === today;
  }).length;

  const monthInvoices = invoices.length; // Simplified
  const totalBilled = invoices
    .filter(inv => inv.estado !== 'cancelada')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter(inv => inv.estado === 'pendiente_timbrado').length;
  const cancelledInvoices = invoices.filter(inv => inv.estado === 'cancelada').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 mb-2">Facturación Electrónica (CFDI)</h1>
              <p className="text-gray-600">Gestión completa de facturas electrónicas</p>
            </div>
            {activeTab === 'invoices' && (
              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setShowCreateInvoice(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nueva Factura
              </button>
            )}
            {activeTab === 'payments' && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Complemento de Pago
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'invoices'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Receipt className="w-5 h-5" />
              Facturas
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {invoices.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Receipt className="w-5 h-5" />
              Complementos de Pago
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-[#D0323A] text-[#D0323A]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Vista General
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <BillingDashboard
            todayInvoices={todayInvoices}
            monthInvoices={monthInvoices}
            totalBilled={totalBilled}
            pendingInvoices={pendingInvoices}
            cancelledInvoices={cancelledInvoices}
            invoices={invoices}
            onCreateInvoice={() => setShowCreateInvoice(true)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceTable
            invoices={invoices}
            onSelectInvoice={setSelectedInvoice}
            onCancelInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setShowCancelModal(true);
            }}
            selectedInvoiceId={selectedInvoice?.id}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentComplementForm
            invoices={invoices.filter(inv => inv.estado === 'vigente' && inv.metodoPago === 'PPD')}
            clients={clients}
            onCreatePayment={() => {}}
          />
        )}

      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailPanel
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onCancel={() => setShowCancelModal(true)}
        />
      )}

      {/* Create/Edit Invoice Modal */}
      {showCreateInvoice && (
        <CreateInvoiceForm
          clients={clients}
          invoice={editingInvoice}
          onClose={() => {
            setShowCreateInvoice(false);
            setEditingInvoice(null);
          }}
          onCreate={handleCreateInvoice}
        />
      )}

      {/* Cancel Invoice Modal */}
      {showCancelModal && selectedInvoice && (
        <CancelInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setShowCancelModal(false)}
          onCancel={handleCancelInvoice}
        />
      )}
    </div>
  );
}