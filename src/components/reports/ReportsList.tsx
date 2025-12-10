import React, { useState } from 'react';
import { Search, Download, Eye, FileText, FileSpreadsheet, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import type {Report, ReportFilters} from './ReportsScreen';

type Props = {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  selectedReportId?: string;
  onOpenFilters: () => void;
  advancedFilters: ReportFilters;
};

export function ReportsList({ reports, onSelectReport, selectedReportId, onOpenFilters, advancedFilters }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isDateInRange = (dateString: string, startDate?: string, endDate?: string): boolean => {
    if (!startDate || !endDate) return true;
    
    const reportDateOnly = new Date(dateString).toISOString().split('T')[0];
    
    return reportDateOnly >= startDate && reportDateOnly <= endDate;
  };

  // Filtrado
  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTipo = filterType === 'all' || report.tipo === filterType;
    const matchesEstado = filterStatus === 'all' || report.status === filterStatus;

    const matchesDates = isDateInRange(
      report.generationDate, 
      advancedFilters.startDate, 
      advancedFilters.endDate
    );

    const matchesBranch = !advancedFilters.branch || report.parameters.branch === advancedFilters.branch;

    const matchesCategory = !advancedFilters.category || report.parameters.category === advancedFilters.category;

    const matchesUser = !advancedFilters.user || report.generatedBy === advancedFilters.user;

    const matchesClient = !advancedFilters.client || report.parameters.client === advancedFilters.client;

    return matchesSearch && matchesTipo && matchesEstado && matchesDates && matchesBranch && matchesCategory && matchesUser && matchesClient;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (tipo: Report['tipo']) => {
    const labels = {
      ventas: 'Ventas',
      inventario: 'Inventario',
      facturacion: 'Facturación',
      servicios: 'Servicios',
      clientes: 'Clientes',
      utilidades: 'Utilidades'
    };
    return labels[tipo];
  };

  const getTypeBadge = (tipo: Report['tipo']) => {
    const badges = {
      ventas: 'bg-green-50 text-green-700 border-green-200',
      inventario: 'bg-blue-50 text-blue-700 border-blue-200',
      facturacion: 'bg-purple-50 text-purple-700 border-purple-200',
      servicios: 'bg-orange-50 text-orange-700 border-orange-200',
      clientes: 'bg-pink-50 text-pink-700 border-pink-200',
      utilidades: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return badges[tipo];
  };

  const getStatusBadge = (status: Report['status']) => {
    const badges = {
      disponible: { icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200', label: 'Disponible' },
      proceso: { icon: Clock, color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Procesando' },
      error: { icon: AlertCircle, color: 'bg-red-50 text-red-700 border-red-200', label: 'Error' }
    };
    return badges[status];
  };

  const getFormatIcon = (format: Report['format']) => {
    const icons = {
      pdf: FileText,
      excel: FileSpreadsheet
    };
    return icons[format];
  };

  const handleDownload = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Descargando reporte: ${report.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
            />
          </div>

          {/* Tipo Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los tipos</option>
            <option value="ventas">Ventas</option>
            <option value="inventario">Inventario</option>
            <option value="facturacion">Facturación</option>
            <option value="servicios">Servicios</option>
            <option value="clientes">Clientes</option>
            <option value="utilidades">Utilidades</option>
          </select>

          {/* Estado Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="proceso">En proceso</option>
            <option value="error">Error</option>
          </select>

          {/* Botón Filtros Avanzados */}
          <button
            onClick={onOpenFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5"/>
            Filtros Avanzados
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Nombre del Reporte</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Tipo</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Fecha</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Generado Por</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Estado</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Formato</th>
                <th className="text-right px-6 py-4 text-gray-700 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => {
                const statusBadge = getStatusBadge(report.status);
                const StatusIcon = statusBadge.icon;
                const FormatIcon = getFormatIcon(report.format);

                return (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report)}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedReportId === report.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900">{report.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getTypeBadge(report.tipo)}`}>
                        {getTypeLabel(report.tipo)}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{formatDate(report.generationDate)}</span>
                    </td>

                    {/* Generado por */}
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{report.generatedBy}</span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${statusBadge.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusBadge.label}
                      </div>
                    </td>

                    {/* Formato */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FormatIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600 text-sm uppercase">{report.format}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {report.status === 'disponible' && (
                          <>
                            {/* Botón de vista de detalles - para PDF y Excel */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectReport(report);
                              }}
                              className="p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* Botón de descarga */}
                            <button
                              onClick={(e) => handleDownload(report, e)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title={`Descargar ${report.format.toUpperCase()}`}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {report.status === 'proceso' && (
                          <div className="p-2 text-gray-400">
                            <Clock className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                        {report.status === 'error' && (
                          <div className="p-2 text-red-500" title="Error al generar el reporte">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredReports.length)} de {filteredReports.length} reportes
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
        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No se encontraron reportes</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
