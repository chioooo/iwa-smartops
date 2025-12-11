import React, { useState } from 'react';
import { X, FileText, Calendar, Filter, Download } from 'lucide-react';
import type {Report, ReportFilters} from './ReportsScreen';

type Props = {
  onClose: () => void;
  onCreate: (reportData: Omit<Report, 'id' | 'generationDate' | 'status'>) => void;
};

const getDateString = (date: Date) => date.toLocaleDateString('en-CA');

export function CreateReportModal({ onClose, onCreate }: Props) {
  const [formData, setFormData] = useState({
    tipo: 'ventas' as Report['tipo'],
    format: 'pdf' as Report['format'],
    generatedBy: 'Juan Pérez'
  });

  const [filters, setFilters] = useState<ReportFilters>({
      startDate: getDateString(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      endDate: getDateString(new Date())
  });

  const [dateError, setDateError] = useState<string>('');

  const reportTypes = [
    { value: 'ventas', label: 'Reporte de Ventas', description: 'Análisis de ventas, ingresos y tendencias' },
    { value: 'inventario', label: 'Reporte de Inventario', description: 'Stock, rotación y movimientos de productos' },
    { value: 'facturacion', label: 'Reporte de Facturación', description: 'Facturas emitidas, CFDI y totales fiscales' },
    { value: 'servicios', label: 'Reporte de Servicios', description: 'Servicios realizados, órdenes y tiempos' },
    { value: 'clientes', label: 'Reporte de Clientes', description: 'Análisis de clientes y frecuencia de compra' },
    { value: 'utilidades', label: 'Reporte de Utilidades', description: 'Ingresos, egresos y margen de ganancia' }
  ];

  const todayDate = getDateString(new Date());

  const parseDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatMonthYear = (isoDate: string) => {
    return parseDate(isoDate).toLocaleDateString('es-MX', { 
      month: 'short',
      year: 'numeric'
    });
  };

  const getMonthAndYear = (isoDate: string) => {
    const date = parseDate(isoDate);
    return {
      month: date.toLocaleDateString('es-MX', { month: 'short' }),
      year: date.getFullYear().toString()
    };
  };

  const formatReportName = (startDate: string, endDate: string, reportLabel: string): string => {
    const { month: startMonth, year: startYear } = getMonthAndYear(startDate);
    const { month: endMonth, year: endYear } = getMonthAndYear(endDate);

    if (startYear === endYear && startMonth === endMonth) {
      return `${reportLabel} - ${formatMonthYear(startDate)}`;
    }

    if (startYear === endYear) {
      return `${reportLabel} - ${startMonth} a ${endMonth} ${startYear}`;
    }

    return `${reportLabel} - ${formatMonthYear(startDate)} a ${formatMonthYear(endDate)}`;
  };

  const formatDatePreview = (isoDate: string) => {
    return isoDate?.split('-').reverse().join('/') || '';
  };

  const selectedType = reportTypes.find(t => t.value === formData.tipo);

  const validateDates = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) {
      return 'Por favor selecciona un rango de fechas válido';
    }

    if (startDate > todayDate) {
      return `La fecha de inicio no puede ser mayor a la fecha actual (${formatDatePreview(todayDate)})`;
    }

    if (endDate > todayDate) {
      return `La fecha de fin no puede ser mayor a la fecha actual (${formatDatePreview(todayDate)})`;
    }

    if (startDate > endDate) {
      return 'La fecha de inicio no puede ser mayor a la fecha de fin';
    }

    return '';
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const updates: Partial<ReportFilters> = { [field]: value };
    
    if (field === 'startDate' && filters.endDate && value > filters.endDate) {
      updates.endDate = value;
    } else if (field === 'endDate' && filters.startDate && value < filters.startDate) {
      updates.startDate = value;
    }
    
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    
    const error = validateDates(newFilters.startDate || '', newFilters.endDate || '');
    setDateError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType) {
      setDateError('Por favor selecciona un tipo de reporte válido');
      return;
    }

    const error = validateDates(filters.startDate || '', filters.endDate || '');
    if (error) {
      setDateError(error);
      return;
    }

    setDateError('');
    onCreate({
      name: formatReportName(filters.startDate!, filters.endDate!, selectedType.label),
      tipo: formData.tipo,
      format: formData.format,
      generatedBy: formData.generatedBy,
      parameters: filters
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white mb-1">Generar Nuevo Reporte</h2>
                <p className="text-white/90 text-sm">Configura los parámetros del reporte</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Tipo de reporte */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">
                Tipo de reporte *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((tipo) => (
                  <label
                    key={tipo.value}
                    className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.tipo === tipo.value
                        ? 'border-[#D0323A] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={formData.tipo === tipo.value}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Report['tipo'] })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{tipo.label}</p>
                      <p className="text-xs text-gray-600">{tipo.description}</p>
                    </div>
                    {formData.tipo === tipo.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#D0323A] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Rango de fechas */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <label className="block text-sm text-gray-700">
                  Rango de fechas *
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Fecha inicio</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    max={filters.endDate || todayDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent ${
                      dateError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Fecha fin</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    max={todayDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent ${
                      dateError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              {dateError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{dateError}</p>
                </div>
              )}
            </div>

            {/* Filtros específicos */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <label className="block text-sm text-gray-700">
                  Filtros específicos (opcional)
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sucursal */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sucursal</label>
                  <select
                    value={filters.branch || ''}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="">Todas las sucursales</option>
                    <option value="Principal">Almacén Principal</option>
                    <option value="Secundario">Almacén Secundario</option>
                    <option value="Norte">Sucursal Norte</option>
                    <option value="Sur">Sucursal Sur</option>
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Categoría</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Mobiliario">Mobiliario</option>
                    <option value="Papelería">Papelería</option>
                    <option value="Consumibles">Consumibles</option>
                  </select>
                </div>

                {/* Usuario */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Usuario / Operador</label>
                  <select
                    value={filters.user || ''}
                    onChange={(e) => setFilters({ ...filters, user: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="">Todos los usuarios</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="María González">María González</option>
                    <option value="Carlos Ruiz">Carlos Ruiz</option>
                  </select>
                </div>

                {/* Cliente */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Cliente</label>
                  <select
                    value={filters.client || ''}
                    onChange={(e) => setFilters({ ...filters, client: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                  >
                    <option value="">Todos los clientes</option>
                    <option value="Acme Corporation">Acme Corporation</option>
                    <option value="TechSolutions">TechSolutions México</option>
                    <option value="Distribuidora">Distribuidora Nacional</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formato de salida */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-gray-400" />
                <label className="block text-sm text-gray-700">
                  Formato de salida *
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.format === 'pdf'
                      ? 'border-[#D0323A] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={formData.format === 'pdf'}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as Report['format'] })}
                    className="sr-only"
                  />
                  <FileText className={`w-8 h-8 mb-2 ${formData.format === 'pdf' ? 'text-[#D0323A]' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-900">PDF</span>
                </label>

                <label
                  className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.format === 'excel'
                      ? 'border-[#D0323A] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value="excel"
                    checked={formData.format === 'excel'}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as Report['format'] })}
                    className="sr-only"
                  />
                  <Download className={`w-8 h-8 mb-2 ${formData.format === 'excel' ? 'text-[#D0323A]' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-900">Excel</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm text-gray-900 mb-2">Vista previa de configuración</h4>
              <div className="space-y-1 text-xs text-gray-700">
                <p><strong>Tipo:</strong> {selectedType?.label}</p>
                <p><strong>Periodo:</strong> {formatDatePreview(filters.startDate || '')} - {formatDatePreview(filters.endDate || '')}</p>
                {filters.branch && <p><strong>Sucursal:</strong> {filters.branch}</p>}
                {filters.category && <p><strong>Categoría:</strong> {filters.category}</p>}
                <p><strong>Formato:</strong> {formData.format.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
            >
              Generar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
