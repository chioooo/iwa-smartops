import type { Invoice } from '../../components/billing/BillingScreen';
import type { IInvoiceService, IInvoicePDFGenerator, IInvoiceXMLGenerator, IInvoiceDownloader, IPACService } from './interfaces/IInvoiceGenerator';
import { InvoicePDFGenerator } from './generators/InvoicePDFGenerator';
import { InvoiceXMLGenerator } from './generators/InvoiceXMLGenerator';
import { InvoiceDownloadService } from './services/InvoiceDownloadService';
import { PACServiceFactory } from './pac/IPACServiceFactory';

/**
 * Servicio principal de facturación.
 * Actúa como Facade para los servicios individuales.
 * 
 * Aplica SOLID:
 * - SRP: Delega responsabilidades a servicios especializados
 * - OCP: Nuevos generadores/PACs se agregan sin modificar esta clase
 * - LSP: Todos los servicios son intercambiables por sus interfaces
 * - ISP: Interfaces segregadas para cada responsabilidad
 * - DIP: Depende de abstracciones, no de implementaciones concretas
 */
export class InvoiceService implements IInvoiceService {
  private readonly pdfGenerator: IInvoicePDFGenerator;
  private readonly xmlGenerator: IInvoiceXMLGenerator;
  private readonly downloader: IInvoiceDownloader;
  private readonly pacService: IPACService;

  constructor(
    pdfGenerator?: IInvoicePDFGenerator,
    xmlGenerator?: IInvoiceXMLGenerator,
    downloader?: IInvoiceDownloader,
    pacService?: IPACService
  ) {
    // Inyección de dependencias con valores por defecto
    this.pdfGenerator = pdfGenerator || new InvoicePDFGenerator();
    this.xmlGenerator = xmlGenerator || new InvoiceXMLGenerator();
    this.downloader = downloader || new InvoiceDownloadService();
    this.pacService = pacService || PACServiceFactory.getPACService();
  }

  generatePDF(invoice: Invoice): Blob {
    return this.pdfGenerator.generate(invoice);
  }

  generateXML(invoice: Invoice): Blob {
    return this.xmlGenerator.generate(invoice);
  }

  downloadPDF(invoice: Invoice): void {
    const blob = this.generatePDF(invoice);
    this.downloader.download(blob, `Factura-${invoice.folio}.pdf`);
  }

  downloadXML(invoice: Invoice): void {
    const blob = this.generateXML(invoice);
    this.downloader.download(blob, `Factura-${invoice.folio}.xml`);
  }

  async timbrarFactura(invoice: Invoice): Promise<Invoice> {
    const result = await this.pacService.timbrar(invoice);
    
    if (!result.success) {
      throw new Error(result.error || 'Error al timbrar la factura');
    }

    return {
      ...invoice,
      uuid: result.uuid,
      estado: 'vigente'
    };
  }

  /**
   * Indica si el servicio PAC actual es de producción.
   */
  isProductionPAC(): boolean {
    return this.pacService.isProduction();
  }

  /**
   * Obtiene el nombre del proveedor PAC actual.
   */
  getPACProviderName(): string {
    return this.pacService.getProviderName();
  }
}

// Instancia singleton para mantener compatibilidad con el código existente
export const invoiceService = new InvoiceService();
