import { FileText, DollarSign, Clock, XCircle, TrendingUp, Calendar, Users } from 'lucide-react';
import type {Invoice} from './BillingScreen';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  todayInvoices: number;
  monthInvoices: number;
  totalBilled: number;
  pendingInvoices: number;
  cancelledInvoices: number;
  invoices: Invoice[];
  onCreateInvoice: () => void;
};

export function BillingDashboard({
  todayInvoices,
  monthInvoices,
  totalBilled,
  pendingInvoices,
  cancelledInvoices,
  invoices,
  onCreateInvoice
}: Props) {
  // Mock data para gráfico mensual
  const monthlyData = [
    { mes: 'Ene', total: 125000 },
    { mes: 'Feb', total: 158000 },
    { mes: 'Mar', total: 142000 },
    { mes: 'Abr', total: 189000 },
    { mes: 'May', total: 167000 },
    { mes: 'Jun', total: 195000 },
    { mes: 'Jul', total: 178000 },
    { mes: 'Ago', total: 205000 },
    { mes: 'Sep', total: 188000 },
    { mes: 'Oct', total: 215000 },
    { mes: 'Nov', total: totalBilled },
  ];

  // Últimos clientes facturados
  const recentClients = invoices
    .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime())
    .slice(0, 5)
    .map(inv => ({
      nombre: inv.cliente,
      rfc: inv.rfc,
      total: inv.total,
      fecha: inv.fechaEmision,
      estado: inv.estado
    }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Facturas emitidas hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Hoy
            </span>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{todayInvoices}</p>
          <p className="text-sm text-gray-600">Facturas Emitidas Hoy</p>
        </div>

        {/* Facturas del mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#F6A016] to-[#E9540D] rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Mes
            </span>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{monthInvoices}</p>
          <p className="text-sm text-gray-600">Facturas del Mes</p>
        </div>

        {/* Total facturado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +15%
            </span>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{formatCurrency(totalBilled)}</p>
          <p className="text-sm text-gray-600">Total Facturado</p>
        </div>

        {/* Facturas pendientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            {pendingInvoices > 0 && (
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Alerta
              </span>
            )}
          </div>
          <p className="text-3xl text-gray-900 mb-1">{pendingInvoices}</p>
          <p className="text-sm text-gray-600">Pendientes Timbrado</p>
        </div>

        {/* Facturas canceladas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{cancelledInvoices}</p>
          <p className="text-sm text-gray-600">Facturas Canceladas</p>
        </div>
      </div>

      {/* Chart and Recent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 mb-1">Facturación Mensual</h3>
              <p className="text-sm text-gray-600">Total facturado por mes</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+15% vs mes anterior</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar
                dataKey="total"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D0323A" />
                  <stop offset="100%" stopColor="#E9540D" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 mb-1">Últimos Clientes</h3>
              <p className="text-sm text-gray-600">Facturados recientemente</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentClients.map((client, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{client.nombre}</p>
                    <p className="text-xs text-gray-600">{client.rfc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ml-2 flex-shrink-0 ${
                    client.estado === 'vigente' ? 'bg-blue-50 text-blue-700' :
                    client.estado === 'pagada' ? 'bg-green-50 text-green-700' :
                    client.estado === 'pendiente_timbrado' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {client.estado === 'vigente' ? 'Vigente' :
                     client.estado === 'pagada' ? 'Pagada' :
                     client.estado === 'pendiente_timbrado' ? 'Pendiente' :
                     'Cancelada'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatDate(client.fecha)}</span>
                  <span className="text-sm text-[#D0323A]">{formatCurrency(client.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nueva Factura */}
        <button
          onClick={onCreateInvoice}
          className="bg-gradient-to-br from-[#D0323A] to-[#E9540D] rounded-xl p-8 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="p-3 bg-white/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-white mb-2">Nueva Factura</h3>
          <p className="text-white/90 text-sm">Crea una nueva factura CFDI (I/E/P)</p>
        </button>

        {/* Estadísticas */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Crecimiento</h3>
          <p className="text-sm text-gray-700 mb-3">
            Tu facturación ha crecido un <span className="text-blue-600">15%</span> este mes
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <span>Ver análisis completo →</span>
          </div>
        </div>

        {/* Recordatorio */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-8">
          <div className="p-3 bg-yellow-100 rounded-lg w-fit mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Pendientes</h3>
          <p className="text-sm text-gray-700 mb-3">
            Tienes <span className="text-yellow-600">{pendingInvoices} facturas</span> pendientes de timbrar
          </p>
          <button className="text-sm text-yellow-600 hover:text-yellow-700">
            Revisar pendientes →
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">Facturación Electrónica CFDI</h3>
            <p className="text-sm text-gray-700 mb-4">
              Cumple con todas las disposiciones del SAT para la emisión de Comprobantes Fiscales Digitales por Internet (CFDI).
              Genera facturas versión 4.0 con validación en tiempo real.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700">CFDI 4.0</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-700">Timbrado</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-700">Cancelación</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">Complementos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
