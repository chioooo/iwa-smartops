import type { Business } from './businesses.types';

class BusinessesService {
  private businesses: Business[] = [];
  private loaded = false;

  async loadBusinesses(): Promise<Business[]> {
    if (this.loaded) return this.businesses;

    try {
      const response = await fetch('/denue_inegi_30_.csv');
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('latin1');
      const text = decoder.decode(buffer);
      this.businesses = this.parseCSV(text);
      this.loaded = true;
      return this.businesses;
    } catch (error) {
      console.error('Error loading businesses CSV:', error);
      return [];
    }
  }

  private parseCSV(csvText: string): Business[] {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = this.parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());
    console.log('CSV Headers:', headers);
    console.log('Total lines:', lines.length);
    const idIndex = headers.indexOf('id');
    const nomEstabIndex = headers.indexOf('nom_estab');
    const nombreActIndex = headers.indexOf('nombre_act');
    const municipioIndex = headers.indexOf('municipio');
    const localidadIndex = headers.indexOf('localidad');
    const latitudIndex = headers.indexOf('latitud');
    const longitudIndex = headers.indexOf('longitud');
    const perOcuIndex = headers.indexOf('per_ocu');
    const telefonoIndex = headers.indexOf('telefono');
    const correoelecIndex = headers.indexOf('correoelec');

    const businesses: Business[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      const lat = parseFloat(values[latitudIndex]);
      const lng = parseFloat(values[longitudIndex]);

      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

      businesses.push({
        id: values[idIndex] || `business-${i}`,
        nom_estab: values[nomEstabIndex]?.trim() || 'Sin nombre',
        nombre_act: values[nombreActIndex]?.trim() || '',
        municipio: values[municipioIndex]?.trim() || '',
        localidad: values[localidadIndex]?.trim() || '',
        latitud: lat,
        longitud: lng,
        per_ocu: values[perOcuIndex]?.trim() || '',
        telefono: values[telefonoIndex]?.trim() || '',
        correoelec: values[correoelecIndex]?.trim() || '',
      });
    }

    console.log('Parsed businesses:', businesses.length);
    return businesses;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  getVeracruzCenter(): [number, number] {
    return [19.1738, -96.1342];
  }
}

export const businessesService = new BusinessesService();
