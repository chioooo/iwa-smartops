import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { inventoryService } from '../inventory/inventoryService';
import { demoDataService } from '../usersService';

export type ReportType = 'inventario' | 'usuarios' | 'facturacion' | 'finanzas';

export interface ReportConfig {
  tipo: ReportType;
  startDate?: string;
  endDate?: string;
  format: 'pdf' | 'excel';
  generatedBy: string;
}

export interface GeneratedReport {
  id: string;
  name: string;
  tipo: ReportType;
  generationDate: string;
  generatedBy: string;
  status: 'disponible' | 'proceso' | 'error';
  format: 'pdf' | 'excel';
  blob?: Blob;
  parameters: {
    startDate?: string;
    endDate?: string;
  };
}

class ReportGeneratorService {
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  private getReportTitle(tipo: ReportType): string {
    const titles: Record<ReportType, string> = {
      'inventario': 'Reporte de Inventario',
      'usuarios': 'Reporte de Usuarios y Roles',
      'facturacion': 'Reporte de Facturación',
      'finanzas': 'Reporte Financiero'
    };
    return titles[tipo];
  }

  async generateReport(config: ReportConfig): Promise<GeneratedReport> {
    const reportId = crypto.randomUUID();
    const now = new Date();
    
    try {
      let blob: Blob | undefined;
      
      if (config.format === 'pdf') {
        switch (config.tipo) {
          case 'inventario':
            blob = await this.generateInventoryPDF();
            break;
          case 'usuarios':
            blob = await this.generateUsersPDF();
            break;
          case 'facturacion':
            blob = await this.generateBillingPDF();
            break;
          case 'finanzas':
            blob = await this.generateFinancesPDF();
            break;
        }
      }

      return {
        id: reportId,
        name: `${this.getReportTitle(config.tipo)} - ${now.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}`,
        tipo: config.tipo,
        generationDate: now.toISOString(),
        generatedBy: config.generatedBy,
        status: 'disponible',
        format: config.format,
        blob,
        parameters: {
          startDate: config.startDate,
          endDate: config.endDate
        }
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        id: reportId,
        name: `${this.getReportTitle(config.tipo)} - Error`,
        tipo: config.tipo,
        generationDate: now.toISOString(),
        generatedBy: config.generatedBy,
        status: 'error',
        format: config.format,
        parameters: {
          startDate: config.startDate,
          endDate: config.endDate
        }
      };
    }
  }

  private async generateInventoryPDF(): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    const products = inventoryService.getProducts();
    const supplies = inventoryService.getSupplies();
    
    const primaryColor: [number, number, number] = [208, 50, 58];
    const grayColor: [number, number, number] = [100, 100, 100];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Inventario', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el ${this.formatDate(now)}`, pageWidth / 2, 23, { align: 'center' });
    doc.text('iWA SmartOps - Sistema de Gestion Empresarial', pageWidth / 2, 30, { align: 'center' });

    // Resumen
    let yPos = 45;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    
    yPos += 10;
    doc.setFillColor(249, 250, 251);
    doc.rect(14, yPos - 5, pageWidth - 28, 25, 'F');
    
    const totalProducts = products.length;
    const totalSupplies = supplies.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock <= p.minStock).length;

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`Total Productos: ${totalProducts}`, 18, yPos);
    doc.text(`Total Insumos: ${totalSupplies}`, 18, yPos + 10);
    doc.text(`Valor Inventario: ${this.formatCurrency(totalValue)}`, pageWidth / 2, yPos);
    doc.text(`Stock Bajo: ${lowStock} productos`, pageWidth / 2, yPos + 10);

    yPos += 35;

    // Tabla de Productos
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Productos', 14, yPos);
    yPos += 5;

    const productsData = products.map(p => [
      p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name,
      p.sku,
      p.category,
      p.stock.toString(),
      this.formatCurrency(p.price),
      p.status === 'active' ? 'Activo' : 'Inactivo'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Producto', 'SKU', 'Categoria', 'Stock', 'Precio', 'Estado']],
      body: productsData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      foot: [['TOTAL', '', '', totalStock.toString(), this.formatCurrency(totalValue), '']],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 }
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Tabla de Insumos
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Insumos', 14, yPos);
    yPos += 5;

    const suppliesData = supplies.map(s => [
      s.name,
      s.category,
      s.stock.toString(),
      s.unit,
      s.supplier,
      s.status === 'active' ? 'Activo' : 'Inactivo'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Insumo', 'Categoria', 'Stock', 'Unidad', 'Proveedor', 'Estado']],
      body: suppliesData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 9 },
      bodyStyles: { fontSize: 8 }
    });

    // Footer
    this.addFooter(doc, grayColor);

    return doc.output('blob');
  }

  private async generateUsersPDF(): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    const users = demoDataService.getUsers();
    const roles = demoDataService.getRoles();
    
    const primaryColor: [number, number, number] = [208, 50, 58];
    const grayColor: [number, number, number] = [100, 100, 100];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Usuarios y Roles', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el ${this.formatDate(now)}`, pageWidth / 2, 23, { align: 'center' });
    doc.text('iWA SmartOps - Sistema de Gestion Empresarial', pageWidth / 2, 30, { align: 'center' });

    // Resumen
    let yPos = 45;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    
    yPos += 10;
    doc.setFillColor(249, 250, 251);
    doc.rect(14, yPos - 5, pageWidth - 28, 25, 'F');
    
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`Total Usuarios: ${users.length}`, 18, yPos);
    doc.text(`Usuarios Activos: ${activeUsers}`, 18, yPos + 10);
    doc.text(`Usuarios Inactivos: ${inactiveUsers}`, pageWidth / 2, yPos);
    doc.text(`Total Roles: ${roles.length}`, pageWidth / 2, yPos + 10);

    yPos += 35;

    // Tabla de Usuarios
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Usuarios', 14, yPos);
    yPos += 5;

    const usersData = users.map(u => [
      u.name,
      u.email,
      u.role,
      u.status === 'active' ? 'Activo' : 'Inactivo',
      u.createdAt || 'N/A'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Nombre', 'Email', 'Rol', 'Estado', 'Fecha Creacion']],
      body: usersData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      foot: [['TOTAL', '', '', `${activeUsers} activos`, '']],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8 }
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Tabla de Roles
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Roles y Permisos', 14, yPos);
    yPos += 5;

    const rolesData = roles.map(r => [
      r.name,
      r.description,
      (r.permissionsCount || 0).toString(),
      (r.usersCount || users.filter(u => u.role === r.name).length).toString()
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Rol', 'Descripcion', 'Permisos', 'Usuarios']],
      body: rolesData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 9 },
      bodyStyles: { fontSize: 8 }
    });

    // Footer
    this.addFooter(doc, grayColor);

    return doc.output('blob');
  }

  private async generateBillingPDF(): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    const primaryColor: [number, number, number] = [208, 50, 58];
    const grayColor: [number, number, number] = [100, 100, 100];

    // Mock billing data (en producción vendría del servicio de facturación)
    const invoices = [
      { folio: 'A-001', cliente: 'Acme Corporation', rfc: 'ACM990101ABC', total: 11600, estado: 'vigente' },
      { folio: 'A-002', cliente: 'TechSolutions México', rfc: 'TSM850615XYZ', total: 23200, estado: 'pagada' },
      { folio: 'A-003', cliente: 'Distribuidora Nacional', rfc: 'DNL920320KLM', total: 5800, estado: 'pendiente' }
    ];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Facturacion', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el ${this.formatDate(now)}`, pageWidth / 2, 23, { align: 'center' });
    doc.text('iWA SmartOps - Sistema de Gestion Empresarial', pageWidth / 2, 30, { align: 'center' });

    // Resumen
    let yPos = 45;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    
    yPos += 10;
    doc.setFillColor(249, 250, 251);
    doc.rect(14, yPos - 5, pageWidth - 28, 25, 'F');
    
    const totalFacturado = invoices.reduce((sum, i) => sum + i.total, 0);
    const vigentes = invoices.filter(i => i.estado === 'vigente').length;
    const pagadas = invoices.filter(i => i.estado === 'pagada').length;

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`Total Facturas: ${invoices.length}`, 18, yPos);
    doc.text(`Total Facturado: ${this.formatCurrency(totalFacturado)}`, 18, yPos + 10);
    doc.text(`Vigentes: ${vigentes}`, pageWidth / 2, yPos);
    doc.text(`Pagadas: ${pagadas}`, pageWidth / 2, yPos + 10);

    yPos += 35;

    // Tabla de Facturas
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Facturas', 14, yPos);
    yPos += 5;

    const invoicesData = invoices.map(i => [
      i.folio,
      i.cliente,
      i.rfc,
      this.formatCurrency(i.total),
      i.estado.charAt(0).toUpperCase() + i.estado.slice(1)
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Folio', 'Cliente', 'RFC', 'Total', 'Estado']],
      body: invoicesData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      foot: [['TOTAL', '', '', this.formatCurrency(totalFacturado), `${invoices.length} facturas`]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8 }
    });

    // Footer
    this.addFooter(doc, grayColor);

    return doc.output('blob');
  }

  private async generateFinancesPDF(): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    const products = inventoryService.getProducts();
    
    const primaryColor: [number, number, number] = [208, 50, 58];
    const grayColor: [number, number, number] = [100, 100, 100];

    // Calcular métricas financieras
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalInventoryCost = products.reduce((sum, p) => sum + (p.purchasePrice * p.stock), 0);
    const potentialProfit = totalInventoryValue - totalInventoryCost;
    const profitMargin = totalInventoryCost > 0 ? (potentialProfit / totalInventoryCost) * 100 : 0;

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte Financiero de Inventario', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el ${this.formatDate(now)}`, pageWidth / 2, 23, { align: 'center' });
    doc.text('iWA SmartOps - Sistema de Gestion Empresarial', pageWidth / 2, 30, { align: 'center' });

    // Resumen
    let yPos = 45;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    
    yPos += 10;
    doc.setFillColor(249, 250, 251);
    doc.rect(14, yPos - 5, pageWidth - 28, 25, 'F');

    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`Valor Inventario: ${this.formatCurrency(totalInventoryValue)}`, 18, yPos);
    doc.text(`Costo Inventario: ${this.formatCurrency(totalInventoryCost)}`, 18, yPos + 10);
    doc.text(`Ganancia Potencial: ${this.formatCurrency(potentialProfit)}`, pageWidth / 2, yPos);
    doc.text(`Margen Promedio: ${profitMargin.toFixed(1)}%`, pageWidth / 2, yPos + 10);

    yPos += 35;

    // Tabla de Valoración
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Valoracion de Inventario por Producto', 14, yPos);
    yPos += 5;

    const financeData = products.map(p => {
      const totalCost = p.purchasePrice * p.stock;
      const totalValue = p.price * p.stock;
      const margin = ((p.price - p.purchasePrice) / p.purchasePrice) * 100;
      return [
        p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
        p.stock.toString(),
        this.formatCurrency(p.purchasePrice),
        this.formatCurrency(p.price),
        this.formatCurrency(totalCost),
        this.formatCurrency(totalValue),
        `${margin.toFixed(1)}%`
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Producto', 'Stock', 'P. Compra', 'P. Venta', 'Costo Total', 'Valor Total', 'Margen']],
      body: financeData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      foot: [['TOTAL', products.reduce((s, p) => s + p.stock, 0).toString(), '', '', 
        this.formatCurrency(totalInventoryCost), this.formatCurrency(totalInventoryValue), `${profitMargin.toFixed(1)}%`]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 }
    });

    // Footer
    this.addFooter(doc, grayColor);

    return doc.output('blob');
  }

  private addFooter(doc: jsPDF, grayColor: [number, number, number]): void {
    const pageWidth = doc.internal.pageSize.getWidth();
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
  }

  downloadReport(report: GeneratedReport): void {
    if (report.blob) {
      const url = URL.createObjectURL(report.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}

export const reportGeneratorService = new ReportGeneratorService();
