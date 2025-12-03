import { Bell, Search, Settings, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Title */}
      <div className="flex-1">
        <h2 className="text-xl text-gray-900">iWA SmartOps Demo</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-8">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D0323A] rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-[#D0323A] to-[#E9540D] rounded-full flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm text-gray-900">Juan Pérez</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </button>
      </div>
    </header>
  );
}