import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from '../../components/billing/BillingScreen';

class InvoiceGeneratorService {
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getFormaPagoLabel(codigo: string): string {
    const formas: Record<string, string> = {
      '01': 'Efectivo',
      '02': 'Cheque nominativo',
      '03': 'Transferencia electrónica',
      '04': 'Tarjeta de crédito',
      '28': 'Tarjeta de débito',
      '99': 'Por definir'
    };
    return formas[codigo] || codigo;
  }

  private getMetodoPagoLabel(codigo: string): string {
    const metodos: Record<string, string> = {
      'PUE': 'Pago en una sola exhibición',
      'PPD': 'Pago en parcialidades o diferido'
    };
    return metodos[codigo] || codigo;
  }

  private getUsoCFDILabel(codigo: string): string {
    const usos: Record<string, string> = {
      'G01': 'Adquisición de mercancías',
      'G02': 'Devoluciones, descuentos o bonificaciones',
      'G03': 'Gastos en general',
      'I01': 'Construcciones',
      'I02': 'Mobiliario y equipo de oficina',
      'I03': 'Equipo de transporte',
      'I04': 'Equipo de cómputo',
      'P01': 'Por definir'
    };
    return usos[codigo] || codigo;
  }

  generateInvoicePDF(invoice: Invoice): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const primaryColor: [number, number, number] = [208, 50, 58];
    const grayColor: [number, number, number] = [100, 100, 100];

    // Header con logo simulado
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 14, 20);
    
    doc.setFontSize(14);
    doc.text(invoice.folio, 14, 30);
    
    // Tipo de comprobante
    doc.setFontSize(10);
    doc.text(`CFDI ${invoice.tipoCFDI === 'I' ? 'Ingreso' : invoice.tipoCFDI === 'E' ? 'Egreso' : 'Pago'}`, pageWidth - 14, 20, { align: 'right' });
    
    // Estado
    const estadoLabels: Record<string, string> = {
      vigente: 'VIGENTE',
      pagada: 'PAGADA',
      cancelada: 'CANCELADA',
      pendiente_timbrado: 'PENDIENTE'
    };
    doc.text(estadoLabels[invoice.estado], pageWidth - 14, 30, { align: 'right' });

    let yPos = 50;

    // UUID
    if (invoice.uuid) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, yPos - 5, pageWidth - 28, 15, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Folio Fiscal (UUID):', 18, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.uuid, 18, yPos + 6);
      yPos += 20;
    }

    // Datos del Emisor
    doc.setTextColor(...primaryColor);
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
    yPos += 10;

    // Datos del Receptor
    doc.setTextColor(...primaryColor);
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
    yPos += 10;

    // Datos de la Factura
    doc.setFillColor(245, 245, 245);
    doc.rect(14, yPos - 3, pageWidth - 28, 20, 'F');
    
    doc.setFontSize(8);
    const col1 = 18;
    const col2 = 60;
    const col3 = 110;
    const col4 = 155;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
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
    
    yPos += 25;

    // Tabla de Conceptos
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCEPTOS', 14, yPos);
    yPos += 3;

    const conceptosData = invoice.conceptos.map(c => [
      c.claveProdServ,
      c.descripcion.length > 40 ? c.descripcion.substring(0, 40) + '...' : c.descripcion,
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
      headStyles: { fillColor: primaryColor, fontSize: 8 },
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

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Totales
    const totalsX = pageWidth - 80;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(totalsX - 5, yPos - 3, 70, 35, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Subtotal:', totalsX, yPos + 3);
    doc.text('IVA (16%):', totalsX, yPos + 12);
    
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatCurrency(invoice.subtotal), pageWidth - 18, yPos + 3, { align: 'right' });
    doc.text(this.formatCurrency(invoice.iva), pageWidth - 18, yPos + 12, { align: 'right' });
    
    doc.setFillColor(...primaryColor);
    doc.rect(totalsX - 5, yPos + 18, 70, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', totalsX, yPos + 26);
    doc.text(this.formatCurrency(invoice.total), pageWidth - 18, yPos + 26, { align: 'right' });

    // Sello digital simulado
    yPos += 45;
    if (yPos < 250) {
      doc.setFillColor(250, 250, 250);
      doc.rect(14, yPos, pageWidth - 28, 30, 'F');
      doc.setTextColor(...grayColor);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('Sello Digital del CFDI:', 18, yPos + 5);
      doc.text('||' + btoa(invoice.uuid || invoice.folio).substring(0, 80) + '...||', 18, yPos + 10);
      doc.text('Sello del SAT:', 18, yPos + 18);
      doc.text('||' + btoa(invoice.rfc + invoice.total).substring(0, 80) + '...||', 18, yPos + 23);
    }

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text(
      'Este documento es una representación impresa de un CFDI | iWA SmartOps',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    return doc.output('blob');
  }

  generateInvoiceXML(invoice: Invoice): Blob {
    const now = new Date().toISOString();
    const uuid = invoice.uuid || crypto.randomUUID();
    
    const conceptosXML = invoice.conceptos.map(c => `
      <cfdi:Concepto 
        ClaveProdServ="${c.claveProdServ}" 
        Cantidad="${c.cantidad}" 
        ClaveUnidad="${c.unidad}" 
        Descripcion="${c.descripcion}" 
        ValorUnitario="${c.precioUnitario.toFixed(2)}" 
        Importe="${(c.cantidad * c.precioUnitario).toFixed(2)}">
        <cfdi:Impuestos>
          <cfdi:Traslados>
            <cfdi:Traslado Base="${(c.cantidad * c.precioUnitario).toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${c.iva.toFixed(2)}"/>
          </cfdi:Traslados>
        </cfdi:Impuestos>
      </cfdi:Concepto>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
  Version="4.0"
  Serie="${invoice.folio.split('-')[0]}"
  Folio="${invoice.folio.split('-')[1] || invoice.folio}"
  Fecha="${invoice.fechaEmision}"
  FormaPago="${invoice.formaPago}"
  NoCertificado="00001000000500000001"
  SubTotal="${invoice.subtotal.toFixed(2)}"
  Moneda="${invoice.moneda}"
  Total="${invoice.total.toFixed(2)}"
  TipoDeComprobante="${invoice.tipoCFDI}"
  MetodoPago="${invoice.metodoPago}"
  LugarExpedicion="${invoice.lugarExpedicion}"
  Exportacion="01">
  
  <cfdi:Emisor 
    Rfc="IWA230101ABC" 
    Nombre="iWA SmartOps S.A. de C.V." 
    RegimenFiscal="${invoice.regimenFiscal}"/>
  
  <cfdi:Receptor 
    Rfc="${invoice.rfc}" 
    Nombre="${invoice.cliente}" 
    DomicilioFiscalReceptor="64000"
    RegimenFiscalReceptor="601"
    UsoCFDI="${invoice.usoCFDI}"/>
  
  <cfdi:Conceptos>
    ${conceptosXML}
  </cfdi:Conceptos>
  
  <cfdi:Impuestos TotalImpuestosTrasladados="${invoice.iva.toFixed(2)}">
    <cfdi:Traslados>
      <cfdi:Traslado Base="${invoice.subtotal.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${invoice.iva.toFixed(2)}"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
  
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital 
      xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital"
      Version="1.1"
      UUID="${uuid}"
      FechaTimbrado="${now}"
      RfcProvCertif="SAT970701NN3"
      SelloCFD="${btoa(invoice.folio + invoice.total).substring(0, 100)}"
      NoCertificadoSAT="00001000000500000001"
      SelloSAT="${btoa(uuid + invoice.rfc).substring(0, 100)}"/>
  </cfdi:Complemento>
  
</cfdi:Comprobante>`;

    return new Blob([xml], { type: 'application/xml' });
  }

  downloadPDF(invoice: Invoice): void {
    const blob = this.generateInvoicePDF(invoice);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura-${invoice.folio}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadXML(invoice: Invoice): void {
    const blob = this.generateInvoiceXML(invoice);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura-${invoice.folio}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Simular timbrado de factura
  async timbrarFactura(invoice: Invoice): Promise<Invoice> {
    // Simular delay de timbrado
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generar UUID simulado
    const uuid = crypto.randomUUID();
    
    return {
      ...invoice,
      uuid,
      estado: 'vigente'
    };
  }
}

export const invoiceGeneratorService = new InvoiceGeneratorService();
