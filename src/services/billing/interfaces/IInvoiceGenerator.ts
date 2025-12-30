import type { Invoice } from '../../../components/billing/BillingScreen';

/**
 * Interface para generadores de documentos de factura.
 * Aplica ISP: cada generador tiene una responsabilidad específica.
 */
export interface IInvoiceDocumentGenerator {
  generate(invoice: Invoice): Blob;
}

/**
 * Interface para generadores de PDF de factura.
 */
export interface IInvoicePDFGenerator extends IInvoiceDocumentGenerator {
  generate(invoice: Invoice): Blob;
}

/**
 * Interface para generadores de XML de factura.
 */
export interface IInvoiceXMLGenerator extends IInvoiceDocumentGenerator {
  generate(invoice: Invoice): Blob;
}

/**
 * Interface para el servicio de descarga de documentos.
 * Aplica SRP: solo se encarga de descargar archivos.
 */
export interface IInvoiceDownloader {
  download(blob: Blob, filename: string): void;
}

/**
 * Resultado del proceso de timbrado.
 */
export interface TimbradoResult {
  success: boolean;
  uuid?: string;
  selloCFD?: string;
  selloSAT?: string;
  fechaTimbrado?: string;
  error?: string;
}

/**
 * Interface para el servicio de timbrado (PAC).
 * Aplica DIP: permite inyectar diferentes implementaciones (demo/producción).
 * Aplica OCP: nuevos PACs pueden implementar esta interface sin modificar código existente.
 */
export interface IPACService {
  /**
   * Timbra una factura y retorna el resultado con los sellos digitales.
   * En producción, esto se conecta con un PAC certificado por el SAT.
   */
  timbrar(invoice: Invoice): Promise<TimbradoResult>;
  
  /**
   * Indica si este servicio es de producción o demostración.
   */
  isProduction(): boolean;
  
  /**
   * Nombre del proveedor PAC.
   */
  getProviderName(): string;
}

/**
 * Interface principal del servicio de facturación.
 * Actúa como facade para los servicios individuales.
 */
export interface IInvoiceService {
  generatePDF(invoice: Invoice): Blob;
  generateXML(invoice: Invoice): Blob;
  downloadPDF(invoice: Invoice): void;
  downloadXML(invoice: Invoice): void;
  timbrarFactura(invoice: Invoice): Promise<Invoice>;
}
