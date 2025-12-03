import { Clock, TrendingUp, FileText, Package, Users } from "lucide-react";

interface Activity {
  id: number;
  type: "invoice" | "service" | "customer" | "product";
  title: string;
  description: string;
  time: string;
  amount?: string;
  status?: "success" | "pending" | "warning";
}

const activities: Activity[] = [
  {
    id: 1,
    type: "invoice",
    title: "Factura #4521",
    description: "Cliente: Empresa ABC",
    time: "Hace 5 min",
    amount: "$2,450",
    status: "success",
  },
  {
    id: 2,
    type: "service",
    title: "Servicio completado",
    description: "Mantenimiento preventivo",
    time: "Hace 15 min",
    status: "success",
  },
  {
    id: 3,
    type: "customer",
    title: "Nuevo cliente",
    description: "Tech Solutions Inc.",
    time: "Hace 1 hora",
    status: "success",
  },
  {
    id: 4,
    type: "product",
    title: "Stock bajo",
    description: "Producto: Filtros industriales",
    time: "Hace 2 horas",
    status: "warning",
  },
  {
    id: 5,
    type: "invoice",
    title: "Factura #4520",
    description: "Cliente: Servicios XYZ",
    time: "Hace 3 horas",
    amount: "$1,280",
    status: "pending",
  },
];

const iconMap = {
  invoice: FileText,
  service: TrendingUp,
  customer: Users,
  product: Package,
};

const statusColors = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  warning: "bg-red-100 text-red-700",
};

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 text-lg mb-1">Actividad Reciente</h3>
          <p className="text-sm text-gray-600">Últimas operaciones del sistema</p>
        </div>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D0323A]/10 to-[#E9540D]/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#D0323A]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm text-gray-900">{activity.title}</h4>
                  {activity.amount && (
                    <span className="text-sm text-gray-900 whitespace-nowrap">
                      {activity.amount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  {activity.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        statusColors[activity.status]
                      }`}
                    >
                      {activity.status === "success"
                        ? "Completado"
                        : activity.status === "pending"
                        ? "Pendiente"
                        : "Alerta"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button className="w-full mt-4 py-2.5 text-sm text-[#D0323A] hover:text-white border border-[#D0323A] hover:bg-gradient-to-r hover:from-[#D0323A] hover:to-[#E9540D] rounded-lg transition-all">
        Ver todas las actividades
      </button>
    </div>
  );
}
