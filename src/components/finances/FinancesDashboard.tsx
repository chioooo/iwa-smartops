import { 
  TrendingUp, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Product, FinancialSummary } from './FinancesScreen';

interface FinancesDashboardProps {
  products: Product[];
  summary: FinancialSummary;
}

export function FinancesDashboard({ products, summary }: FinancesDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Datos para gráfico de pastel por categoría
  const pieData = summary.categoryBreakdown.map((cat, index) => ({
    name: cat.category,
    value: cat.totalValue,
    color: ['#D0323A', '#F6A016', '#E9540D', '#9F2743', '#2563eb'][index % 5]
  }));

  // Datos para gráfico de barras
  const barData = summary.categoryBreakdown.map(cat => ({
    name: cat.category,
    Costo: cat.totalCost,
    Valor: cat.totalValue,
    Ganancia: cat.profit
  }));

  const metrics = [
    {
      title: 'Valor Total Inventario',
      value: formatCurrency(summary.totalInventoryValue),
      icon: Wallet,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Costo Total Inventario',
      value: formatCurrency(summary.totalInventoryCost),
      icon: Package,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+8.2%',
      positive: true
    },
    {
      title: 'Ganancia Potencial',
      value: formatCurrency(summary.potentialProfit),
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+15.3%',
      positive: true
    },
    {
      title: 'Margen de Ganancia',
      value: `${summary.profitMargin.toFixed(1)}%`,
      icon: PiggyBank,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+2.1%',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Categoría */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparativa Costo vs Valor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Costo vs Valor por Categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="Costo" fill="#F6A016" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Valor" fill="#D0323A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alertas y Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos con bajo stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock} / Mín: {product.minStock}</p>
                  </div>
                  <span className="text-amber-600 text-sm font-medium">
                    {formatCurrency(product.price * product.stock)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Valor en riesgo: <span className="font-semibold text-amber-600">{formatCurrency(summary.lowStockValue)}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay productos con stock bajo</p>
          )}
        </div>

        {/* Resumen por categoría */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#D0323A]" />
            <h3 className="text-lg font-semibold text-gray-900">Resumen por Categoría</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Categoría</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Productos</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Costo</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Valor</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ganancia</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Margen</th>
                </tr>
              </thead>
              <tbody>
                {summary.categoryBreakdown.map((cat, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{cat.category}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{cat.itemCount}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(cat.totalCost)}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatCurrency(cat.totalValue)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(cat.profit)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cat.margin >= 30 ? 'bg-green-100 text-green-700' : 
                        cat.margin >= 20 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {cat.margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-gray-900">Total</td>
                  <td className="py-3 px-4 text-right text-gray-900">{products.length}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(summary.totalInventoryCost)}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(summary.totalInventoryValue)}</td>
                  <td className="py-3 px-4 text-right text-green-600">{formatCurrency(summary.potentialProfit)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {summary.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
