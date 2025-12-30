import type { IPACService } from '../interfaces/IInvoiceGenerator';
import { DemoPACService } from './DemoPACService';

/**
 * Factory para crear instancias de servicios PAC.
 * Aplica OCP: permite agregar nuevos proveedores PAC sin modificar código existente.
 * Aplica DIP: los consumidores dependen de la abstracción IPACService.
 */
export class PACServiceFactory {
  private static instance: IPACService | null = null;

  /**
   * Obtiene la instancia del servicio PAC configurado.
   * En producción, cambiar a la implementación real del PAC.
   */
  static getPACService(): IPACService {
    if (!this.instance) {
      // TODO: En producción, usar variable de entorno para seleccionar el PAC
      // Ejemplo: if (process.env.PAC_PROVIDER === 'finkok') { return new FinkokPACService(); }
      this.instance = new DemoPACService();
    }
    return this.instance;
  }

  /**
   * Permite inyectar una implementación específica de PAC.
   * Útil para testing o para cambiar dinámicamente el proveedor.
   */
  static setPACService(pacService: IPACService): void {
    this.instance = pacService;
  }

  /**
   * Resetea la instancia (útil para testing).
   */
  static reset(): void {
    this.instance = null;
  }
}
