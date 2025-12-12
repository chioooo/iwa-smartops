//import React from 'react';
import { Package, Layers, Grid3x3, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Product, Supply, Category } from '../../services/inventory/inventory.types';

type Props = {
  products: Product[];
  supplies: Supply[];
  categories: Category[];
  lowStockCount: number;
  onViewProducts: () => void;
};

export function InventoryDashboard({ products, supplies, categories, lowStockCount, onViewProducts }: Props) {
  const totalProducts = products.length;
  const totalSupplies = supplies.length;
  const totalCategories = categories.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Productos con stock crítico
  const criticalStockProducts = products.filter(p => p.stock <= p.minStock);

  // Productos más vendidos (simulado)
  const topProducts = products.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{totalProducts}</p>
          <p className="text-sm text-gray-600">Total de Productos</p>
          <p className="text-xs text-gray-500 mt-2">{activeProducts} activos</p>
        </div>

        {/* Total Insumos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#F6A016] to-[#E9540D] rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{totalSupplies}</p>
          <p className="text-sm text-gray-600">Insumos Disponibles</p>
          <p className="text-xs text-gray-500 mt-2">3 categorías</p>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#E9540D] to-[#D0323A] rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-gray-900 mb-1">{totalCategories}</p>
          <p className="text-sm text-gray-600">Categorías</p>
          <p className="text-xs text-gray-500 mt-2">{totalStock} unidades totales</p>
        </div>

        {/* Stock Bajo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            {lowStockCount > 0 && (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Alerta
              </span>
            )}
          </div>
          <p className="text-3xl text-gray-900 mb-1">{lowStockCount}</p>
          <p className="text-sm text-gray-600">Stock Bajo</p>
          <button
            onClick={onViewProducts}
            className="text-xs text-[#D0323A] hover:text-[#9F2743] mt-2 underline"
          >
            Ver productos →
          </button>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Valor del Inventario */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Valor Total del Inventario</p>
              <p className="text-2xl text-gray-900">${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-600">Stock Total</p>
              <p className="text-lg text-gray-900">{totalStock}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Precio Promedio</p>
              <p className="text-lg text-gray-900">${(totalValue / totalStock).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Productos con Stock Crítico */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Productos con Stock Crítico</h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
              {criticalStockProducts.length} productos
            </span>
          </div>

          {criticalStockProducts.length > 0 ? (
            <div className="space-y-3">
              {criticalStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                      {product.image}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      {product.stock} / {product.minStock}
                    </p>
                    <p className="text-xs text-gray-500">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">No hay productos con stock crítico</p>
            </div>
          )}
        </div>
      </div>

      {/* Products by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Productos por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category.name);
            const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);

            return (
              <div
                key={category.id}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#D0323A] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="text-sm text-gray-900">{category.name}</p>
                </div>
                <p className="text-2xl text-gray-900 mb-1">{category.productsCount}</p>
                <p className="text-xs text-gray-600">{categoryStock} unidades en stock</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Productos Destacados</h3>
          <button
            onClick={onViewProducts}
            className="text-sm text-[#D0323A] hover:text-[#9F2743]"
          >
            Ver todos →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-[#D0323A] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg flex items-center justify-center text-white text-2xl mb-3">
                {product.image}
              </div>
              <p className="text-sm text-gray-900 mb-1 truncate">{product.name}</p>
              <p className="text-xs text-gray-600 mb-2">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#D0323A]">${product.price}</span>
                <span className="text-xs text-gray-500">{product.stock} unid.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
