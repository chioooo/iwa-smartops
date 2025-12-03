import React, { useState } from 'react';
import { Search, Download, Eye, FileText, FileSpreadsheet, File, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type {Report} from './ReportsScreen';

type Props = {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  selectedReportId?: string;
};

export function ReportsList({ reports, onSelectReport, selectedReportId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrado
  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.generadoPor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTipo = filterTipo === 'all' || report.tipo === filterTipo;
    const matchesEstado = filterEstado === 'all' || report.estado === filterEstado;

    return matchesSearch && matchesTipo && matchesEstado;
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

  const getTipoLabel = (tipo: Report['tipo']) => {
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

  const getTipoBadge = (tipo: Report['tipo']) => {
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

  const getEstadoBadge = (estado: Report['estado']) => {
    const badges = {
      disponible: { icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200', label: 'Disponible' },
      proceso: { icon: Clock, color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Procesando' },
      error: { icon: AlertCircle, color: 'bg-red-50 text-red-700 border-red-200', label: 'Error' }
    };
    return badges[estado];
  };

  const getFormatoIcon = (formato: Report['formato']) => {
    const icons = {
      pdf: FileText,
      excel: FileSpreadsheet,
      csv: File
    };
    return icons[formato];
  };

  const handleDownload = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Descargando reporte: ${report.nombre}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
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
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="proceso">En proceso</option>
            <option value="error">Error</option>
          </select>
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
                const estadoBadge = getEstadoBadge(report.estado);
                const EstadoIcon = estadoBadge.icon;
                const FormatoIcon = getFormatoIcon(report.formato);

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
                          <p className="text-gray-900">{report.nombre}</p>
                          <p className="text-xs text-gray-500">ID: {report.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getTipoBadge(report.tipo)}`}>
                        {getTipoLabel(report.tipo)}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{formatDate(report.fechaGeneracion)}</span>
                    </td>

                    {/* Generado por */}
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{report.generadoPor}</span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${estadoBadge.color}`}>
                        <EstadoIcon className="w-3.5 h-3.5" />
                        {estadoBadge.label}
                      </div>
                    </td>

                    {/* Formato */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FormatoIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600 text-sm uppercase">{report.formato}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
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
                        {report.estado === 'disponible' && (
                          <>
                            <button
                              onClick={(e) => handleDownload(report, e)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title={`Descargar ${report.formato.toUpperCase()}`}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {report.formato === 'pdf' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Abriendo vista previa...');
                                }}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Vista previa"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </>
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
