export type InventoryAIOption = 'inventory' | 'lowStock' | 'highMargin' | 'unsold' | 'noMovement';

export type InventoryAIResponse = {
  title: string;
  intro: string;
  bullets: string[];
};

function getFormattedDate(): string {
  return new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getRiskLabel(lowStock: number, totalProducts: number): string {
  if (totalProducts === 0 || lowStock === 0) return 'muy bajo';

  const ratio = lowStock / totalProducts;

  if (ratio < 0.1) return 'bajo';
  if (ratio < 0.25) return 'moderado';
  return 'alto';
}

export function buildInventoryAIResponse(
  option: InventoryAIOption,
  params: {
    totalProducts: number;
    totalStock: number;
    lowStock: number;
  },
): InventoryAIResponse {
  const { totalProducts, totalStock, lowStock } = params;
  const fecha = getFormattedDate();

  const averageStock = totalProducts > 0 ? totalStock / totalProducts : 0;
  const lowStockRatio = totalProducts > 0 ? (lowStock / totalProducts) * 100 : 0;
  const riskLabel = getRiskLabel(lowStock, totalProducts);

  if (option === 'inventory') {
    return {
      title: 'Análisis General de Inventario',
      intro:
        `He analizado tu inventario con la información más reciente disponible (hasta ${fecha}).\n\n` +
        `📊 Resumen general\n` +
        `• Total de productos analizados: ${totalProducts}\n` +
        `• Unidades totales en stock: ${totalStock}\n` +
        `• Promedio de unidades por producto: ${averageStock.toFixed(1)}\n` +
        `• Productos en riesgo de quiebre: ${lowStock} (${lowStockRatio.toFixed(1)}% del catálogo)\n` +
        `• Nivel de riesgo de quiebre de stock: ${riskLabel.toUpperCase()}\n\n` +
        `🧠 Interpretación rápida\n` +
        (lowStock === 0
          ? 'Actualmente no detecto productos en riesgo inmediato de agotarse. Es un buen momento para revisar márgenes, rotación y oportunidades de optimización.'
          : 'Existen productos que podrían agotarse si la demanda se mantiene estable. Es importante priorizar su reposición para no afectar la operación.'),
      bullets: [
        `Prioriza una revisión manual de los productos en riesgo de quiebre (actualmente ${lowStock}). Concéntrate primero en los de mayor rotación o utilidad.`,
        'Revisa si el stock mínimo configurado para tus productos críticos sigue siendo adecuado con el comportamiento de ventas actual.',
        'Programa revisiones de inventario recurrentes (semanales o quincenales) para anticiparte a quiebres y sobrestock, en lugar de reaccionar cuando el problema ya es visible.',
      ],
    };
  }

  if (option === 'lowStock') {
    return {
      title: 'Alerta de Stock Bajo',
      intro:
        `He revisado tu inventario con corte al ${fecha}.\n\n` +
        `Productos con stock bajo\n` +
        (lowStock === 0
          ? 'Actualmente no hay productos por debajo del stock mínimo configurado. Puedes aprovechar para revisar márgenes, rotación y categorías con poco movimiento.\n\n'
          : `Identifiqué ${lowStock} producto(s) con riesgo de quedarse sin inventario en los próximos días, lo que representa aproximadamente el ${lowStockRatio.toFixed(1)}% de tu catálogo.\n\n`) +
        `Sugerencias de reabastecimiento`,
      bullets: [
        lowStock === 0
          ? 'Mantén esta buena práctica revisando al menos una vez por semana los productos críticos para anticiparte a cambios en la demanda.'
          : 'Prioriza la reposición de los productos con mayor impacto en tus operaciones (alta rotación o alta utilidad) dentro del grupo de stock bajo.',
        'Valida que los niveles de stock mínimo y máximo sigan alineados con la demanda real de los últimos meses.',
        'Configura alertas internas o revisiones periódicas para no depender únicamente de revisiones manuales esporádicas.',
        'Si esperas un incremento de demanda (promociones, temporada alta), considera un escenario de reposición más conservador para evitar quiebres recurrentes.',
      ],
    };
  }

  if (option === 'highMargin') {
    return {
      title: 'Productos con Mayor Utilidad',
      intro:
        `He analizado la información de márgenes de tu catálogo con corte al ${fecha}.\n\n` +
        `Productos con mejor margen de contribución\n` +
        `Estos productos son candidatos ideales para impulsar tu rentabilidad siempre que se mantengan disponibles y visibles para tus clientes.\n\n` +
        `Estrategias sugeridas`,
      bullets: [
        'Crea bundles o paquetes que combinen estos productos de alta utilidad con productos de alta rotación para aumentar el ticket promedio.',
        'Destaca estos productos en tu catálogo digital, comunicados internos o material promocional para asegurar que el equipo comercial los priorice.',
        'Monitorea periódicamente el costo de reposición para asegurar que el margen real se mantenga dentro del rango esperado.',
        'Evalúa incrementos graduales de precio cuando la demanda sea estable y el mercado lo permita, cuidando no afectar la percepción de valor del cliente.',
      ],
    };
  }

  if (option === 'unsold') {
    return {
      title: 'Productos con Baja o Nula Rotación',
      intro:
        `He revisado el historial de movimientos de inventario con información disponible hasta ${fecha}.\n\n` +
        `Productos sin ventas recientes\n` +
        `Detecté productos con una rotación muy baja o nula en el periodo analizado, lo que implica capital inmovilizado y uso de espacio en almacén.\n\n` +
        `Recomendaciones para reducir inventario inmovilizado`,
      bullets: [
        'Revisa si el precio, la descripción o la forma en que se muestran estos productos puede estar afectando su atractivo para el usuario final.',
        'Considera promociones específicas, descuentos controlados o paquetes combinados para acelerar su salida sin afectar la percepción de valor de tu catálogo.',
        'Si el producto es obsoleto o ya no tiene demanda real, evalúa liquidaciones, devoluciones a proveedor o donaciones para liberar espacio y capital.',
        'Analiza si estos productos deberían seguir en tu catálogo activo o si conviene descontinuarlos para simplificar la operación.',
      ],
    };
  }

  // noMovement
  return {
    title: 'Estrategias para Productos Sin Movimiento',
    intro:
      `He analizado los productos sin actividad reciente con información disponible hasta ${fecha}.\n\n` +
      `🔄 Productos que requieren reactivación\n` +
      `Estos productos llevan tiempo sin movimiento y representan capital inmovilizado que podría estar generando valor en otras áreas.\n\n` +
      `🚀 Acciones tácticas recomendadas`,
    bullets: [
      'Combínalos en promociones cruzadas con productos de alta demanda para incentivar su salida (por ejemplo, "compra X y lleva Y con descuento").',
      'Utilízalos como incentivos en campañas de fidelización o como regalos en compras mayores a cierto monto.',
      'Evalúa si vale la pena mantenerlos en catálogo activo o si conviene reasignar el espacio de inventario a referencias con mejor desempeño.',
      'Programa una revisión de inventario en los próximos 7-14 días para medir el impacto de las acciones tomadas y ajustar la estrategia.',
    ],
  };
}
