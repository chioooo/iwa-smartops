/**
 * Respuesta del endpoint /status de la API SMS (Pushbullet).
 * flag: "green" | "yellow" | "red" indica el estado general.
 * user: estado del token/usuario ("ok", "token error", "user error").
 * device: estado del dispositivo objetivo ("ok", "iden error").
 * status: mensaje descriptivo del estado.
 */
export interface SmsStatusResponse {
  flag: 'green' | 'yellow' | 'red';
  user: string;
  device: string;
  status: string;
}

/**
 * Request body para enviar SMS.
 */
export interface SmsSendRequest {
  phoneNumbers: string[];
  message: string;
}

/**
 * Datos de respuesta individual por número de teléfono.
 */
export interface SmsSendResponseData {
  addresses: string[];
  message: string;
}

/**
 * Respuesta individual por número de teléfono.
 */
export interface SmsSendResponseItem {
  phoneNumber: string;
  response: {
    active: boolean;
    created: number;
    data: SmsSendResponseData;
  };
}

/**
 * Respuesta del endpoint /send de la API SMS.
 */
export interface SmsSendResponse {
  responses: SmsSendResponseItem[];
}
