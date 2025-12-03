import { 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Warehouse,
  Tag
} from 'lucide-react';
import type { Product, FinancialSummary } from './FinancesScreen';

interface InventoryValuationProps {
  products: Product[];
  summary: FinancialSummary;
}

export function InventoryValuation({ products, summary }: InventoryValuationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  // Ordenar productos por valor total (precio * stock)
  const sortedByValue = [...products].sort((a, b) => (b.price * b.stock) - (a.price * a.stock));
  
  // Agrupar por almacén
  const warehouseData = products.reduce((acc, p) => {
    const warehouse = p.warehouse || 'Sin asignar';
    if (!acc[warehouse]) {
      acc[warehouse] = { value: 0, cost: 0, items: 0 };
    }
    acc[warehouse].value += p.price * p.stock;
    acc[warehouse].cost += p.purchasePrice * p.stock;
    acc[warehouse].items += p.stock;
    return acc;
  }, {} as Record<string, { value: number; cost: number; items: number }>);

  // Agrupar por proveedor
  const supplierData = products.reduce((acc, p) => {
    if (!acc[p.supplier]) {
      acc[p.supplier] = { value: 0, cost: 0, products: 0 };
    }
    acc[p.supplier].value += p.price * p.stock;
    acc[p.supplier].cost += p.purchasePrice * p.stock;
    acc[p.supplier].products += 1;
    return acc;
  }, {} as Record<string, { value: number; cost: number; products: number }>);

  return (
    <div className="space-y-6">
      {/* Resumen de valoración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Unidades</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Promedio/Unidad</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalInventoryValue / products.reduce((sum, p) => sum + p.stock, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Productos Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'active').length} / {products.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de valoración detallada */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Valoración Detallada por Producto</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SKU</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Precio Compra</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Precio Venta</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Costo Total</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Valor Total</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Margen</th>
              </tr>
            </thead>
            <tbody>
              {sortedByValue.map((product) => {
                const totalCost = product.purchasePrice * product.stock;
                const totalValue = product.price * product.stock;
                const margin = ((product.price - product.purchasePrice) / product.purchasePrice) * 100;
                
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                          {product.image}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                      <span className="text-gray-400 text-sm"> {product.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(product.purchasePrice)}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(totalCost)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">{formatCurrency(totalValue)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {margin >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {margin.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valoración por Almacén y Proveedor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Almacén */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Warehouse className="w-5 h-5 text-[#D0323A]" />
            <h3 className="text-lg font-semibold text-gray-900">Valoración por Almacén</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(warehouseData).map(([warehouse, data]) => (
              <div key={warehouse} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{warehouse}</span>
                  <span className="text-sm text-gray-500">{data.items} unidades</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Costo</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(data.cost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valor</p>
                    <p className="font-semibold text-green-600">{formatCurrency(data.value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Proveedor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#D0323A]" />
            <h3 className="text-lg font-semibold text-gray-900">Valoración por Proveedor</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(supplierData)
              .sort((a, b) => b[1].value - a[1].value)
              .map(([supplier, data]) => (
              <div key={supplier} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{supplier}</span>
                  <span className="text-sm text-gray-500">{data.products} productos</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Costo</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(data.cost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valor</p>
                    <p className="font-semibold text-green-600">{formatCurrency(data.value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
