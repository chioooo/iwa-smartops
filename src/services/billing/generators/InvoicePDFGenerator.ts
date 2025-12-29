import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from '../../../components/billing/BillingScreen';
import type { IInvoicePDFGenerator } from '../interfaces/IInvoiceGenerator';

/**
 * Generador de PDF para facturas.
 * Aplica SRP: única responsabilidad de generar el documento PDF.
 */
export class InvoicePDFGenerator implements IInvoicePDFGenerator {
  private readonly primaryColor: [number, number, number] = [208, 50, 58];
  private readonly grayColor: [number, number, number] = [100, 100, 100];
  private readonly MAX_DESCRIPTION_LENGTH = 40;
  private readonly MAX_Y_POS_FOR_SEALS = 250;

  generate(invoice: Invoice): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    this.renderHeader(doc, invoice, pageWidth);
    let yPos = this.renderUUID(doc, invoice, pageWidth, 50);
    yPos = this.renderEmisor(doc, invoice, yPos);
    yPos = this.renderReceptor(doc, invoice, yPos);
    yPos = this.renderDatosFiscales(doc, invoice, pageWidth, yPos);
    yPos = this.renderConceptos(doc, invoice, pageWidth, yPos);
    this.renderTotales(doc, invoice, pageWidth, yPos);
    this.renderSellosDemo(doc, invoice, pageWidth, yPos + 45);
    this.renderFooter(doc, pageWidth);

    return doc.output('blob');
  }

  private renderHeader(doc: jsPDF, invoice: Invoice, pageWidth: number): void {
    doc.setFillColor(...this.primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 14, 20);
    
    doc.setFontSize(14);
    doc.text(invoice.folio, 14, 30);
    
    doc.setFontSize(10);
    const tipoLabel = invoice.tipoCFDI === 'I' ? 'Ingreso' : invoice.tipoCFDI === 'E' ? 'Egreso' : 'Pago';
    doc.text(`CFDI ${tipoLabel}`, pageWidth - 14, 20, { align: 'right' });
    
    const estadoLabels: Record<string, string> = {
      vigente: 'VIGENTE',
      pagada: 'PAGADA',
      cancelada: 'CANCELADA',
      pendiente_timbrado: 'PENDIENTE'
    };
    doc.text(estadoLabels[invoice.estado], pageWidth - 14, 30, { align: 'right' });
  }

  private renderUUID(doc: jsPDF, invoice: Invoice, pageWidth: number, yPos: number): number {
    if (invoice.uuid) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, yPos - 5, pageWidth - 28, 15, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Folio Fiscal (UUID):', 18, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.uuid, 18, yPos + 6);
      return yPos + 20;
    }
    return yPos;
  }

  private renderEmisor(doc: jsPDF, invoice: Invoice, yPos: number): number {
    doc.setTextColor(...this.primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EMISOR', 14, yPos);
    yPos += 6;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('iWA SmartOps S.A. de C.V.', 14, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('RFC: IWA230101ABC', 14, yPos);
    yPos += 4;
    doc.text(`Régimen Fiscal: ${invoice.regimenFiscal}`, 14, yPos);
    yPos += 4;
    doc.text(`Lugar de Expedición: CP ${invoice.lugarExpedicion}`, 14, yPos);
    
    return yPos + 10;
  }

  private renderReceptor(doc: jsPDF, invoice: Invoice, yPos: number): number {
    doc.setTextColor(...this.primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEPTOR', 14, yPos);
    yPos += 6;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.cliente, 14, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`RFC: ${invoice.rfc}`, 14, yPos);
    yPos += 4;
    doc.text(`Uso CFDI: ${invoice.usoCFDI} - ${this.getUsoCFDILabel(invoice.usoCFDI)}`, 14, yPos);
    
    return yPos + 10;
  }

  private renderDatosFiscales(doc: jsPDF, invoice: Invoice, pageWidth: number, yPos: number): number {
    doc.setFillColor(245, 245, 245);
    doc.rect(14, yPos - 3, pageWidth - 28, 20, 'F');
    
    doc.setFontSize(8);
    const col1 = 18;
    const col2 = 60;
    const col3 = 110;
    const col4 = 155;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.grayColor);
    doc.text('Fecha Emisión:', col1, yPos + 3);
    doc.text('Moneda:', col2, yPos + 3);
    doc.text('Método de Pago:', col3, yPos + 3);
    doc.text('Forma de Pago:', col4, yPos + 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(this.formatDate(invoice.fechaEmision), col1, yPos + 10);
    doc.text(invoice.moneda, col2, yPos + 10);
    doc.text(this.getMetodoPagoLabel(invoice.metodoPago), col3, yPos + 10);
    doc.text(this.getFormaPagoLabel(invoice.formaPago), col4, yPos + 10);
    
    return yPos + 25;
  }

  private renderConceptos(doc: jsPDF, invoice: Invoice, _pageWidth: number, yPos: number): number {
    doc.setTextColor(...this.primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCEPTOS', 14, yPos);
    yPos += 3;

    const conceptosData = invoice.conceptos.map(c => [
      c.claveProdServ,
      c.descripcion.length > 40 ? c.descripcion.substring(0, this.MAX_DESCRIPTION_LENGTH) + '...' : c.descripcion,
      c.cantidad.toString(),
      c.unidad,
      this.formatCurrency(c.precioUnitario),
      this.formatCurrency(c.iva),
      this.formatCurrency(c.total)
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Clave', 'Descripción', 'Cant.', 'Unidad', 'P. Unitario', 'IVA', 'Total']],
      body: conceptosData,
      theme: 'striped',
      headStyles: { fillColor: this.primaryColor, fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 55 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 18 },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 25, halign: 'right' }
      }
    });

    return (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  private renderTotales(doc: jsPDF, invoice: Invoice, pageWidth: number, yPos: number): void {
    const totalsX = pageWidth - 80;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(totalsX - 5, yPos - 3, 70, 35, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.grayColor);
    doc.text('Subtotal:', totalsX, yPos + 3);
    doc.text('IVA (16%):', totalsX, yPos + 12);
    
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatCurrency(invoice.subtotal), pageWidth - 18, yPos + 3, { align: 'right' });
    doc.text(this.formatCurrency(invoice.iva), pageWidth - 18, yPos + 12, { align: 'right' });
    
    doc.setFillColor(...this.primaryColor);
    doc.rect(totalsX - 5, yPos + 18, 70, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', totalsX, yPos + 26);
    doc.text(this.formatCurrency(invoice.total), pageWidth - 18, yPos + 26, { align: 'right' });
  }

  private renderSellosDemo(doc: jsPDF, invoice: Invoice, pageWidth: number, yPos: number): void {
    if (yPos < this.MAX_Y_POS_FOR_SEALS) {
      doc.setFillColor(250, 250, 250);
      doc.rect(14, yPos, pageWidth - 28, 30, 'F');
      doc.setTextColor(...this.grayColor);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('Sello Digital del CFDI (DEMO - No válido fiscalmente):', 18, yPos + 5);
      doc.text(this.generateDemoSeal(invoice.uuid || invoice.folio), 18, yPos + 10);
      doc.text('Sello del SAT (DEMO - No válido fiscalmente):', 18, yPos + 18);
      doc.text(this.generateDemoSeal(invoice.rfc + String(invoice.total)), 18, yPos + 23);
    }
  }

  private renderFooter(doc: jsPDF, pageWidth: number): void {
    doc.setFontSize(7);
    doc.setTextColor(...this.grayColor);
    doc.text(
      'Este documento es una representación impresa de un CFDI | iWA SmartOps',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  private generateDemoSeal(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '||';
    let seed = 0;
    for (let i = 0; i < input.length; i++) {
      seed = ((seed << 5) - seed) + input.charCodeAt(i);
      seed = seed & seed;
    }
    for (let i = 0; i < 80; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      result += chars[seed % chars.length];
    }
    return result + '...||';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  private getFormaPagoLabel(codigo: string): string {
    const formas: Record<string, string> = {
      '01': 'Efectivo', '02': 'Cheque', '03': 'Transferencia',
      '04': 'T. Crédito', '28': 'T. Débito', '99': 'Por definir'
    };
    return formas[codigo] || codigo;
  }

  private getMetodoPagoLabel(codigo: string): string {
    const metodos: Record<string, string> = {
      'PUE': 'Pago en una exhibición', 'PPD': 'Pago en parcialidades'
    };
    return metodos[codigo] || codigo;
  }

  private getUsoCFDILabel(codigo: string): string {
    const usos: Record<string, string> = {
      'G01': 'Adquisición de mercancías', 'G02': 'Devoluciones',
      'G03': 'Gastos en general', 'I04': 'Equipo de cómputo', 'P01': 'Por definir'
    };
    return usos[codigo] || codigo;
  }
}
