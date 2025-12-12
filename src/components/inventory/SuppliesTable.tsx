import { useState } from 'react';
import { Search, Edit2, Package, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { Supply } from '../../services/inventory/inventory.types';

type Props = {
  supplies: Supply[];
  onCreateSupply: (supplyData: Omit<Supply, 'id'>) => void;
  onEditSupply: (supply: Supply) => void;
  onDeleteSupply: (supplyId: string) => void;
};

export function SuppliesTable({ supplies, onEditSupply, onDeleteSupply }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrado
  const filteredSupplies = supplies.filter(supply =>
    supply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supply.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSupplies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSupplies = filteredSupplies.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#F6A016] to-[#E9540D] rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">{supplies.length}</p>
              <p className="text-sm text-gray-600">Total de Insumos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">
                {supplies.reduce((sum, s) => sum + s.stock, 0)}
              </p>
              <p className="text-sm text-gray-600">Unidades Totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">
                {supplies.filter(s => s.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Insumos Activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar insumos por nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Insumo</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Unidad</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Stock</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Categoría</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Proveedor</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Estado</th>
                <th className="text-right px-6 py-4 text-gray-700 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentSupplies.map((supply) => (
                <tr
                  key={supply.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Insumo */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F6A016] to-[#E9540D] flex items-center justify-center text-white text-sm">
                        {supply.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <span className="text-gray-900">{supply.name}</span>
                    </div>
                  </td>

                  {/* Unidad */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{supply.unit}</span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {supply.stock}
                    </span>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {supply.category}
                    </span>
                  </td>

                  {/* Proveedor */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{supply.supplier}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        supply.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        supply.status === 'active' ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {supply.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditSupply(supply)}
                        className="p-2 text-gray-600 hover:text-[#F6A016] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar el insumo "${supply.name}"?`)) {
                            onDeleteSupply(supply.id);
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredSupplies.length)} de {filteredSupplies.length} insumos
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-[#D0323A] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredSupplies.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No se encontraron insumos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Gestión de Insumos</h3>
            <p className="text-sm text-gray-700 mb-3">
              Los insumos son materiales consumibles necesarios para las operaciones diarias.
              A diferencia de los productos, estos no se venden directamente sino que se utilizan
              en la prestación de servicios.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Consumibles
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Materiales
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Suministros
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
