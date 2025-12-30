import type { IInvoiceDownloader } from '../interfaces/IInvoiceGenerator';

/**
 * Servicio de descarga de documentos.
 * Aplica SRP: única responsabilidad de descargar archivos al navegador.
 */
export class InvoiceDownloadService implements IInvoiceDownloader {
  download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
