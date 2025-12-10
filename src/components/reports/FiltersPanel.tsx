import { useState } from 'react';
import { X, Filter, Calendar, Building2, Package, User, Users, Trash2 } from 'lucide-react';
import type {ReportFilters} from './ReportsScreen';

type Props = {
  filters: ReportFilters;
  onClose: () => void;
  onApply: (filters: ReportFilters) => void;
};

export function FiltersPanel({ filters, onClose, onApply }: Props) {
  const [localFilters, setLocalFilters] = useState<ReportFilters>(filters);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: ReportFilters = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };
    setLocalFilters(clearedFilters);
  };

  const activeFiltersCount = Object.values(localFilters).filter(v => v !== undefined && v !== '').length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white">Filtros Avanzados</h2>
                {activeFiltersCount > 0 && (
                  <p className="text-white/90 text-sm">{activeFiltersCount} filtros activos</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Rango de Fechas */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-900">Rango de Fechas</label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Fecha inicio</label>
                  <input
                    type="date"
                    value={localFilters.startDate}
                    onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Fecha fin</label>
                  <input
                    type="date"
                    value={localFilters.endDate}
                    onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Date Filters */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    setLocalFilters({
                      ...localFilters,
                      startDate: today.toISOString().split('T')[0],
                      endDate: today.toISOString().split('T')[0]
                    });
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hoy
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    setLocalFilters({
                      ...localFilters,
                      startDate: firstDay.toISOString().split('T')[0],
                      endDate: today.toISOString().split('T')[0]
                    });
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Este mes
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
                    setLocalFilters({
                      ...localFilters,
                      startDate: lastMonth.toISOString().split('T')[0],
                      endDate: lastDay.toISOString().split('T')[0]
                    });
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Mes pasado
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), 0, 1);
                    setLocalFilters({
                      ...localFilters,
                      startDate: firstDay.toISOString().split('T')[0],
                      endDate: today.toISOString().split('T')[0]
                    });
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Este año
                </button>
              </div>
            </div>

            {/* Sucursal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-900">Sucursal / Almacén</label>
              </div>
              <select
                value={localFilters.branch || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, branch: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="">Todas las sucursales</option>
                <option value="Principal">Almacén Principal</option>
                <option value="Secundario">Almacén Secundario</option>
                <option value="Norte">Sucursal Norte</option>
                <option value="Sur">Sucursal Sur</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-900">Categoría</label>
              </div>
              <select
                value={localFilters.category || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="">Todas las categorías</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Papelería">Papelería</option>
                <option value="Consumibles">Consumibles</option>
              </select>
            </div>

            {/* Usuario */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-900">Usuario / Operador</label>
              </div>
              <select
                value={localFilters.user || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, user: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="">Todos los usuarios</option>
                <option value="Juan Pérez">Juan Pérez</option>
                <option value="María González">María González</option>
                <option value="Carlos Ruiz">Carlos Ruiz</option>
                <option value="Ana Martínez">Ana Martínez</option>
              </select>
            </div>

            {/* Cliente */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-gray-400" />
                <label className="text-sm text-gray-900">Cliente</label>
              </div>
              <select
                value={localFilters.client || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, client: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="">Todos los clientes</option>
                <option value="Acme Corporation">Acme Corporation S.A. de C.V.</option>
                <option value="TechSolutions">TechSolutions México</option>
                <option value="Distribuidora">Distribuidora Nacional</option>
                <option value="GlobalTech">GlobalTech Industries</option>
              </select>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm text-blue-900">Filtros activos ({activeFiltersCount})</h4>
                  <button
                    onClick={handleClear}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Limpiar todo
                  </button>
                </div>
                <div className="space-y-2">
                  {localFilters.startDate && localFilters.endDate && (
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(localFilters.startDate).toLocaleDateString('es-MX')} - {new Date(localFilters.endDate).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  )}
                  {localFilters.branch && (
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Building2 className="w-3 h-3" />
                      <span>{localFilters.branch}</span>
                    </div>
                  )}
                  {localFilters.category && (
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Package className="w-3 h-3" />
                      <span>{localFilters.category}</span>
                    </div>
                  )}
                  {localFilters.user && (
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <User className="w-3 h-3" />
                      <span>{localFilters.user}</span>
                    </div>
                  )}
                  {localFilters.client && (
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Users className="w-3 h-3" />
                      <span>{localFilters.client}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 space-y-2">
          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Aplicar Filtros
          </button>
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
