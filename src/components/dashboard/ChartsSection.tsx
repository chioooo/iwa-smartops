import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { name: "Ene", ingresos: 24500, gastos: 18200 },
  { name: "Feb", ingresos: 28900, gastos: 19800 },
  { name: "Mar", ingresos: 32400, gastos: 21500 },
  { name: "Abr", ingresos: 29800, gastos: 20100 },
  { name: "May", ingresos: 38200, gastos: 22400 },
  { name: "Jun", ingresos: 45280, gastos: 24800 },
];

const servicesData = [
  { name: "Lun", servicios: 12 },
  { name: "Mar", servicios: 19 },
  { name: "Mié", servicios: 15 },
  { name: "Jue", servicios: 22 },
  { name: "Vie", servicios: 28 },
  { name: "Sáb", servicios: 18 },
  { name: "Dom", servicios: 8 },
];

export function ChartsSection() {
  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-900 text-lg mb-1">Ingresos vs Gastos</h3>
            <p className="text-sm text-gray-600">Análisis de los últimos 6 meses</p>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D0323A]">
            <option>Últimos 6 meses</option>
            <option>Último año</option>
            <option>Todo el tiempo</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="ingresos" fill="url(#colorIngresos)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="gastos" fill="#9ca3af" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D0323A" />
                <stop offset="100%" stopColor="#E9540D" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Services Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-gray-900 text-lg mb-1">Servicios de la Semana</h3>
          <p className="text-sm text-gray-600">Tendencia de servicios completados</p>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={servicesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="servicios"
              stroke="#D0323A"
              strokeWidth={3}
              dot={{ fill: "#D0323A", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
