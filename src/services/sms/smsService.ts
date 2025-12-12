import type { SmsStatusResponse } from './sms.types';

// TODO: Configurar la URL base de la API SMS cuando esté disponible
const SMS_API_BASE_URL = '';

/**
 * Llama al endpoint /status de la API SMS.
 * Actualmente devuelve un mock; reemplazar con fetch real cuando la API esté lista.
 */
export async function fetchSmsStatus(): Promise<SmsStatusResponse> {
  // TODO: Implementar llamada real a la API
  // const response = await fetch(`${SMS_API_BASE_URL}/status`);
  // if (!response.ok) throw new Error('Error fetching SMS status');
  // return response.json();

  // Mock response para desarrollo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        flag: 'yellow',
        user: 'ok',
        device: 'iden error',
        status: 'Target device not found.',
      });
    }, 1000);
  });
}

// Exportar la constante para evitar warning de "never read"
export { SMS_API_BASE_URL };
