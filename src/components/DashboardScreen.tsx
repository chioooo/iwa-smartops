import { useState } from "react";
import { Sidebar } from "./dashboard/Sidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { MetricsGrid } from "./dashboard/MetricsGrid";
import { ChartsSection } from "./dashboard/ChartsSection";
import { RecentActivity } from "./dashboard/RecentActivity";
import { Chatbot, ChatbotButton } from "./dashboard/Chatbot";
import { UsersScreen } from "./users/UsersScreen";
import { InventoryScreen } from "./inventory/InventoryScreen";
import { BillingScreen } from "./billing/BillingScreen";
import { ReportsScreen } from "./reports/ReportsScreen";
import { FinancesScreen } from "./finances/FinancesScreen";

export function DashboardScreen({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <DashboardHeader onLogout={onLogout} />

        {/* Render content based on active section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Dashboard Content */}
            <main className="p-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-gray-900 text-3xl mb-2">
                  Bienvenido, Juan Pérez
                </h1>
                <p className="text-gray-600">
                  Aquí está el resumen de tus operaciones de hoy
                </p>
              </div>

              {/* Metrics Grid */}
              <MetricsGrid />

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Charts Section - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <ChartsSection />
                </div>

                {/* Recent Activity - Takes 1 column */}
                <div className="lg:col-span-1">
                  <RecentActivity />
                </div>
              </div>
            </main>
          </>
        )}

        {activeSection === 'users' && <UsersScreen />}

        {activeSection === 'inventory' && <InventoryScreen />}

        {activeSection === 'billing' && <BillingScreen />}

        {activeSection === 'reports' && <ReportsScreen />}

        {activeSection === 'finances' && <FinancesScreen />}

        {activeSection === 'settings' && (
          <div className="p-8">
            <h1 className="text-gray-900 text-3xl mb-2">Configuración</h1>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 bg-white py-4">
          <div className="px-8">
            <p className="text-center text-sm text-gray-600">
              Design & Development by IWA Consolti © 2025
            </p>
          </div>
        </footer>
      </div>

      {/* Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      {!chatbotOpen && <ChatbotButton onClick={() => setChatbotOpen(true)} hasNotification={true} />}
    </div>
  );
}
