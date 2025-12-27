import {useState} from 'react';
import {BarChart3, FileText, Plus} from 'lucide-react';
import {ReportsDashboard} from './ReportsDashboard';
import {ReportsList} from './ReportsList';
import {CreateReportModal} from './CreateReportModal';
import {ReportDetailView} from './ReportDetailView';
import {FiltersPanel} from './FiltersPanel';
import { reportGeneratorService } from '../../services/reports/reportGeneratorService';

export type Report = {
    id: string;
    name: string;
    tipo: 'inventario' | 'usuarios' | 'facturacion' | 'finanzas';
    generationDate: string;
    generatedBy: string;
    status: 'disponible' | 'proceso' | 'error';
    format: 'pdf' | 'excel';
    parameters: ReportFilters;
    blob?: Blob;
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
    const [filters, setFilters] = useState<ReportFilters>({});

    // Mock data - reportes generados
    const [reports, setReports] = useState<Report[]>([
        {
            id: '1',
            name: 'Reporte de Inventario - nov 2024 a dic 2024',
            tipo: 'inventario',
            generationDate: '2024-12-10T15:22:00',
            generatedBy: 'Juan Pérez',
            status: 'disponible',
            format: 'pdf',
            parameters: {
                startDate: '2024-11-10',
                endDate: '2024-12-10'
            }
        },
        {
            id: '2',
            name: 'Reporte de Usuarios - sep 2024 a oct 2024',
            tipo: 'usuarios',
            generationDate: '2024-10-25T14:15:00',
            generatedBy: 'María González',
            status: 'disponible',
            format: 'pdf',
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
            status: 'disponible',
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

    const handleCreateReport = async (reportData: Omit<Report, 'id' | 'generationDate' | 'status'>) => {
        // Crear reporte temporal en estado "proceso"
        const tempId = crypto.randomUUID();
        const tempReport: Report = {
            ...reportData,
            id: tempId,
            generationDate: new Date().toISOString(),
            status: 'proceso'
        };

        setReports([tempReport, ...reports]);
        setShowCreateModal(false);

        // Verificar si es un tipo de reporte que podemos generar realmente
        const realReportTypes = ['inventario', 'usuarios', 'facturacion', 'finanzas'];
        
        if (realReportTypes.includes(reportData.tipo)) {
            try {
                const generatedReport = await reportGeneratorService.generateReport({
                    tipo: reportData.tipo as 'inventario' | 'usuarios' | 'facturacion' | 'finanzas',
                    startDate: reportData.parameters.startDate,
                    endDate: reportData.parameters.endDate,
                    format: reportData.format,
                    generatedBy: reportData.generatedBy
                });

                setReports(prev => prev.map(r =>
                    r.id === tempId ? {
                        ...r,
                        id: generatedReport.id,
                        name: generatedReport.name,
                        status: generatedReport.status,
                        blob: generatedReport.blob
                    } : r
                ));
            } catch (error) {
                console.error('Error generating report:', error);
                setReports(prev => prev.map(r =>
                    r.id === tempId ? {...r, status: 'error'} : r
                ));
            }
        } else {
            // Para tipos de reporte no implementados, simular generación
            setTimeout(() => {
                setReports(prev => prev.map(r =>
                    r.id === tempId ? {...r, status: 'disponible'} : r
                ));
            }, 2000);
        }
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
                        advancedFilters={filters}
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
