import type { Invoice } from '../../../components/billing/BillingScreen';
import type { IInvoiceXMLGenerator } from '../interfaces/IInvoiceGenerator';

/**
 * Generador de XML para facturas CFDI.
 * Aplica SRP: única responsabilidad de generar el documento XML.
 */
export class InvoiceXMLGenerator implements IInvoiceXMLGenerator {
  generate(invoice: Invoice): Blob {
    const now = new Date().toISOString();
    const uuid = invoice.uuid || crypto.randomUUID();
    const { serie, folio } = this.parseFolio(invoice.folio);
    
    const conceptosXML = this.generateConceptosXML(invoice);
    const xml = this.buildXMLDocument(invoice, uuid, now, conceptosXML, serie, folio);

    return new Blob([xml], { type: 'application/xml' });
  }

  /**
   * Parsea el folio de la factura para extraer Serie y Folio.
   * Formatos soportados:
   * - "A-001" -> Serie: "A", Folio: "001"
   * - "FAC-2024-001" -> Serie: "FAC", Folio: "2024-001"
   * - "12345" (sin guión) -> Serie: "", Folio: "12345"
   */
  private parseFolio(folioCompleto: string): { serie: string; folio: string } {
    if (!folioCompleto || folioCompleto.trim() === '') {
      return { serie: '', folio: '1' };
    }

    const dashIndex = folioCompleto.indexOf('-');
    
    if (dashIndex === -1) {
      // Sin guión: todo es el folio, serie vacía
      return { serie: '', folio: folioCompleto };
    }

    // Con guión: primera parte es serie, resto es folio
    const serie = folioCompleto.substring(0, dashIndex);
    const folio = folioCompleto.substring(dashIndex + 1) || '1';
    
    return { serie, folio };
  }

  private generateConceptosXML(invoice: Invoice): string {
    return invoice.conceptos.map(c => `
      <cfdi:Concepto 
        ClaveProdServ="${c.claveProdServ}" 
        Cantidad="${c.cantidad}" 
        ClaveUnidad="${c.unidad}" 
        Descripcion="${this.escapeXML(c.descripcion)}" 
        ValorUnitario="${c.precioUnitario.toFixed(2)}" 
        Importe="${(c.cantidad * c.precioUnitario).toFixed(2)}">
        <cfdi:Impuestos>
          <cfdi:Traslados>
            <cfdi:Traslado Base="${(c.cantidad * c.precioUnitario).toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${c.iva.toFixed(2)}"/>
          </cfdi:Traslados>
        </cfdi:Impuestos>
      </cfdi:Concepto>`
    ).join('\n');
  }

  private buildXMLDocument(invoice: Invoice, uuid: string, now: string, conceptosXML: string, serie: string, folio: string): string {
    // Solo incluir Serie si tiene valor
    const serieAttr = serie ? `Serie="${serie}"` : '';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
  Version="4.0"
  ${serieAttr}
  Folio="${folio}"
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
    Nombre="${this.escapeXML(invoice.cliente)}" 
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
  
  <!-- 
    ============================================================================
    ADVERTENCIA - SOLO PARA DEMOSTRACIÓN
    ============================================================================
    Este XML NO es válido fiscalmente. Los sellos digitales son simulados.
    
    ANTES DE PRODUCCIÓN, se DEBE integrar con un PAC certificado por el SAT:
    
    1. SelloCFD (Sello del Emisor):
       - Debe generarse usando el Certificado de Sello Digital (CSD) del emisor
       - Algoritmo: SHA-256 con RSA (RSASSA-PKCS1-v1_5)
       - Se firma la Cadena Original del CFDI según Anexo 20 del SAT
       - El CSD debe estar vigente y registrado ante el SAT
    
    2. SelloSAT (Sello del PAC/SAT):
       - Este sello lo genera y retorna el PAC durante el proceso de timbrado
       - NO se genera localmente, viene en la respuesta del servicio de timbrado
       - Valida que el SAT recibió y registró el comprobante
    
    Proveedores PAC certificados: Finkok, Diverza, Edicom, Facturama, etc.
    ============================================================================
  -->
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital 
      xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital"
      Version="1.1"
      UUID="${uuid}"
      FechaTimbrado="${now}"
      RfcProvCertif="SAT970701NN3"
      SelloCFD="DEMO_SEAL_NOT_VALID_FOR_PRODUCTION_${this.generateDemoSeal(invoice.folio + '-' + uuid)}"      NoCertificadoSAT="00001000000500000001"
      SelloSAT="DEMO_SAT_SEAL_FROM_PAC_RESPONSE_${this.generateDemoSeal(uuid + invoice.rfc)}"/>
  </cfdi:Complemento>
  
</cfdi:Comprobante>`;
  }

  private generateDemoSeal(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
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

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
