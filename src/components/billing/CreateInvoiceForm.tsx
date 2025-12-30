import { useState } from 'react';
import { X, User, FileText, Package, Plus, Trash2, Save, Send, Loader2, CheckCircle } from 'lucide-react';
import type {Invoice, InvoiceConcept, Client} from './BillingScreen';
import { invoiceGeneratorService } from '../../services/billing/invoiceGeneratorService';

type Props = {
  clients: Client[];
  invoice?: Invoice | null;
  onClose: () => void;
  onCreate: (invoiceData: Omit<Invoice, 'id'>) => void;
};

type TimbradoState = 'idle' | 'timbrado' | 'success' | 'error';

export function CreateInvoiceForm({ clients, invoice, onClose, onCreate }: Props) {
  const isEditing = !!invoice;

  const [activeStep, setActiveStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    invoice ? clients.find(c => c.rfc === invoice.rfc) || null : null
  );
  const [searchClient, setSearchClient] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Datos de la factura
  const [formData, setFormData] = useState({
    tipoCFDI: invoice?.tipoCFDI || 'I' as 'I' | 'E' | 'P',
    metodoPago: invoice?.metodoPago || 'PUE',
    formaPago: invoice?.formaPago || '01',
    moneda: invoice?.moneda || 'MXN',
    tipoCambio: '1.00',
    lugarExpedicion: invoice?.lugarExpedicion || '64000',
    regimenFiscal: invoice?.regimenFiscal || '601',
    estado: invoice?.estado || 'pendiente_timbrado' as Invoice['estado']
  });

  // Conceptos
  const [conceptos, setConceptos] = useState<InvoiceConcept[]>(
    invoice?.conceptos || []
  );

  const [newConcept, setNewConcept] = useState({
    claveProdServ: '',
    cantidad: 1,
    unidad: 'E48',
    descripcion: '',
    precioUnitario: 0,
    iva: 16
  });

  const [timbradoState, setTimbradoState] = useState<TimbradoState>('idle');
  const [timbradoMessage, setTimbradoMessage] = useState('');

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.rfc.toLowerCase().includes(searchClient.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchClient(client.nombre);
    setShowClientDropdown(false);
  };

  const handleAddConcept = () => {
    if (newConcept.descripcion && newConcept.precioUnitario > 0) {
      const subtotal = newConcept.cantidad * newConcept.precioUnitario;
      const ivaAmount = subtotal * (newConcept.iva / 100);
      const total = subtotal + ivaAmount;

      const concept: InvoiceConcept = {
        id: String(conceptos.length + 1),
        claveProdServ: newConcept.claveProdServ || '01010101',
        cantidad: newConcept.cantidad,
        unidad: newConcept.unidad,
        descripcion: newConcept.descripcion,
        precioUnitario: newConcept.precioUnitario,
        iva: ivaAmount,
        total: total
      };

      setConceptos([...conceptos, concept]);

      // Reset form
      setNewConcept({
        claveProdServ: '',
        cantidad: 1,
        unidad: 'E48',
        descripcion: '',
        precioUnitario: 0,
        iva: 16
      });
    }
  };

  const handleRemoveConcept = (id: string) => {
    setConceptos(conceptos.filter(c => c.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = conceptos.reduce((sum, c) => {
      const conceptSubtotal = c.cantidad * c.precioUnitario;
      return sum + conceptSubtotal;
    }, 0);

    const iva = conceptos.reduce((sum, c) => sum + c.iva, 0);
    const total = subtotal + iva;

    return { subtotal, iva, total };
  };

  const totals = calculateTotals();

  const handleSaveDraft = () => {
    if (!selectedClient || conceptos.length === 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const invoiceData: Omit<Invoice, 'id'> = {
      folio: '',
      cliente: selectedClient.nombre,
      rfc: selectedClient.rfc,
      fechaEmision: new Date().toISOString(),
      total: totals.total,
      subtotal: totals.subtotal,
      iva: totals.iva,
      estado: 'pendiente_timbrado',
      metodoPago: formData.metodoPago,
      formaPago: formData.formaPago,
      usoCFDI: selectedClient.usoCFDI,
      tipoCFDI: formData.tipoCFDI,
      moneda: formData.moneda,
      conceptos: conceptos,
      lugarExpedicion: formData.lugarExpedicion,
      regimenFiscal: formData.regimenFiscal
    };

    onCreate(invoiceData);
  };

  const handleTimbrar = async () => {
    if (!selectedClient || conceptos.length === 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setTimbradoState('timbrado');
    setTimbradoMessage('Conectando con el PAC...');

    try {
      // Simular proceso de timbrado
      await new Promise(resolve => setTimeout(resolve, 800));
      setTimbradoMessage('Validando estructura del CFDI...');
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setTimbradoMessage('Enviando al SAT...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimbradoMessage('Recibiendo respuesta del SAT...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setTimbradoMessage('Generando sello digital...');
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Crear factura temporal para timbrar
      const tempInvoice: Invoice = {
        id: 'temp',
        folio: '',
        cliente: selectedClient.nombre,
        rfc: selectedClient.rfc,
        fechaEmision: new Date().toISOString(),
        total: totals.total,
        subtotal: totals.subtotal,
        iva: totals.iva,
        estado: 'pendiente_timbrado',
        metodoPago: formData.metodoPago,
        formaPago: formData.formaPago,
        usoCFDI: selectedClient.usoCFDI,
        tipoCFDI: formData.tipoCFDI,
        moneda: formData.moneda,
        conceptos: conceptos,
        lugarExpedicion: formData.lugarExpedicion,
        regimenFiscal: formData.regimenFiscal
      };

      // Timbrar factura
      const timbradaInvoice = await invoiceGeneratorService.timbrarFactura(tempInvoice);
      
      setTimbradoState('success');
      setTimbradoMessage('¡Factura timbrada exitosamente!');

      // Esperar un momento para mostrar el éxito
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear la factura con el UUID generado
      const invoiceData: Omit<Invoice, 'id'> = {
        folio: '',
        uuid: timbradaInvoice.uuid,
        cliente: selectedClient.nombre,
        rfc: selectedClient.rfc,
        fechaEmision: new Date().toISOString(),
        total: totals.total,
        subtotal: totals.subtotal,
        iva: totals.iva,
        estado: 'vigente',
        metodoPago: formData.metodoPago,
        formaPago: formData.formaPago,
        usoCFDI: selectedClient.usoCFDI,
        tipoCFDI: formData.tipoCFDI,
        moneda: formData.moneda,
        conceptos: conceptos,
        lugarExpedicion: formData.lugarExpedicion,
        regimenFiscal: formData.regimenFiscal
      };

      onCreate(invoiceData);
    } catch (error) {
      setTimbradoState('error');
      setTimbradoMessage('Error al timbrar la factura. Intente nuevamente.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">
                {isEditing ? 'Editar Factura' : 'Nueva Factura CFDI'}
              </h2>
              <p className="text-white/90 text-sm">
                Completa los datos para emitir la factura electrónica
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === 1 ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                activeStep === 1 ? 'bg-white text-[#D0323A]' : 'bg-white/20'
              }`}>
                1
              </div>
              <span className="text-sm">Cliente</span>
            </button>
            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === 2 ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                activeStep === 2 ? 'bg-white text-[#D0323A]' : 'bg-white/20'
              }`}>
                2
              </div>
              <span className="text-sm">Datos Fiscales</span>
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === 3 ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                activeStep === 3 ? 'bg-white text-[#D0323A]' : 'bg-white/20'
              }`}>
                3
              </div>
              <span className="text-sm">Conceptos</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Cliente */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Seleccionar Cliente</h3>
                  <p className="text-sm text-gray-600">Busca y selecciona el receptor de la factura</p>
                </div>
              </div>

              {/* Client Search */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-2">
                  Buscar cliente *
                </label>
                <input
                  type="text"
                  value={searchClient}
                  onChange={(e) => {
                    setSearchClient(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder="Escribe el nombre o RFC del cliente..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                />

                {/* Dropdown */}
                {showClientDropdown && filteredClients.length > 0 && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowClientDropdown(false)}
                    />
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <p className="text-gray-900">{client.nombre}</p>
                          <p className="text-sm text-gray-600">RFC: {client.rfc}</p>
                          <p className="text-xs text-gray-500">{client.domicilioFiscal}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Selected Client */}
              {selectedClient && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">{selectedClient.nombre}</p>
                        <p className="text-sm text-gray-600">RFC: {selectedClient.rfc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClient(null);
                        setSearchClient('');
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Domicilio Fiscal</p>
                      <p className="text-sm text-gray-900">{selectedClient.domicilioFiscal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Uso CFDI</p>
                      <p className="text-sm text-gray-900">{selectedClient.usoCFDI}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Datos Fiscales */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Datos Fiscales del CFDI</h3>
                  <p className="text-sm text-gray-600">Configura los datos fiscales de la factura</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo de CFDI */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Tipo de CFDI *
                  </label>
                  <select
                    value={formData.tipoCFDI}
                    onChange={(e) => setFormData({ ...formData, tipoCFDI: e.target.value as 'I' | 'E' | 'P' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="I">I - Ingreso</option>
                    <option value="E">E - Egreso</option>
                    <option value="P">P - Pago</option>
                  </select>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={formData.metodoPago}
                    onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="PUE">PUE - Pago en una sola exhibición</option>
                    <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                  </select>
                </div>

                {/* Forma de Pago */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Forma de Pago *
                  </label>
                  <select
                    value={formData.formaPago}
                    onChange={(e) => setFormData({ ...formData, formaPago: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="01">01 - Efectivo</option>
                    <option value="02">02 - Cheque nominativo</option>
                    <option value="03">03 - Transferencia electrónica</option>
                    <option value="04">04 - Tarjeta de crédito</option>
                    <option value="28">28 - Tarjeta de débito</option>
                    <option value="99">99 - Por definir</option>
                  </select>
                </div>

                {/* Moneda */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Moneda *
                  </label>
                  <select
                    value={formData.moneda}
                    onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                {/* Lugar de Expedición */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Lugar de Expedición (CP) *
                  </label>
                  <input
                    type="text"
                    value={formData.lugarExpedicion}
                    onChange={(e) => setFormData({ ...formData, lugarExpedicion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    placeholder="64000"
                  />
                </div>

                {/* Régimen Fiscal */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Régimen Fiscal *
                  </label>
                  <select
                    value={formData.regimenFiscal}
                    onChange={(e) => setFormData({ ...formData, regimenFiscal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="601">601 - General de Ley Personas Morales</option>
                    <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                    <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                    <option value="606">606 - Arrendamiento</option>
                    <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                    <option value="621">621 - Incorporación Fiscal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Conceptos */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Conceptos de la Factura</h3>
                  <p className="text-sm text-gray-600">Agrega los productos o servicios a facturar</p>
                </div>
              </div>

              {/* Add Concept Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-gray-900 mb-4">Agregar Concepto</h4>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Descripción *</label>
                    <input
                      type="text"
                      value={newConcept.descripcion}
                      onChange={(e) => setNewConcept({ ...newConcept, descripcion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A]"
                      placeholder="Producto o servicio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Cantidad *</label>
                    <input
                      type="number"
                      min="1"
                      value={newConcept.cantidad}
                      onChange={(e) => setNewConcept({ ...newConcept, cantidad: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Unidad</label>
                    <select
                      value={newConcept.unidad}
                      onChange={(e) => setNewConcept({ ...newConcept, unidad: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] bg-white"
                    >
                      <option value="E48">E48 - Servicio</option>
                      <option value="H87">H87 - Pieza</option>
                      <option value="XNA">XNA - No aplica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Precio Unit. *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newConcept.precioUnitario}
                      onChange={(e) => setNewConcept({ ...newConcept, precioUnitario: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">IVA %</label>
                    <select
                      value={newConcept.iva}
                      onChange={(e) => setNewConcept({ ...newConcept, iva: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] bg-white"
                    >
                      <option value="0">0%</option>
                      <option value="16">16%</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddConcept}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Concepto
                </button>
              </div>

              {/* Concepts List */}
              {conceptos.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs text-gray-700">Descripción</th>
                        <th className="text-center px-4 py-3 text-xs text-gray-700">Cant.</th>
                        <th className="text-center px-4 py-3 text-xs text-gray-700">Unidad</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-700">P. Unit.</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-700">IVA</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-700">Total</th>
                        <th className="text-center px-4 py-3 text-xs text-gray-700">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conceptos.map((concepto) => (
                        <tr key={concepto.id} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-900">{concepto.descripcion}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-center">{concepto.cantidad}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-center">{concepto.unidad}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(concepto.precioUnitario)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatCurrency(concepto.iva)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(concepto.total)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveConcept(concepto.id)}
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
              )}

              {/* Totals */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-xl text-gray-900">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">IVA:</span>
                    <span className="text-xl text-gray-900">{formatCurrency(totals.iva)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t-2 border-blue-300">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-3xl text-[#D0323A]">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timbrado Progress */}
        {timbradoState !== 'idle' && (
          <div className={`px-6 py-3 flex items-center gap-3 ${
            timbradoState === 'success' ? 'bg-green-50 border-t border-green-200' :
            timbradoState === 'error' ? 'bg-red-50 border-t border-red-200' :
            'bg-blue-50 border-t border-blue-200'
          }`}>
            {timbradoState === 'timbrado' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
            {timbradoState === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {timbradoState === 'error' && <X className="w-5 h-5 text-red-600" />}
            <span className={`text-sm ${
              timbradoState === 'success' ? 'text-green-700' :
              timbradoState === 'error' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {timbradoMessage}
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-2">
            {activeStep > 1 && timbradoState === 'idle' && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={activeStep === 1 && !selectedClient}
                className="px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveDraft}
                  disabled={conceptos.length === 0 || timbradoState === 'timbrado'}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Guardar Borrador
                </button>
                <button
                  onClick={handleTimbrar}
                  disabled={conceptos.length === 0 || timbradoState === 'timbrado'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {timbradoState === 'timbrado' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : timbradoState === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {timbradoState === 'timbrado' ? 'Timbrando...' : timbradoState === 'success' ? 'Timbrado' : 'Timbrar Factura'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
