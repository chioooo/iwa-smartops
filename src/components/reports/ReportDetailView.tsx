import {X, Download, FileText, Calendar, User, Filter, CheckCircle, Clock, AlertCircle} from 'lucide-react';
import type {Report} from './ReportsScreen';
import { reportGeneratorService } from '../../services/reports/reportGeneratorService';

type Props = {
    report: Report;
    onClose: () => void;
};

export function ReportDetailView({report, onClose}: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status: Report['status']) => {
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
        return configs[status];
    };

    const statusConfig = getStatusConfig(report.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 flex-shrink-0">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-white mb-1">Detalle del Reporte</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    {/* Status */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4"/>
                        <span className="text-sm">{statusConfig.label}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <h3 className="text-gray-900 mb-2">{report.name}</h3>
                            <p className="text-sm text-gray-600">{statusConfig.description}</p>
                        </div>

                        {/* Información básica */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-5 h-5 text-gray-400"/>
                                <h3 className="text-gray-900 text-sm">Información del Reporte</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Tipo de Reporte</p>
                                    <p className="text-sm text-gray-900 capitalize">{report.tipo}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Formato</p>
                                    <p className="text-sm text-gray-900 uppercase">{report.format}</p>
                                </div>
                            </div>
                        </div>

                        {/* Fecha y Usuario */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-gray-400"/>
                                <h3 className="text-gray-900 text-sm">Fecha y Usuario</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Fecha de Generación</p>
                                    <p className="text-sm text-gray-900">{formatDate(report.generationDate)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Generado Por</p>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-600"/>
                                        <p className="text-sm text-gray-900">{report.generatedBy}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parámetros/Filtros */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-5 h-5 text-gray-400"/>
                                <h3 className="text-gray-900 text-sm">Parámetros Aplicados</h3>
                            </div>
                            <div className="space-y-2">
                                {report.parameters.startDate && report.parameters.endDate && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-700 mb-1">Periodo</p>
                                        <p className="text-sm text-blue-900">
                                            {new Date(report.parameters.startDate).toLocaleDateString('es-MX')} - {new Date(report.parameters.endDate).toLocaleDateString('es-MX')}
                                        </p>
                                    </div>
                                )}
                                {report.parameters.branch && (
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-xs text-purple-700 mb-1">Sucursal</p>
                                        <p className="text-sm text-purple-900">{report.parameters.branch}</p>
                                    </div>
                                )}
                                {report.parameters.category && (
                                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-xs text-orange-700 mb-1">Categoría</p>
                                        <p className="text-sm text-orange-900">{report.parameters.category}</p>
                                    </div>
                                )}
                                {report.parameters.user && (
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-xs text-green-700 mb-1">Usuario</p>
                                        <p className="text-sm text-green-900">{report.parameters.user}</p>
                                    </div>
                                )}
                                {report.parameters.client && (
                                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                                        <p className="text-xs text-pink-700 mb-1">Cliente</p>
                                        <p className="text-sm text-pink-900">{report.parameters.client}</p>
                                    </div>
                                )}

                                {!report.parameters.branch && !report.parameters.category && !report.parameters.user && !report.parameters.client && (
                                    <p className="text-sm text-gray-500 italic">Sin filtros adicionales</p>
                                )}
                            </div>
                        </div>

                        {/* Estado Processing */}
                        {report.status === 'proceso' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin"/>
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
                        {report.status === 'error' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"/>
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
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
                    {report.status === 'disponible' && (
                        <button
                            onClick={() => {
                                if (report.blob) {
                                    // Descargar el blob real
                                    const url = URL.createObjectURL(report.blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                } else {
                                    // Regenerar el reporte si no hay blob
                                    const realReportTypes = ['inventario', 'usuarios', 'facturacion', 'finanzas'];
                                    if (realReportTypes.includes(report.tipo)) {
                                        reportGeneratorService.generateReport({
                                            tipo: report.tipo as 'inventario' | 'usuarios' | 'facturacion' | 'finanzas',
                                            startDate: report.parameters.startDate,
                                            endDate: report.parameters.endDate,
                                            format: report.format,
                                            generatedBy: report.generatedBy
                                        }).then(generated => {
                                            if (generated.blob) {
                                                reportGeneratorService.downloadReport(generated);
                                            }
                                        });
                                    } else {
                                        alert(`Descargando reporte: ${report.name} (${report.format.toUpperCase()})`);
                                    }
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
                        >
                            <Download className="w-4 h-4"/>
                            Descargar {report.format.toUpperCase()}
                        </button>
                    )}
                    {report.status === 'proceso' && (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                        >
                            <Clock className="w-4 h-4 animate-spin"/>
                            Procesando...
                        </button>
                    )}
                    {report.status === 'error' && (
                        <button
                            onClick={() => alert('Reintentando generación...')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <AlertCircle className="w-4 h-4"/>
                            Reintentar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
