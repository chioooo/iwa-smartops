import  { useState } from 'react';
import { Eye, Edit2, Settings, Power, MoreVertical, Search, Filter, ChevronLeft, ChevronRight, AlertTriangle, Trash2 } from 'lucide-react';
import type { Product, Category } from '../../services/inventory/inventory.types';

type Props = {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onOpenAdjustment: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  selectedProductId?: string;
};

export function ProductTable({
  products,
  categories,
  onSelectProduct,
  onEditProduct,
  onUpdateProduct,
  onOpenAdjustment,
  onDeleteProduct,
  selectedProductId
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Filtrado de productos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;

    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = product.stock <= product.minStock;
    } else if (filterStock === 'normal') {
      matchesStock = product.stock > product.minStock;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleToggleStatus = (product: Product) => {
    onUpdateProduct(product.id, {
      status: product.status === 'active' ? 'inactive' : 'active'
    });
    setOpenMenuId(null);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { color: 'text-red-600 bg-red-50', label: 'Sin stock', showAlert: true };
    } else if (product.stock <= product.minStock) {
      return { color: 'text-orange-600 bg-orange-50', label: 'Stock bajo', showAlert: true };
    }
    return { color: 'text-green-600 bg-green-50', label: 'Normal', showAlert: false };
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todo el stock</option>
            <option value="low">Stock bajo</option>
            <option value="normal">Stock normal</option>
          </select>
        </div>

        {/* Secondary Filters */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filtros:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Producto</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">SKU</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Categoría</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Stock</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Precio</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Almacén</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Estado</th>
                <th className="text-right px-6 py-4 text-gray-700 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => {
                const stockStatus = getStockStatus(product);

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedProductId === product.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Producto */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D0323A] to-[#9F2743] flex items-center justify-center text-white">
                          {product.image}
                        </div>
                        <div>
                          <p className="text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.unit}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-mono text-sm">{product.sku}</span>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {stockStatus.showAlert && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        <div>
                          <p className={`text-sm px-2 py-1 rounded ${stockStatus.color}`}>
                            {product.stock} unid.
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Mín: {product.minStock}</p>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4">
                      <p className="text-gray-900">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Compra: ${product.purchasePrice.toFixed(2)}</p>
                    </td>

                    {/* Almacén */}
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{product.warehouse}</span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          product.status === 'active' ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-2 text-gray-600 hover:text-[#F6A016] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenAdjustment(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ajuste de inventario"
                        >
                          <Settings className="w-4 h-4" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenuId === product.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => handleToggleStatus(product)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Power className="w-4 h-4" />
                                  {product.status === 'active' ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onDeleteProduct(product);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
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
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
