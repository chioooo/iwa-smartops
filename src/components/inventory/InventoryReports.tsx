import { useState } from 'react';
import { 
  FileText, 
  Download,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Package,
  Layers,
  AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product, Supply, Category } from '../../services/inventory/inventory.types';

interface InventoryReportsProps {
  products: Product[];
  supplies: Supply[];
  categories?: Category[];
}

type ReportType = 'products-list' | 'supplies-list' | 'low-stock' | 'complete';

export function InventoryReports({ products, supplies }: InventoryReportsProps) {
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

  // Calcular estadísticas
  const totalProducts = products.length;
  const totalSupplies = supplies.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

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
      const warningColor: [number, number, number] = [234, 179, 8]; // yellow-500
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Inventario', pageWidth / 2, 15, { align: 'center' });
      
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
        ['Total Productos:', totalProducts.toString()],
        ['Total Insumos:', totalSupplies.toString()],
        ['Valor Inventario:', formatCurrency(totalInventoryValue)],
        ['Stock Bajo:', lowStockProducts.length.toString()]
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

      // Tabla de Productos
      if (selectedReport === 'complete' || selectedReport === 'products-list') {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Listado de Productos', 14, yPos);
        yPos += 5;

        const productsTableData = products.map(p => [
          p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name,
          p.sku,
          p.category,
          p.stock.toString(),
          p.minStock.toString(),
          formatCurrency(p.price),
          p.status === 'active' ? 'Activo' : 'Inactivo'
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'SKU', 'Categoría', 'Stock', 'Min', 'Precio', 'Estado']],
          body: productsTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 22 },
            2: { cellWidth: 25 },
            3: { cellWidth: 18, halign: 'right' },
            4: { cellWidth: 15, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
            6: { cellWidth: 20, halign: 'center' }
          },
          foot: [[
            'TOTAL', '', '', totalStock.toString(), '', formatCurrency(totalInventoryValue), ''
          ]],
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Tabla de Insumos
      if (selectedReport === 'complete' || selectedReport === 'supplies-list') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Listado de Insumos', 14, yPos);
        yPos += 5;

        const suppliesTableData = supplies.map(s => [
          s.name,
          s.category,
          s.stock.toString(),
          s.unit,
          s.supplier,
          s.status === 'active' ? 'Activo' : 'Inactivo'
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Insumo', 'Categoría', 'Stock', 'Unidad', 'Proveedor', 'Estado']],
          body: suppliesTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 30 },
            2: { cellWidth: 20, halign: 'right' },
            3: { cellWidth: 20 },
            4: { cellWidth: 40 },
            5: { cellWidth: 20, halign: 'center' }
          }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Productos con Stock Bajo
      if (selectedReport === 'complete' || selectedReport === 'low-stock') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Productos con Stock Bajo (Requieren Atención)', 14, yPos);
        yPos += 5;

        if (lowStockProducts.length > 0) {
          const lowStockData = lowStockProducts.map(p => [
            p.name,
            p.sku,
            p.stock.toString(),
            p.minStock.toString(),
            (p.minStock - p.stock).toString(),
            p.supplier
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [['Producto', 'SKU', 'Stock Actual', 'Stock Mínimo', 'Faltante', 'Proveedor']],
            body: lowStockData,
            theme: 'striped',
            headStyles: { fillColor: warningColor, fontSize: 9, textColor: [0, 0, 0] },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
              0: { cellWidth: 45 },
              1: { cellWidth: 25 },
              2: { cellWidth: 25, halign: 'center' },
              3: { cellWidth: 25, halign: 'center' },
              4: { cellWidth: 25, halign: 'center' },
              5: { cellWidth: 35 }
            }
          });
        } else {
          doc.setFontSize(10);
          doc.setTextColor(...grayColor);
          doc.text('No hay productos con stock bajo actualmente.', 14, yPos + 10);
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
      const fileName = `reporte-inventario-${new Date().toISOString().split('T')[0]}.pdf`;
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
      description: 'Incluye productos, insumos y alertas de stock',
      icon: FileText
    },
    {
      id: 'products-list' as ReportType,
      title: 'Listado de Productos',
      description: 'Detalle de todos los productos en inventario',
      icon: Package
    },
    {
      id: 'supplies-list' as ReportType,
      title: 'Listado de Insumos',
      description: 'Detalle de todos los insumos disponibles',
      icon: Layers
    },
    {
      id: 'low-stock' as ReportType,
      title: 'Alertas de Stock',
      description: 'Productos que requieren reabastecimiento',
      icon: AlertTriangle
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
            <h2 className="text-2xl font-bold text-[#D0323A]">📦 Reporte de Inventario</h2>
            <p className="text-gray-500 mt-2">Generado el {formatDate(new Date())}</p>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Total Productos</p>
                <p className="text-xl font-bold">{totalProducts}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Total Insumos</p>
                <p className="text-xl font-bold">{totalSupplies}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Valor Inventario</p>
                <p className="text-xl font-bold">{formatCurrency(totalInventoryValue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Stock Bajo</p>
                <p className="text-xl font-bold">{lowStockProducts.length}</p>
              </div>
            </div>
          </div>

          {/* Tabla de productos (preview) */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SKU</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Precio</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 3).map((p) => (
                  <tr key={p.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D0323A] text-white rounded-lg flex items-center justify-center text-xs font-medium">
                          {p.image || p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.sku}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${p.stock <= p.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {p.stock}
                      </span>
                      {p.stock <= p.minStock && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500 inline ml-1" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
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
            { date: '2024-12-20', type: 'Reporte Completo', size: '245 KB' },
            { date: '2024-12-15', type: 'Listado de Productos', size: '156 KB' },
            { date: '2024-12-10', type: 'Alertas de Stock', size: '89 KB' },
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
