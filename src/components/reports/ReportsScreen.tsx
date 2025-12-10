import {useState} from 'react';
import {BarChart3, FileText, Plus} from 'lucide-react';
import {ReportsDashboard} from './ReportsDashboard';
import {ReportsList} from './ReportsList';
import {CreateReportModal} from './CreateReportModal';
import {ReportDetailView} from './ReportDetailView';
import {FiltersPanel} from './FiltersPanel';

export type Report = {
    id: string;
    name: string;
    tipo: 'ventas' | 'inventario' | 'facturacion' | 'servicios' | 'clientes' | 'utilidades';
    generationDate: string;
    generatedBy: string;
    status: 'disponible' | 'proceso' | 'error';
    format: 'pdf' | 'excel';
    parameters: ReportFilters;
};

export type ReportFilters = {
    startDate?: string;
    endDate?: string;
    branch?: string;
    category?: string;
    user?: string;
    client?: string;
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
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    // Mock data - reportes generados
    const [reports, setReports] = useState<Report[]>([
        {
            id: '1',
            name: 'Reporte de Ventas - nov 2024 a dic 2024',
            tipo: 'ventas',
            generationDate: '2024-12-10T15:22:00',
            generatedBy: 'Juan Pérez',
            status: 'disponible',
            format: 'pdf',
            parameters: {
                startDate: '2024-11-10',
                endDate: '2024-12-10',
                branch: 'Principal'
            }
        },
        {
            id: '2',
            name: 'Reporte de Inventario - sep 2024 a oct 2024',
            tipo: 'inventario',
            generationDate: '2024-10-25T14:15:00',
            generatedBy: 'María González',
            status: 'disponible',
            format: 'excel',
            parameters: {
                startDate: '2024-09-25',
                endDate: '2024-10-25'
            }
        },
        {
            id: '3',
            name: 'Reporte de Facturación - oct 2024 a nov 2024',
            tipo: 'facturacion',
            generationDate: '2024-11-30T09:00:00',
            generatedBy: 'Carlos Ruiz',
            status: 'proceso',
            format: 'pdf',
            parameters: {
                startDate: '2024-10-30',
                endDate: '2024-11-30'
            }
        },
    ]);

    // Mock data - métricas del dashboard
    const metrics = {
        salesToday: 45680.50,
        monthlySales: 892450.00,
        invoicesIssued: 127,
        completedOrders: 89,
        mostRequestedServices: [
            {name: 'Consultoría Tecnológica', quantity: 45},
            {name: 'Mantenimiento Preventivo', quantity: 32},
            {name: 'Soporte Técnico', quantity: 28}
        ],
        productRotation: [
            {name: 'Laptop Dell XPS', sales: 15},
            {name: 'Impresora HP', sales: 12},
            {name: 'Monitor LG 27"', sales: 8}
        ]
    };

    const handleCreateReport = (reportData: Omit<Report, 'id' | 'generationDate' | 'status'>) => {
        const newReport: Report = {
            ...reportData,
            id: String(reports.length + 1),
            generationDate: new Date().toISOString(),
            status: 'proceso'
        };

        setReports([newReport, ...reports]);
        setShowCreateModal(false);

        // Simular proceso de generación
        setTimeout(() => {
            setReports(prev => prev.map(r =>
                r.id === newReport.id ? {...r, status: 'disponible'} : r
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
                            <h1 className="text-gray-900 mb-2">Reportes y Analíticas</h1>
                            <p className="text-gray-600">Genera y consulta reportes detallados de tu operación</p>
                        </div>
                        <div className="flex items-center gap-3">
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
                        onCreateReport={() => setShowCreateModal(true)}
                    />
                ) : (
                    <ReportsList
                        reports={reports}
                        onSelectReport={setSelectedReport}
                        selectedReportId={selectedReport?.id}
                        onOpenFilters={() => setShowFiltersPanel(true)}
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
