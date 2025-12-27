import { useState } from 'react';
import { 
  FileText, 
  Download,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Receipt,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from './BillingScreen';

interface BillingReportsProps {
  invoices: Invoice[];
}

type ReportType = 'invoices-list' | 'billing-summary' | 'cancelled-invoices' | 'complete';

export function BillingReports({ invoices }: BillingReportsProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('complete');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatInvoiceDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calcular estadísticas
  const totalInvoices = invoices.length;
  const vigentes = invoices.filter(i => i.estado === 'vigente');
  const pagadas = invoices.filter(i => i.estado === 'pagada');
  const canceladas = invoices.filter(i => i.estado === 'cancelada');
  const pendientes = invoices.filter(i => i.estado === 'pendiente_timbrado');
  
  const totalFacturado = invoices
    .filter(i => i.estado !== 'cancelada')
    .reduce((sum, i) => sum + i.total, 0);
  
  const totalIVA = invoices
    .filter(i => i.estado !== 'cancelada')
    .reduce((sum, i) => sum + i.iva, 0);

  const getEstadoLabel = (estado: Invoice['estado']) => {
    const labels = {
      'vigente': 'Vigente',
      'pagada': 'Pagada',
      'cancelada': 'Cancelada',
      'pendiente_timbrado': 'Pendiente'
    };
    return labels[estado];
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const now = new Date();
      const dateStr = formatDate(now);
      
      // Colores
      const primaryColor: [number, number, number] = [208, 50, 58]; // #D0323A
      const grayColor: [number, number, number] = [100, 100, 100];
      const redColor: [number, number, number] = [239, 68, 68];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Facturación', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado el ${dateStr}`, pageWidth / 2, 23, { align: 'center' });
      doc.text('iWA SmartOps - Sistema de Gestión Empresarial', pageWidth / 2, 30, { align: 'center' });
      
      // Resumen Ejecutivo
      let yPos = 45;
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen Ejecutivo', 14, yPos);
      
      yPos += 10;
      doc.setFillColor(249, 250, 251);
      doc.rect(14, yPos - 5, pageWidth - 28, 30, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Total Facturas:', totalInvoices.toString()],
        ['Total Facturado:', formatCurrency(totalFacturado)],
        ['IVA Total:', formatCurrency(totalIVA)],
        ['Canceladas:', canceladas.length.toString()]
      ];
      
      const colWidth = (pageWidth - 28) / 2;
      summaryData.forEach((item, index) => {
        const xOffset = index < 2 ? 18 : 18 + colWidth;
        const yOffset = yPos + (index % 2) * 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayColor);
        doc.text(item[0], xOffset, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item[1], xOffset + 40, yOffset);
      });
      
      yPos += 35;

      // Tabla de Facturas
      if (selectedReport === 'complete' || selectedReport === 'invoices-list') {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Listado de Facturas', 14, yPos);
        yPos += 5;

        const invoicesTableData = invoices.map(inv => [
          inv.folio,
          inv.cliente.length > 25 ? inv.cliente.substring(0, 25) + '...' : inv.cliente,
          inv.rfc,
          formatInvoiceDate(inv.fechaEmision),
          formatCurrency(inv.total),
          getEstadoLabel(inv.estado)
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Folio', 'Cliente', 'RFC', 'Fecha', 'Total', 'Estado']],
          body: invoicesTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 50 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 28, halign: 'right' },
            5: { cellWidth: 22, halign: 'center' }
          },
          foot: [[
            'TOTAL', '', '', '', formatCurrency(totalFacturado), `${totalInvoices} facturas`
          ]],
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Resumen por Estado
      if (selectedReport === 'complete' || selectedReport === 'billing-summary') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen por Estado', 14, yPos);
        yPos += 5;

        const statusData = [
          ['Vigentes', vigentes.length.toString(), formatCurrency(vigentes.reduce((s, i) => s + i.total, 0))],
          ['Pagadas', pagadas.length.toString(), formatCurrency(pagadas.reduce((s, i) => s + i.total, 0))],
          ['Pendientes de Timbrado', pendientes.length.toString(), formatCurrency(pendientes.reduce((s, i) => s + i.total, 0))],
          ['Canceladas', canceladas.length.toString(), formatCurrency(canceladas.reduce((s, i) => s + i.total, 0))]
        ];

        autoTable(doc, {
          startY: yPos,
          head: [['Estado', 'Cantidad', 'Monto Total']],
          body: statusData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40, halign: 'center' },
            2: { cellWidth: 50, halign: 'right' }
          }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Facturas Canceladas
      if (selectedReport === 'complete' || selectedReport === 'cancelled-invoices') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Facturas Canceladas', 14, yPos);
        yPos += 5;

        if (canceladas.length > 0) {
          const cancelledData = canceladas.map(inv => [
            inv.folio,
            inv.cliente.length > 30 ? inv.cliente.substring(0, 30) + '...' : inv.cliente,
            inv.rfc,
            formatInvoiceDate(inv.fechaEmision),
            formatCurrency(inv.total)
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [['Folio', 'Cliente', 'RFC', 'Fecha Emisión', 'Total']],
            body: cancelledData,
            theme: 'striped',
            headStyles: { fillColor: redColor, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
              0: { cellWidth: 25 },
              1: { cellWidth: 55 },
              2: { cellWidth: 35 },
              3: { cellWidth: 30 },
              4: { cellWidth: 30, halign: 'right' }
            }
          });
        } else {
          doc.setFontSize(10);
          doc.setTextColor(...grayColor);
          doc.text('No hay facturas canceladas en el periodo.', 14, yPos + 10);
        }
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...grayColor);
        doc.text(
          `Página ${i} de ${pageCount} | iWA SmartOps - Reporte generado automáticamente`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Descargar PDF
      const fileName = `reporte-facturacion-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      id: 'complete' as ReportType,
      title: 'Reporte Completo',
      description: 'Incluye facturas, resumen y cancelaciones',
      icon: FileText
    },
    {
      id: 'invoices-list' as ReportType,
      title: 'Listado de Facturas',
      description: 'Detalle de todas las facturas emitidas',
      icon: Receipt
    },
    {
      id: 'billing-summary' as ReportType,
      title: 'Resumen de Facturación',
      description: 'Totales por estado y montos',
      icon: DollarSign
    },
    {
      id: 'cancelled-invoices' as ReportType,
      title: 'Facturas Canceladas',
      description: 'Listado de facturas canceladas',
      icon: AlertCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span>Reporte generado exitosamente</span>
        </div>
      )}

      {/* Header de reportes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generador de Reportes</h2>
            <p className="text-gray-500 mt-1">Selecciona el tipo de reporte y descárgalo en PDF</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isGenerating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#D0323A] text-white hover:bg-[#9F2743] shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descargar PDF
              </>
            )}
          </button>
        </div>

        {/* Tipos de reporte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedReport === report.id
                  ? 'border-[#D0323A] bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                selectedReport === report.id ? 'bg-[#D0323A] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <report.icon className="w-5 h-5" />
              </div>
              <h3 className={`font-medium mb-1 ${
                selectedReport === report.id ? 'text-[#D0323A]' : 'text-gray-900'
              }`}>
                {report.title}
              </h3>
              <p className="text-sm text-gray-500">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Vista previa del reporte */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Reporte</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-4 h-4" />
              Enviar por Email
            </button>
          </div>
        </div>

        {/* Contenido de vista previa */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="text-center mb-6 pb-4 border-b-2 border-[#D0323A]">
            <h2 className="text-2xl font-bold text-[#D0323A]">🧾 Reporte de Facturación</h2>
            <p className="text-gray-500 mt-2">Generado el {formatDate(new Date())}</p>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Total Facturas</p>
                <p className="text-xl font-bold">{totalInvoices}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Total Facturado</p>
                <p className="text-xl font-bold">{formatCurrency(totalFacturado)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">IVA Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalIVA)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Canceladas</p>
                <p className="text-xl font-bold">{canceladas.length}</p>
              </div>
            </div>
          </div>

          {/* Tabla de facturas (preview) */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Folio</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">RFC</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 3).map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{inv.folio}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{inv.cliente}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{inv.rfc}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(inv.total)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.estado === 'vigente' ? 'bg-blue-100 text-blue-700' :
                        inv.estado === 'pagada' ? 'bg-green-100 text-green-700' :
                        inv.estado === 'cancelada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getEstadoLabel(inv.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length > 3 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                ... y {invoices.length - 3} facturas más en el reporte completo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historial de reportes (simulado) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h3>
        <div className="space-y-3">
          {[
            { date: '2024-12-20', type: 'Reporte Completo', size: '198 KB' },
            { date: '2024-12-15', type: 'Listado de Facturas', size: '145 KB' },
            { date: '2024-12-10', type: 'Resumen de Facturación', size: '67 KB' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D0323A]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#D0323A]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.type}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#D0323A] transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
