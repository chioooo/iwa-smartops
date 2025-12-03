import express from 'express';
import cors from 'cors';
import { EmailClient } from '@azure/communication-email';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// === Configuración Microsoft (Azure) ===
const azureConnectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const azureSenderAddress = process.env.AZURE_SENDER_ADDRESS;
let azureClient = null;

if (azureConnectionString && azureSenderAddress) {
  azureClient = new EmailClient(azureConnectionString);
  console.log('✅ Microsoft (Azure) configurado');
}

// === Configuración Gmail (SMTP) ===
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
let gmailTransporter = null;

if (gmailEmail && gmailAppPassword) {
  gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailAppPassword
    }
  });
  console.log('✅ Gmail configurado');
}

// Verificar que al menos uno esté configurado
if (!azureClient && !gmailTransporter) {
  console.error('❌ No hay ningún proveedor de correo configurado');
  process.exit(1);
}

// === Función para enviar con Microsoft (Azure) ===
async function sendWithMicrosoft(to, subject, body, attachments) {
  const message = {
    senderAddress: azureSenderAddress,
    recipients: { to: [{ address: to }] },
    content: { subject, html: body }
  };

  if (attachments?.length > 0) {
    message.attachments = attachments.map(att => ({
      name: att.name,
      contentType: att.contentType,
      contentInBase64: att.content
    }));
  }

  const poller = await azureClient.beginSend(message);
  const result = await poller.pollUntilDone();
  return result.id;
}

// === Función para enviar con Gmail ===
async function sendWithGmail(to, subject, body, attachments) {
  const mailOptions = {
    from: gmailEmail,
    to,
    subject,
    html: body
  };

  if (attachments?.length > 0) {
    mailOptions.attachments = attachments.map(att => ({
      filename: att.name,
      content: att.content,
      encoding: 'base64',
      contentType: att.contentType
    }));
  }

  const result = await gmailTransporter.sendMail(mailOptions);
  return result.messageId;
}

// === Endpoint principal ===
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body, attachments, provider } = req.body;

  // Validación
  if (!to || !subject || !body) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan campos requeridos: to, subject, body' 
    });
  }

  // Validar proveedor
  if (!provider || !['gmail', 'microsoft'].includes(provider)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Proveedor inválido. Usa "gmail" o "microsoft"' 
    });
  }

  // Verificar disponibilidad del proveedor
  if (provider === 'gmail' && !gmailTransporter) {
    return res.status(400).json({ success: false, error: 'Gmail no está configurado' });
  }
  if (provider === 'microsoft' && !azureClient) {
    return res.status(400).json({ success: false, error: 'Microsoft no está configurado' });
  }

  try {
    console.log(`📧 Enviando correo via ${provider.toUpperCase()} a: ${to}`);
    
    let messageId;
    if (provider === 'gmail') {
      messageId = await sendWithGmail(to, subject, body, attachments);
    } else {
      messageId = await sendWithMicrosoft(to, subject, body, attachments);
    }

    console.log(`✅ Correo enviado. ID: ${messageId}`);
    res.json({ success: true, messageId });
  } catch (error) {
    console.error('❌ Error enviando correo:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para obtener proveedores disponibles
app.get('/api/email-providers', (req, res) => {
  const providers = [];
  if (gmailTransporter) providers.push({ id: 'gmail', name: 'Gmail', email: gmailEmail });
  if (azureClient) providers.push({ id: 'microsoft', name: 'Microsoft', email: azureSenderAddress });
  res.json({ providers });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'email' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});
