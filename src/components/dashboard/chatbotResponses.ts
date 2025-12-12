import type { ChatAction } from '../../contexts/ChatbotContext';

// Tipo de respuesta con texto y acción opcional
export type ChatResponse = {
  text: string;
  action?: ChatAction;
};

type ResponseCategory = {
  keywords: string[];
  responses: ((data?: Record<string, unknown>) => ChatResponse)[];
};

type InventoryProduct = {
  stock: number;
  minStock: number;
  price: number;
};

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const STORAGE_KEY_PRODUCTS = 'inventory_products';

// Funciones para obtener datos dinámicos
const getInventoryData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (stored) {
      const products: InventoryProduct[] = JSON.parse(stored);
      const lowStock = products.filter((p) => p.stock <= p.minStock);
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
      return { total: products.length, lowStock: lowStock.length, totalValue };
    }
  } catch { }
  return { total: 5, lowStock: 3, totalValue: 25899.77 };
};

const getClientsData = () => {
  try {
    const stored = localStorage.getItem('clients');
    if (stored) {
      const clients = JSON.parse(stored);
      return { total: clients.length, active: clients.filter((c: { status: string }) => c.status === 'active').length };
    }
  } catch { }
  return { total: 892, active: 756 };
};

const getInvoicesData = () => {
  try {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      const invoices = JSON.parse(stored);
      const pending = invoices.filter((i: { status: string }) => i.status === 'pending');
      return { total: invoices.length, pending: pending.length };
    }
  } catch { }
  return { total: 156, pending: 23 };
};

const responseCatalog: Record<string, ResponseCategory> = {
  // === ACCIONES (con navegación/trigger) ===
  crearFactura: {
    keywords: ['crear factura', 'nueva factura', 'generar factura', 'si, deseo crear', 'sí, deseo crear', 'quiero crear una factura'],
    responses: [
      () => ({ text: '¡Perfecto! Te llevo al módulo de facturación.', action: { type: 'trigger', section: 'billing', elementId: 'btn-nueva-factura', triggerAction: 'openCreateInvoice' } }),
      () => ({ text: 'Claro, vamos a crear una nueva factura.', action: { type: 'trigger', section: 'billing', elementId: 'btn-nueva-factura', triggerAction: 'openCreateInvoice' } }),
    ],
  },
  crearProducto: {
    keywords: ['crear un producto', 'nuevo producto', 'agregar un producto', 'añadir un producto', 'registrar un producto', 'crear producto'],
    responses: [
      () => ({ text: '¡Perfecto! Te llevo al inventario para crear un nuevo producto.', action: { type: 'trigger', section: 'inventory', elementId: 'btn-nuevo-producto', triggerAction: 'openCreateProduct' } }),
      () => ({ text: 'Claro, vamos a agregar un nuevo producto.', action: { type: 'trigger', section: 'inventory', elementId: 'btn-nuevo-producto', triggerAction: 'openCreateProduct' } }),
    ],
  },
  verFinanzas: {
    keywords: ['llevame a finanzas', 'ir a finanzas', 'llevar a finanzas', 'muestrame las finanzas'],
    responses: [
      () => ({ text: 'Te llevo al módulo de finanzas.', action: { type: 'navigate', section: 'finances' } }),
    ],
  },
  verInventario: {
    keywords: ['ver inventario', 'mostrar inventario', 'ir a inventario', 'llevar a inventario'],
    responses: [
      () => ({ text: 'Te llevo a la sección de inventario.', action: { type: 'navigate', section: 'inventory' } }),
    ],
  },
  // === CONSULTAS (solo texto) ===
  inventario: {
    keywords: ['inventario', 'stock', 'producto', 'productos', 'almacén', 'almacen'],
    responses: [
      () => {
        const data = getInventoryData();
        return { text: `Actualmente tienes ${data.total} productos en inventario con un valor total de $${data.totalValue.toLocaleString()}. ${data.lowStock > 0 ? `Hay ${data.lowStock} productos con stock bajo que requieren atención.` : '¡Todo el stock está en niveles óptimos!'} ¿Necesitas más detalles?` };
      },
      () => {
        const data = getInventoryData();
        return { text: `El inventario muestra ${data.lowStock} productos con stock bajo. Te recomiendo revisar la sección de Inventario para realizar pedidos. ¿Quieres que te muestre los detalles?` };
      },
      () => {
        const data = getInventoryData();
        return { text: `He revisado el inventario: ${data.total} productos registrados, valorados en $${data.totalValue.toLocaleString()}. ${data.lowStock > 0 ? `⚠️ Atención: ${data.lowStock} artículos necesitan reabastecimiento.` : ''} ¿Te ayudo con algo específico?` };
      },
    ],
  },

  facturacion: {
    keywords: ['factura', 'facturación', 'facturacion', 'cobro', 'cobrar'],
    responses: [
      () => {
        const data = getInvoicesData();
        return { text: `Puedo ayudarte con la facturación. Actualmente tienes ${data.total} facturas generadas este mes. ¿Deseas crear una nueva factura, ver las pendientes o exportar un reporte?` };
      },
      () => {
        const data = getInvoicesData();
        return { text: `En facturación: ${data.total} facturas emitidas, de las cuales ${data.pending} están pendientes de pago. ¿Qué acción deseas realizar?` };
      },
      () => {
        const data = getInvoicesData();
        return { text: `He consultado el módulo de facturación. Tienes ${data.pending} facturas pendientes de un total de ${data.total}. ¿Necesitas crear una nueva o dar seguimiento a alguna existente?` };
      },
    ],
  },

  clientes: {
    keywords: ['cliente', 'clientes', 'contacto', 'contactos', 'empresa', 'empresas'],
    responses: [
      () => {
        const data = getClientsData();
        return { text: `Tienes ${data.total} clientes registrados, de los cuales ${data.active} están activos. ¿Necesitas buscar o agregar un cliente?` };
      },
      () => {
        const data = getClientsData();
        return { text: `La base de clientes cuenta con ${data.total} registros. ${data.active} clientes están marcados como activos. ¿En qué puedo ayudarte?` };
      },
      () => {
        const data = getClientsData();
        return { text: `He revisado la información de clientes: ${data.active} activos de ${data.total} totales. ¿Deseas buscar un cliente específico o registrar uno nuevo?` };
      },
    ],
  },

  finanzas: {
    keywords: ['ingreso', 'ingresos', 'ventas', 'venta', 'dinero', 'ganancias', 'finanzas', 'financiero'],
    responses: [
      () => ({ text: `Los ingresos del mes actual son de $45,280, con un incremento del 8.5% respecto al mes anterior. ¿Deseas ver un análisis detallado o exportar un reporte financiero?` }),
      () => ({ text: `El resumen financiero muestra ventas por $45,280 este mes. El margen de ganancia promedio es del 25%. ¿Te gustaría ver el desglose por categoría?` }),
      () => ({ text: `He analizado las finanzas: ingresos de $45,280 (+8.5% vs mes anterior). La rentabilidad se mantiene estable. ¿Necesitas un reporte más detallado?` }),
    ],
  },

  reportes: {
    keywords: ['reporte', 'reportes', 'análisis', 'analisis', 'estadística', 'estadisticas', 'exportar'],
    responses: [
      () => ({ text: `Puedo generar reportes de ventas, inventario, clientes o finanzas. ¿Qué tipo de reporte necesitas?` }),
      () => ({ text: `Los reportes disponibles incluyen: ventas mensuales, estado de inventario, análisis de clientes y resumen financiero. ¿Cuál te interesa?` }),
      () => ({ text: `¿Qué reporte necesitas? Tengo disponibles: 📊 Ventas, 📦 Inventario, 👥 Clientes, 💰 Finanzas. Solo indícame cuál generar.` }),
    ],
  },

  saludo: {
    keywords: ['hola', 'hi', 'buenos', 'buenas', 'hey', 'saludos'],
    responses: [
      () => ({ text: `¡Hola! ¿En qué puedo asistirte hoy? Puedo ayudarte con facturación, inventario, clientes, reportes y más.` }),
      () => ({ text: `¡Bienvenido! Estoy aquí para ayudarte. ¿Qué necesitas consultar hoy?` }),
      () => ({ text: `¡Hola! Soy tu asistente SmartOps. Puedo ayudarte con inventario, facturación, clientes y reportes. ¿Por dónde empezamos?` }),
    ],
  },

  agradecimiento: {
    keywords: ['gracias', 'thank', 'genial', 'excelente', 'perfecto'],
    responses: [
      () => ({ text: `¡De nada! Estoy aquí para ayudarte cuando lo necesites. 😊` }),
      () => ({ text: `¡Con gusto! Si necesitas algo más, no dudes en preguntarme.` }),
      () => ({ text: `¡Para eso estoy! ¿Hay algo más en lo que pueda asistirte?` }),
    ],
  },

  ayuda: {
    keywords: ['ayuda', 'help', 'qué puedes', 'que puedes', 'funciones', 'opciones'],
    responses: [
      () => ({ text: `Puedo ayudarte con:\n• 📦 Inventario y stock\n• 🧾 Facturación\n• 👥 Gestión de clientes\n• 📊 Reportes y análisis\n• 💰 Información financiera\n\n¿Sobre qué tema necesitas información?` }),
      () => ({ text: `Mis funciones principales son: consultar inventario, gestionar facturas, buscar clientes y generar reportes. ¿Qué te gustaría hacer?` }),
      () => ({ text: `Estoy aquí para asistirte con el sistema SmartOps. Pregúntame sobre inventario, facturas, clientes o finanzas. ¿En qué te ayudo?` }),
    ],
  },
};

const defaultResponses = [
  () => ({ text: `Entiendo tu consulta. Puedo ayudarte con facturación, inventario, gestión de clientes, reportes financieros y análisis de datos. ¿Sobre cuál de estos temas necesitas información?` }),
  () => ({ text: `No estoy seguro de entender completamente. ¿Podrías especificar si tu consulta es sobre inventario, facturas, clientes o finanzas?` }),
  () => ({ text: `Hmm, déjame ayudarte mejor. ¿Tu pregunta está relacionada con: inventario, facturación, clientes o reportes?` }),
];

export const getAIResponse = (userInput: string): ChatResponse => {
  const input = userInput.toLowerCase();
  for (const category of Object.values(responseCatalog)) {
    if (category.keywords.some(k => input.includes(k))) {
      return pickRandom(category.responses)();
    }
  }
  return pickRandom(defaultResponses)();
};

export { responseCatalog, pickRandom };
