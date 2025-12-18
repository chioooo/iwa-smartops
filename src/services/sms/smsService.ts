import type { SmsStatusResponse, SmsSendRequest, SmsSendResponse } from './sms.types';

const SMS_API_BASE_URL = 'http://localhost:8080/api';

/**
 * Llama al endpoint GET /status de la API SMS.
 * Retorna el estado del servicio SMS.
 */
export async function fetchSmsStatus(): Promise<SmsStatusResponse> {
  const response = await fetch(`${SMS_API_BASE_URL}/status`);
  
  if (!response.ok) {
    throw new Error(`Error fetching SMS status: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Envía un SMS a uno o más números de teléfono.
 * @param phoneNumbers - Array de números de teléfono destino
 * @param message - Mensaje a enviar
 */
export async function sendSms(phoneNumbers: string[], message: string): Promise<SmsSendResponse> {
  const requestBody: SmsSendRequest = {
    phoneNumbers,
    message,
  };

  const response = await fetch(`${SMS_API_BASE_URL}/sms/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Error sending SMS: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Envía un SMS a un único número de teléfono.
 * @param phoneNumber - Número de teléfono destino
 * @param message - Mensaje a enviar
 */
export function sendSmsToSingle(phoneNumber: string, message: string): Promise<SmsSendResponse> {
  return sendSms([phoneNumber], message);
}
