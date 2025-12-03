import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import type { Product, FinancialSummary } from './FinancesScreen';

interface ProfitAnalysisProps {
  products: Product[];
  summary: FinancialSummary;
}

export function ProfitAnalysis({ products, summary }: ProfitAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  // Calcular rentabilidad por producto
  const productProfitability = products.map(p => {
    const margin = ((p.price - p.purchasePrice) / p.purchasePrice) * 100;
    const totalProfit = (p.price - p.purchasePrice) * p.stock;
    return {
      ...p,
      margin,
      totalProfit,
      profitPerUnit: p.price - p.purchasePrice
    };
  }).sort((a, b) => b.margin - a.margin);

  // Top productos más rentables
  const topProfitable = productProfitability.slice(0, 5);
  
  // Productos con menor margen
  const lowMargin = productProfitability.filter(p => p.margin < 30);

  // Datos para gráfico de márgenes
  const marginChartData = productProfitability.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Margen: p.margin,
    fullName: p.name
  }));

  // Datos simulados de tendencia mensual
  const trendData = [
    { mes: 'Jul', Ingresos: 28500, Costos: 19200, Ganancia: 9300 },
    { mes: 'Ago', Ingresos: 32100, Costos: 21500, Ganancia: 10600 },
    { mes: 'Sep', Ingresos: 29800, Costos: 20100, Ganancia: 9700 },
    { mes: 'Oct', Ingresos: 35200, Costos: 23400, Ganancia: 11800 },
    { mes: 'Nov', Ingresos: 38900, Costos: 25600, Ganancia: 13300 },
    { mes: 'Dic', Ingresos: summary.totalInventoryValue, Costos: summary.totalInventoryCost, Ganancia: summary.potentialProfit },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs de Rentabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Margen Promedio</p>
          <p className="text-2xl font-bold text-green-600">{summary.profitMargin.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Ganancia Potencial</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.potentialProfit)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Mejor Margen</p>
          <p className="text-2xl font-bold text-purple-600">
            {topProfitable[0]?.margin.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 truncate">{topProfitable[0]?.name}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Bajo Margen (&lt;30%)</p>
          <p className="text-2xl font-bold text-amber-600">{lowMargin.length}</p>
          <p className="text-xs text-gray-400">productos</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Rentabilidad */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Rentabilidad</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Ingresos" stroke="#D0323A" strokeWidth={2} dot={{ fill: '#D0323A' }} />
                <Line type="monotone" dataKey="Costos" stroke="#F6A016" strokeWidth={2} dot={{ fill: '#F6A016' }} />
                <Line type="monotone" dataKey="Ganancia" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Margen por Producto */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Margen por Producto</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginChartData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Margen']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar 
                  dataKey="Margen" 
                  fill="#D0323A" 
                  radius={[0, 4, 4, 0]}
                  background={{ fill: '#f3f4f6' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análisis Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Productos Rentables */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Top Productos Rentables</h3>
          </div>
          <div className="space-y-4">
            {topProfitable.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Ganancia/unidad: {formatCurrency(product.profitPerUnit)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{product.margin.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{formatCurrency(product.totalProfit)} total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos con Bajo Margen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Productos con Bajo Margen</h3>
          </div>
          {lowMargin.length > 0 ? (
            <div className="space-y-4">
              {lowMargin.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Compra: {formatCurrency(product.purchasePrice)} → Venta: {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">{product.margin.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">margen</p>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Recomendación:</strong> Considera ajustar los precios de venta o negociar mejores costos con proveedores para estos productos.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">¡Excelente! Todos los productos tienen un margen saludable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
