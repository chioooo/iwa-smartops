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
