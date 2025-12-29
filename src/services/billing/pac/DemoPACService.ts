import type { Invoice } from '../../../components/billing/BillingScreen';
import type { IPACService, TimbradoResult } from '../interfaces/IInvoiceGenerator';

/**
 * Servicio PAC de demostración.
 * Aplica OCP: implementa IPACService sin modificar código existente.
 * Aplica DIP: puede ser reemplazado por una implementación real en producción.
 * 
 * ADVERTENCIA: Este servicio NO genera sellos criptográficos válidos.
 * Solo para propósitos de demostración y desarrollo.
 */
export class DemoPACService implements IPACService {
  async timbrar(invoice: Invoice): Promise<TimbradoResult> {
    // Simular delay de conexión con PAC
    await this.simulateNetworkDelay();
    
    // Generar UUID simulado
    const uuid = crypto.randomUUID();
    const fechaTimbrado = new Date().toISOString();
    
    return {
      success: true,
      uuid,
      selloCFD: this.generateDemoSeal(`CFD_${invoice.folio}_${invoice.total}`),
      selloSAT: this.generateDemoSeal(`SAT_${uuid}_${invoice.rfc}`),
      fechaTimbrado
    };
  }

  isProduction(): boolean {
    return false;
  }

  getProviderName(): string {
    return 'Demo PAC (No válido fiscalmente)';
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  private generateDemoSeal(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = 'DEMO_';
    let seed = 0;
    for (let i = 0; i < input.length; i++) {
      seed = ((seed << 5) - seed) + input.charCodeAt(i);
      seed = seed & seed;
    }
    for (let i = 0; i < 100; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      result += chars[seed % chars.length];
    }
    return result;
  }
}
