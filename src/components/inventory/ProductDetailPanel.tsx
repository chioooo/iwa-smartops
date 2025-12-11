import { X, Package, DollarSign, Warehouse, Calendar, TrendingUp, TrendingDown, Edit2, AlertTriangle } from 'lucide-react';
import type {Product, InventoryMovement} from './InventoryScreen';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

type Props = {
  product: Product;
  movements: InventoryMovement[];
  onClose: () => void;
  onEdit: () => void;
};

export function ProductDetailPanel({ product, movements, onClose, onEdit }: Props) {
  useModalScrollLock();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entry':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'exit':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'adjustment':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'transfer':
        return <Warehouse className="w-4 h-4 text-purple-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entry: 'Entrada',
      exit: 'Salida',
      adjustment: 'Ajuste',
      transfer: 'Transferencia'
    };
    return labels[type] || type;
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'entry':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'exit':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'adjustment':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'transfer':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const stockStatus = product.stock <= product.minStock;
  const profitMargin = ((product.price - product.purchasePrice) / product.purchasePrice * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">Detalle del Producto</h2>
              <p className="text-white/90 text-sm">
                Información completa y movimientos del producto
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-xl flex items-center justify-center text-white text-xl">
              {product.image}
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.sku} • {product.category}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className={`text-xs ${
                  product.status === 'active' ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {product.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stock Status Alert */}
            {stockStatus && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-900 mb-1">Stock bajo</p>
                    <p className="text-xs text-red-700">
                      El stock actual está por debajo del mínimo recomendado
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Info */}
            <div>
              <h3 className="text-gray-900 text-sm mb-3">Información de Stock</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700 mb-1">Stock Actual</p>
                  <p className="text-2xl text-gray-900">{product.stock}</p>
                  <p className="text-xs text-gray-600 mt-1">{product.unit}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700 mb-1">Stock Mínimo</p>
                  <p className="text-2xl text-gray-900">{product.minStock}</p>
                  <p className="text-xs text-gray-600 mt-1">{product.unit}</p>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div>
              <h3 className="text-gray-900 text-sm mb-3">Información de Precios</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Precio de venta</span>
                  </div>
                  <span className="text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Precio de compra</span>
                  </div>
                  <span className="text-gray-900">${product.purchasePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm text-gray-700">Margen de ganancia</span>
                  <span className="text-purple-700">{profitMargin}%</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-gray-900 text-sm mb-3">Información Adicional</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Warehouse className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Almacén</p>
                    <p className="text-sm text-gray-900">{product.warehouse}</p>
                  </div>
                </div>

                {product.supplier && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Package className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Proveedor</p>
                      <p className="text-sm text-gray-900">{product.supplier}</p>
                    </div>
                  </div>
                )}

                {product.description && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Descripción</p>
                    <p className="text-sm text-gray-700">{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Movement History */}
            <div>
              <h3 className="text-gray-900 text-sm mb-3">Historial de Movimientos</h3>
              {movements.length > 0 ? (
                <div className="space-y-2">
                  {movements.map((movement) => (
                    <div
                      key={movement.id}
                      className={`p-3 rounded-lg border ${getMovementColor(movement.type)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMovementIcon(movement.type)}
                          <span className="text-sm">{getMovementTypeLabel(movement.type)}</span>
                        </div>
                        <span className={`text-sm ${
                          movement.quantity > 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </div>
                      <p className="text-xs mb-1">{movement.reason}</p>
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>{movement.user}</span>
                        <span>{formatDate(movement.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Sin movimientos registrados</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Editar Producto
          </button>
        </div>
      </div>
    </div>
  );
}
