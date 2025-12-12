import {useState} from 'react';
import {BarChart3, FileText, Plus, Filter} from 'lucide-react';
import {ReportsDashboard} from './ReportsDashboard';
import {ReportsList} from './ReportsList';
import {CreateReportModal} from './CreateReportModal';
import {ReportDetailView} from './ReportDetailView';
import {FiltersPanel} from './FiltersPanel';

export type Report = {
    id: string;
    nombre: string;
    tipo: 'ventas' | 'inventario' | 'facturacion' | 'servicios' | 'clientes' | 'utilidades';
    fechaGeneracion: string;
    generadoPor: string;
    estado: 'disponible' | 'proceso' | 'error';
    formato: 'pdf' | 'excel' | 'csv';
    parametros: ReportFilters;
};

export type ReportFilters = {
    fechaInicio?: string;
    fechaFin?: string;
    sucursal?: string;
    categoria?: string;
    usuario?: string;
    cliente?: string;
};

export type ChartDataPoint = {
    label: string;
    value: number;
};

export function ReportsScreen() {
    const [activeTab, setActiveTab] = useState<'list' | 'dashboard'>('list');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filters, setFilters] = useState<ReportFilters>({
        fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
    });

    // Mock data - reportes generados
    const [reports, setReports] = useState<Report[]>([
        {
            id: '1',
            nombre: 'Reporte de Ventas - Noviembre 2024',
            tipo: 'ventas',
            fechaGeneracion: '2024-11-26T10:30:00',
            generadoPor: 'Juan Pérez',
            estado: 'disponible',
            formato: 'pdf',
            parametros: {
                fechaInicio: '2024-11-01',
                fechaFin: '2024-11-30',
                sucursal: 'Principal'
            }
        },
        {
            id: '2',
            nombre: 'Inventario - Stock Crítico',
            tipo: 'inventario',
            fechaGeneracion: '2024-11-25T14:15:00',
            generadoPor: 'María González',
            estado: 'disponible',
            formato: 'excel',
            parametros: {
                fechaInicio: '2024-11-25',
                fechaFin: '2024-11-25'
            }
        },
        {
            id: '3',
            nombre: 'Facturación Electrónica - Noviembre',
            tipo: 'facturacion',
            fechaGeneracion: '2024-11-26T09:00:00',
            generadoPor: 'Carlos Ruiz',
            estado: 'proceso',
            formato: 'pdf',
            parametros: {
                fechaInicio: '2024-11-01',
                fechaFin: '2024-11-30'
            }
        },
    ]);

    // Mock data - métricas del dashboard
    const metrics = {
        ventasHoy: 45680.50,
        ventasMes: 892450.00,
        facturasEmitidas: 127,
        ordenesCompletadas: 89,
        serviciosMasSolicitados: [
            {nombre: 'Consultoría Tecnológica', cantidad: 45},
            {nombre: 'Mantenimiento Preventivo', cantidad: 32},
            {nombre: 'Soporte Técnico', cantidad: 28}
        ],
        productosRotacion: [
            {nombre: 'Laptop Dell XPS', ventas: 15},
            {nombre: 'Impresora HP', ventas: 12},
            {nombre: 'Monitor LG 27"', ventas: 8}
        ]
    };

    const handleCreateReport = (reportData: Omit<Report, 'id' | 'fechaGeneracion' | 'estado'>) => {
        const newReport: Report = {
            ...reportData,
            id: String(reports.length + 1),
            fechaGeneracion: new Date().toISOString(),
            estado: 'proceso'
        };

        setReports([newReport, ...reports]);
        setShowCreateModal(false);

        // Simular proceso de generación
        setTimeout(() => {
            setReports(prev => prev.map(r =>
                r.id === newReport.id ? {...r, estado: 'disponible'} : r
            ));
        }, 2000);
    };

    const handleApplyFilters = (newFilters: ReportFilters) => {
        setFilters(newFilters);
        setShowFiltersPanel(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-gray-900 text-2xl font-semibold mb-2">Reportes y Analíticas</h1>
                            <p className="text-gray-600">Genera y consulta reportes detallados de tu operación</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFiltersPanel(true)}
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-5 h-5"/>
                                Filtros
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
                            >
                                <Plus className="w-5 h-5"/>
                                Nuevo Reporte
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                                activeTab === 'list'
                                    ? 'border-[#D0323A] text-[#D0323A]'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <FileText className="w-5 h-5"/>
                            Reportes Generados
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {reports.length}
              </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                                activeTab === 'dashboard'
                                    ? 'border-[#D0323A] text-[#D0323A]'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <BarChart3 className="w-5 h-5"/>
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {activeTab === 'dashboard' ? (
                    <ReportsDashboard
                        metrics={metrics}
                        filters={filters}
                        onCreateReport={() => setShowCreateModal(true)}
                    />
                ) : (
                    <ReportsList
                        reports={reports}
                        onSelectReport={setSelectedReport}
                        selectedReportId={selectedReport?.id}
                    />
                )}
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <ReportDetailView
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}

            {/* Create Report Modal */}
            {showCreateModal && (
                <CreateReportModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateReport}
                />
            )}

            {/* Filters Panel */}
            {showFiltersPanel && (
                <FiltersPanel
                    filters={filters}
                    onClose={() => setShowFiltersPanel(false)}
                    onApply={handleApplyFilters}
                />
            )}
        </div>
    );
}
