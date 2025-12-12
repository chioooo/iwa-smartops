//import React from 'react';
import { DollarSign, FileText, CheckCircle, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Props = {
  metrics: {
    salesToday: number;
    monthlySales: number;
    invoicesIssued: number;
    completedOrders: number;
    mostRequestedServices: Array<{ name: string; quantity: number }>;
    productRotation: Array<{ name: string; sales: number }>;
  };
  onCreateReport: () => void;
};

export function ReportsDashboard({ metrics, onCreateReport }: Props) {
  // Mock data para gráficos
  const salesByMonth = [
    { month: 'Ene', sales: 125000, expenses: 85000 },
    { month: 'Feb', sales: 158000, expenses: 92000 },
    { month: 'Mar', sales: 142000, expenses: 88000 },
    { month: 'Abr', sales: 189000, expenses: 95000 },
    { month: 'May', sales: 167000, expenses: 89000 },
    { month: 'Jun', sales: 195000, expenses: 98000 },
    { month: 'Jul', sales: 178000, expenses: 91000 },
    { month: 'Ago', sales: 205000, expenses: 102000 },
    { month: 'Sep', sales: 188000, expenses: 94000 },
    { month: 'Oct', sales: 215000, expenses: 105000 },
    { month: 'Nov', sales: metrics.monthlySales, expenses: 98000 },
  ];

  const bestSellingProducts = [
    { product: 'Laptop Dell XPS', quantity: 45 },
    { product: 'Monitor LG 27"', quantity: 38 },
    { product: 'Teclado Mecánico', quantity: 32 },
    { product: 'Mouse Inalámbrico', quantity: 28 },
    { product: 'Impresora HP', quantity: 25 },
  ];

  const categoryDistribution = [
    { name: 'Tecnología', value: 45, color: '#D0323A' },
    { name: 'Mobiliario', value: 25, color: '#F6A016' },
    { name: 'Papelería', value: 15, color: '#E9540D' },
    { name: 'Consumibles', value: 10, color: '#9F2743' },
    { name: 'Otros', value: 5, color: '#F9DC00' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas del día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +8.5%
            </span>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{formatCurrency(metrics.salesToday)}</p>
          <p className="text-sm text-gray-600">Ventas del Día</p>
        </div>

        {/* Ventas del mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#F6A016] to-[#E9540D] rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +15%
            </span>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{formatCurrency(metrics.monthlySales)}</p>
          <p className="text-sm text-gray-600">Ventas del Mes</p>
        </div>

        {/* Facturas emitidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.invoicesIssued}</p>
          <p className="text-sm text-gray-600">Facturas Emitidas</p>
        </div>

        {/* Órdenes completadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              98%
            </span>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.completedOrders}</p>
          <p className="text-sm text-gray-600">Órdenes Completadas</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ventas por Mes - Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 mb-1">Ingresos vs Egresos por Mes</h3>
              <p className="text-sm text-gray-600">Comparativa mensual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#D0323A"
                strokeWidth={3}
                dot={{ fill: '#D0323A', r: 4 }}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#6B7280"
                strokeWidth={3}
                dot={{ fill: '#6B7280', r: 4 }}
                name="Egresos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por Categorías - Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 mb-1">Por Categoría</h3>
              <p className="text-sm text-gray-600">Distribución de ventas</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-700">{cat.name}</span>
                </div>
                <span className="text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Most Sold - Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-900 mb-1">Productos Más Vendidos</h3>
            <p className="text-sm text-gray-600">Top 5 del mes actual</p>
          </div>
          <button
            onClick={onCreateReport}
            className="text-sm text-[#D0323A] hover:text-[#9F2743]"
          >
            Ver reporte completo →
          </button>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={bestSellingProducts}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="quantity"
              domain={[0, 'dataMax + 5']}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey="product"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              width={150}
            />
            <Tooltip
              formatter={(value) => [value, 'Unidades']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar
              dataKey="quantity"
              fill="url(#colorGradient)"
              radius={[0, 8, 8, 0]}
              barSize={22}
              maxBarSize={32}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D0323A" />
                <stop offset="100%" stopColor="#F6A016" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Services and Products Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios más solicitados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Servicios Más Solicitados</h3>
              <p className="text-sm text-gray-600">Top 3 del mes</p>
            </div>
          </div>
          <div className="space-y-3">
            {metrics.mostRequestedServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <span className="text-gray-900">{service.name}</span>
                </div>
                <span className="text-purple-600">{service.quantity} veces</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos con más rotación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Productos con Más Rotación</h3>
              <p className="text-sm text-gray-600">Top 3 del mes</p>
            </div>
          </div>
          <div className="space-y-3">
            {metrics.productRotation.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <span className="text-orange-600">{product.sales} ventas</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={onCreateReport}
          className="bg-gradient-to-br from-[#D0323A] to-[#E9540D] rounded-xl p-8 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="p-3 bg-white/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-white mb-2">Generar Reporte</h3>
          <p className="text-white/90 text-sm">Crea un reporte personalizado con filtros específicos</p>
        </button>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Tendencias</h3>
          <p className="text-sm text-gray-700 mb-3">
            Las ventas han aumentado un <span className="text-blue-600">15%</span> este mes
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8">
          <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Eficiencia</h3>
          <p className="text-sm text-gray-700 mb-3">
            Tasa de completación de <span className="text-green-600">98%</span> en órdenes
          </p>
        </div>
      </div>
    </div>
  );
}
