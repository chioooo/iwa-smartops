// Servicio para enviar correos via Azure Functions + Azure Communication Services

interface EmailAttachment {
  name: string;
  contentType: string;
  content: string; 
}

export type EmailProvider = 'gmail' | 'microsoft';

export interface EmailProviderInfo {
  id: EmailProvider;
  name: string;
  email: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  provider: EmailProvider;
  attachments?: EmailAttachment[];
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || '';

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  if (!EMAIL_API_URL) {
    console.error('VITE_EMAIL_API_URL no está configurada');
    return { success: false, error: 'Servicio de correo no configurado' };
  }

  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Error al enviar correo' };
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error enviando correo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de conexión' 
    };
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Obtener proveedores de correo disponibles
export async function getEmailProviders(): Promise<EmailProviderInfo[]> {
  const baseUrl = EMAIL_API_URL.replace('/send-email', '');
  try {
    const response = await fetch(`${baseUrl}/email-providers`);
    const data = await response.json();
    return data.providers || [];
  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    return [];
  }
}
