//import React from 'react';
import { DollarSign, FileText, CheckCircle, TrendingUp, Package, ShoppingCart, Download, FileSpreadsheet } from 'lucide-react';
import type {ReportFilters} from './ReportsScreen';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Props = {
  metrics: {
    ventasHoy: number;
    ventasMes: number;
    facturasEmitidas: number;
    ordenesCompletadas: number;
    serviciosMasSolicitados: Array<{ nombre: string; cantidad: number }>;
    productosRotacion: Array<{ nombre: string; ventas: number }>;
  };
  filters: ReportFilters;
  onCreateReport: () => void;
};

export function ReportsDashboard({ metrics, filters, onCreateReport }: Props) {
  // Mock data para gráficos
  const ventasPorMes = [
    { mes: 'Ene', ventas: 125000, egresos: 85000 },
    { mes: 'Feb', ventas: 158000, egresos: 92000 },
    { mes: 'Mar', ventas: 142000, egresos: 88000 },
    { mes: 'Abr', ventas: 189000, egresos: 95000 },
    { mes: 'May', ventas: 167000, egresos: 89000 },
    { mes: 'Jun', ventas: 195000, egresos: 98000 },
    { mes: 'Jul', ventas: 178000, egresos: 91000 },
    { mes: 'Ago', ventas: 205000, egresos: 102000 },
    { mes: 'Sep', ventas: 188000, egresos: 94000 },
    { mes: 'Oct', ventas: 215000, egresos: 105000 },
    { mes: 'Nov', ventas: metrics.ventasMes, egresos: 98000 },
  ];

  const productosMasVendidos = [
    { producto: 'Laptop Dell XPS', cantidad: 45 },
    { producto: 'Monitor LG 27"', cantidad: 38 },
    { producto: 'Teclado Mecánico', cantidad: 32 },
    { producto: 'Mouse Inalámbrico', cantidad: 28 },
    { producto: 'Impresora HP', cantidad: 25 },
  ];

  const distribucionCategorias = [
    { nombre: 'Tecnología', valor: 45, color: '#D0323A' },
    { nombre: 'Mobiliario', valor: 25, color: '#F6A016' },
    { nombre: 'Papelería', valor: 15, color: '#E9540D' },
    { nombre: 'Consumibles', valor: 10, color: '#9F2743' },
    { nombre: 'Otros', valor: 5, color: '#F9DC00' },
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
      {/* Active Filters Display */}
      {(filters.fechaInicio || filters.sucursal || filters.categoria) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-blue-900">Filtros activos:</span>
              {filters.fechaInicio && filters.fechaFin && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {new Date(filters.fechaInicio).toLocaleDateString('es-MX')} - {new Date(filters.fechaFin).toLocaleDateString('es-MX')}
                </span>
              )}
              {filters.sucursal && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filters.sucursal}
                </span>
              )}
              {filters.categoria && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filters.categoria}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

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
          <p className="text-2xl text-gray-900 mb-1">{formatCurrency(metrics.ventasHoy)}</p>
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
          <p className="text-2xl text-gray-900 mb-1">{formatCurrency(metrics.ventasMes)}</p>
          <p className="text-sm text-gray-600">Ventas del Mes</p>
        </div>

        {/* Facturas emitidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.facturasEmitidas}</p>
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
          <p className="text-2xl text-gray-900 mb-1">{metrics.ordenesCompletadas}</p>
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
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Descargar PDF">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Exportar Excel">
                <FileSpreadsheet className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mes"
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
                dataKey="ventas"
                stroke="#D0323A"
                strokeWidth={3}
                dot={{ fill: '#D0323A', r: 4 }}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="egresos"
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
                data={distribucionCategorias}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, valor }) => `${nombre} ${valor}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {distribucionCategorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {distribucionCategorias.map((cat) => (
              <div key={cat.nombre} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-700">{cat.nombre}</span>
                </div>
                <span className="text-gray-900">{cat.valor}%</span>
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosMasVendidos} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey="producto"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar
              dataKey="cantidad"
              fill="url(#colorGradient)"
              radius={[0, 8, 8, 0]}
              maxBarSize={40}
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
            {metrics.serviciosMasSolicitados.map((servicio, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <span className="text-gray-900">{servicio.nombre}</span>
                </div>
                <span className="text-purple-600">{servicio.cantidad} veces</span>
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
            {metrics.productosRotacion.map((producto, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <span className="text-gray-900">{producto.nombre}</span>
                </div>
                <span className="text-orange-600">{producto.ventas} ventas</span>
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
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Ver análisis detallado →
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8">
          <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Eficiencia</h3>
          <p className="text-sm text-gray-700 mb-3">
            Tasa de completación de <span className="text-green-600">98%</span> en órdenes
          </p>
          <button className="text-sm text-green-600 hover:text-green-700">
            Ver detalles →
          </button>
        </div>
      </div>
    </div>
  );
}
