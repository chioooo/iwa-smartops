import type { Invoice } from '../../components/billing/BillingScreen';
import { InvoiceService } from './InvoiceService';

/**
 * @deprecated Use InvoiceService directamente para mejor aplicación de SOLID.
 * Este archivo se mantiene para compatibilidad con código existente.
 * 
 * La nueva arquitectura SOLID está en:
 * - interfaces/IInvoiceGenerator.ts - Interfaces segregadas (ISP, DIP)
 * - generators/InvoicePDFGenerator.ts - Generación de PDF (SRP)
 * - generators/InvoiceXMLGenerator.ts - Generación de XML (SRP)
 * - services/InvoiceDownloadService.ts - Descarga de archivos (SRP)
 * - pac/DemoPACService.ts - Servicio PAC demo (OCP, DIP)
 * - pac/IPACServiceFactory.ts - Factory para PAC (OCP)
 * - InvoiceService.ts - Facade principal (todos los principios)
 */
class InvoiceGeneratorService {
  private readonly service: InvoiceService;

  constructor() {
    this.service = new InvoiceService();
  }

  generateInvoicePDF(invoice: Invoice): Blob {
    return this.service.generatePDF(invoice);
  }

  generateInvoiceXML(invoice: Invoice): Blob {
    return this.service.generateXML(invoice);
  }

  downloadPDF(invoice: Invoice): void {
    this.service.downloadPDF(invoice);
  }

  downloadXML(invoice: Invoice): void {
    this.service.downloadXML(invoice);
  }

  async timbrarFactura(invoice: Invoice): Promise<Invoice> {
    return this.service.timbrarFactura(invoice);
  }
}

export const invoiceGeneratorService = new InvoiceGeneratorService();
