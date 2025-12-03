//import React from 'react';
import { X, Download, Eye, FileText, Calendar, User, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type {Report} from './ReportsScreen';

type Props = {
  report: Report;
  onClose: () => void;
};

export function ReportDetailView({ report, onClose }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoConfig = (estado: Report['estado']) => {
    const configs = {
      disponible: {
        icon: CheckCircle,
        color: 'bg-green-50 text-green-700 border-green-200',
        label: 'Disponible',
        description: 'El reporte está listo para descargar'
      },
      proceso: {
        icon: Clock,
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        label: 'Procesando',
        description: 'El reporte se está generando'
      },
      error: {
        icon: AlertCircle,
        color: 'bg-red-50 text-red-700 border-red-200',
        label: 'Error',
        description: 'Hubo un error al generar el reporte'
      }
    };
    return configs[estado];
  };

  const estadoConfig = getEstadoConfig(report.estado);
  const EstadoIcon = estadoConfig.icon;

  return (
    <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white mb-1">Detalle del Reporte</h2>
            <p className="text-white/90 text-sm">ID: {report.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${estadoConfig.color}`}>
          <EstadoIcon className="w-4 h-4" />
          <span className="text-sm">{estadoConfig.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <h3 className="text-gray-900 mb-2">{report.nombre}</h3>
            <p className="text-sm text-gray-600">{estadoConfig.description}</p>
          </div>

          {/* Información básica */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900 text-sm">Información del Reporte</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tipo de Reporte</p>
                <p className="text-sm text-gray-900 capitalize">{report.tipo}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Formato</p>
                <p className="text-sm text-gray-900 uppercase">{report.formato}</p>
              </div>
            </div>
          </div>

          {/* Fecha y Usuario */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900 text-sm">Fecha y Usuario</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fecha de Generación</p>
                <p className="text-sm text-gray-900">{formatDate(report.fechaGeneracion)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Generado Por</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-900">{report.generadoPor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parámetros/Filtros */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900 text-sm">Parámetros Aplicados</h3>
            </div>
            <div className="space-y-2">
              {report.parametros.fechaInicio && report.parametros.fechaFin && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Periodo</p>
                  <p className="text-sm text-blue-900">
                    {new Date(report.parametros.fechaInicio).toLocaleDateString('es-MX')} - {new Date(report.parametros.fechaFin).toLocaleDateString('es-MX')}
                  </p>
                </div>
              )}
              {report.parametros.sucursal && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1">Sucursal</p>
                  <p className="text-sm text-purple-900">{report.parametros.sucursal}</p>
                </div>
              )}
              {report.parametros.categoria && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-700 mb-1">Categoría</p>
                  <p className="text-sm text-orange-900">{report.parametros.categoria}</p>
                </div>
              )}
              {report.parametros.usuario && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Usuario</p>
                  <p className="text-sm text-green-900">{report.parametros.usuario}</p>
                </div>
              )}
              {report.parametros.cliente && (
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs text-pink-700 mb-1">Cliente</p>
                  <p className="text-sm text-pink-900">{report.parametros.cliente}</p>
                </div>
              )}

              {!report.parametros.sucursal && !report.parametros.categoria && !report.parametros.usuario && !report.parametros.cliente && (
                <p className="text-sm text-gray-500 italic">Sin filtros adicionales</p>
              )}
            </div>
          </div>

          {/* Estado Processing */}
          {report.estado === 'proceso' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">Generando reporte...</p>
                  <p className="text-xs text-blue-700">
                    El reporte se está procesando. Esto puede tomar algunos momentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Estado Error */}
          {report.estado === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-900 mb-1">Error al generar reporte</p>
                  <p className="text-xs text-red-700">
                    Hubo un problema al procesar el reporte. Por favor intenta nuevamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
        {report.estado === 'disponible' && (
          <div className="space-y-2">
            <button
              onClick={() => alert('Descargando reporte...')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar {report.formato.toUpperCase()}
            </button>
            {report.formato === 'pdf' && (
              <button
                onClick={() => alert('Abriendo vista previa...')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Vista Previa
              </button>
            )}
          </div>
        )}
        {report.estado === 'proceso' && (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            <Clock className="w-4 h-4 animate-spin" />
            Procesando...
          </button>
        )}
        {report.estado === 'error' && (
          <button
            onClick={() => alert('Reintentando generación...')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
