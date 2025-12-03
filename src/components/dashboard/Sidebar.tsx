import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  BarChart3,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logoImage from "../../assets/logo.png";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: "Inicio" },
  { id: 'users', icon: Users, label: "Usuarios" },
  { id: 'inventory', icon: Package, label: "Inventario" },
  { id: 'billing', icon: FileText, label: "Facturación" },
  { id: 'reports', icon: BarChart3, label: "Reportes" },
  { id: 'finances', icon: Wallet, label: "Finanzas" },
  { id: 'settings', icon: Settings, label: "Configuración" },
];

export function Sidebar({ isOpen, onToggle, activeSection, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
        {isOpen ? (
          <img src={logoImage} alt="iWA SmartOps" className="h-10" />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-[#D0323A] to-[#E9540D] rounded-lg"></div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="py-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white shadow-lg shadow-[#D0323A]/20"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isOpen ? "" : "mx-auto"}`} />
                {isOpen && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#D0323A] hover:border-[#D0323A] transition-colors shadow-sm"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="bg-gradient-to-br from-[#D0323A]/10 to-[#E9540D]/10 rounded-xl p-4 border border-[#D0323A]/20">
            <p className="text-xs text-gray-600 mb-1">¿Necesitas ayuda?</p>
            <a href="#" className="text-sm text-[#D0323A] hover:text-[#9F2743] transition-colors">
              Centro de soporte →
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
