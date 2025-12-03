import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  FileText,
  Users,
  Package,
  AlertCircle,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-600 text-sm mb-0.5">{title}</h3>
            <p className="text-gray-900 text-2xl">{value}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg flex-shrink-0 ${ 
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}

export function MetricsGrid() {
  const metrics = [
    {
      title: "Órdenes del Día",
      value: "24",
      change: 12,
      icon: ShoppingCart,
      color: "bg-gradient-to-br from-[#D0323A] to-[#E9540D]",
    },
    {
      title: "Ingresos del Mes",
      value: "$45,280",
      change: 8.5,
      icon: DollarSign,
      color: "bg-gradient-to-br from-[#E9540D] to-[#F6A016]",
    },
    {
      title: "Facturas Generadas",
      value: "156",
      change: 15,
      icon: FileText,
      color: "bg-gradient-to-br from-[#F6A016] to-[#F9DC00]",
    },
    {
      title: "Clientes Activos",
      value: "892",
      change: 5.3,
      icon: Users,
      color: "bg-gradient-to-br from-[#9F2743] to-[#D0323A]",
    },
    {
      title: "Servicios Recientes",
      value: "18",
      change: -3,
      icon: Package,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Stock Bajo",
      value: "7",
      change: -12,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}