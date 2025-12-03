import { useState } from 'react';
import { 
  FileText, 
  Download,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product, FinancialSummary } from './FinancesScreen';

interface FinancialReportsProps {
  products: Product[];
  summary: FinancialSummary;
}

type ReportType = 'inventory-valuation' | 'profit-analysis' | 'category-breakdown' | 'complete';

export function FinancialReports({ products, summary }: FinancialReportsProps) {
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

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Crear documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const now = new Date();
      const dateStr = formatDate(now);
      
      // Colores
      const primaryColor: [number, number, number] = [208, 50, 58]; // #D0323A
      const grayColor: [number, number, number] = [100, 100, 100];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte Financiero de Inventario', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado el ${dateStr}`, pageWidth / 2, 23, { align: 'center' });
      doc.text('iWA SmartOps - Sistema de Gestion Empresarial', pageWidth / 2, 30, { align: 'center' });
      
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
        ['Valor Total Inventario:', formatCurrency(summary.totalInventoryValue)],
        ['Costo Total Inventario:', formatCurrency(summary.totalInventoryCost)],
        ['Ganancia Potencial:', formatCurrency(summary.potentialProfit)],
        ['Margen Promedio:', `${summary.profitMargin.toFixed(1)}%`]
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
        doc.text(item[1], xOffset + 45, yOffset);
      });
      
      yPos += 35;

      // Tabla de Valoración de Inventario
      if (selectedReport === 'complete' || selectedReport === 'inventory-valuation') {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Valoracion de Inventario por Producto', 14, yPos);
        yPos += 5;

        const inventoryTableData = products.map(p => {
          const totalCost = p.purchasePrice * p.stock;
          const totalValue = p.price * p.stock;
          const margin = ((p.price - p.purchasePrice) / p.purchasePrice) * 100;
          return [
            p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
            p.sku,
            p.stock.toString(),
            formatCurrency(p.purchasePrice),
            formatCurrency(p.price),
            formatCurrency(totalCost),
            formatCurrency(totalValue),
            `${margin.toFixed(1)}%`
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'SKU', 'Stock', 'P. Compra', 'P. Venta', 'Costo Total', 'Valor Total', 'Margen']],
          body: inventoryTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 20 },
            2: { cellWidth: 15, halign: 'right' },
            3: { cellWidth: 22, halign: 'right' },
            4: { cellWidth: 22, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
            6: { cellWidth: 25, halign: 'right' },
            7: { cellWidth: 18, halign: 'right' }
          },
          foot: [[
            'TOTAL', '', products.reduce((sum, p) => sum + p.stock, 0).toString(), '', '',
            formatCurrency(summary.totalInventoryCost),
            formatCurrency(summary.totalInventoryValue),
            `${summary.profitMargin.toFixed(1)}%`
          ]],
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Análisis por Categoría
      if (selectedReport === 'complete' || selectedReport === 'category-breakdown') {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Analisis por Categoria', 14, yPos);
        yPos += 5;

        const categoryTableData = summary.categoryBreakdown.map(cat => [
          cat.category,
          cat.itemCount.toString(),
          formatCurrency(cat.totalCost),
          formatCurrency(cat.totalValue),
          formatCurrency(cat.profit),
          `${cat.margin.toFixed(1)}%`
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Categoria', 'Productos', 'Costo Total', 'Valor Total', 'Ganancia', 'Margen']],
          body: categoryTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' }
          }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Análisis de Rentabilidad
      if (selectedReport === 'complete' || selectedReport === 'profit-analysis') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Ranking de Rentabilidad', 14, yPos);
        yPos += 5;

        const sortedByMargin = [...products].sort((a, b) => {
          const marginA = ((a.price - a.purchasePrice) / a.purchasePrice) * 100;
          const marginB = ((b.price - b.purchasePrice) / b.purchasePrice) * 100;
          return marginB - marginA;
        });

        const profitTableData = sortedByMargin.map((p, i) => {
          const profitPerUnit = p.price - p.purchasePrice;
          const totalProfit = profitPerUnit * p.stock;
          const margin = (profitPerUnit / p.purchasePrice) * 100;
          return [
            (i + 1).toString(),
            p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name,
            formatCurrency(profitPerUnit),
            formatCurrency(totalProfit),
            `${margin.toFixed(1)}%`
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Producto', 'Ganancia/Unidad', 'Ganancia Total', 'Margen']],
          body: profitTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 60 },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...grayColor);
        doc.text(
          `Pagina ${i} de ${pageCount} | iWA SmartOps - Reporte generado automaticamente`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Descargar PDF
      const fileName = `reporte-financiero-${new Date().toISOString().split('T')[0]}.pdf`;
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
      description: 'Incluye valoración, análisis por categoría y rentabilidad',
      icon: FileText
    },
    {
      id: 'inventory-valuation' as ReportType,
      title: 'Valoración de Inventario',
      description: 'Detalle de costos y valores por producto',
      icon: BarChart3
    },
    {
      id: 'category-breakdown' as ReportType,
      title: 'Análisis por Categoría',
      description: 'Resumen financiero agrupado por categorías',
      icon: PieChart
    },
    {
      id: 'profit-analysis' as ReportType,
      title: 'Análisis de Rentabilidad',
      description: 'Márgenes y ranking de productos rentables',
      icon: TrendingUp
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
            <h2 className="text-2xl font-bold text-[#D0323A]">📊 Reporte Financiero de Inventario</h2>
            <p className="text-gray-500 mt-2">Generado el {formatDate(new Date())}</p>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Valor Total</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInventoryValue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Costo Total</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInventoryCost)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Ganancia Potencial</p>
                <p className="text-xl font-bold">{formatCurrency(summary.potentialProfit)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Margen Promedio</p>
                <p className="text-xl font-bold">{summary.profitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Tabla de productos (preview) */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Producto</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Costo</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Margen</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 3).map((p) => {
                  const margin = ((p.price - p.purchasePrice) / p.purchasePrice) * 100;
                  return (
                    <tr key={p.id} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{p.stock}</td>
                      <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(p.purchasePrice * p.stock)}</td>
                      <td className="py-3 px-4 text-right text-green-600">{formatCurrency(p.price * p.stock)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          margin >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length > 3 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                ... y {products.length - 3} productos más en el reporte completo
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
            { date: '2024-11-25', type: 'Reporte Completo', size: '245 KB' },
            { date: '2024-11-20', type: 'Valoración de Inventario', size: '128 KB' },
            { date: '2024-11-15', type: 'Análisis de Rentabilidad', size: '156 KB' },
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
