import React, { useState } from 'react';
import { X, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type {Product} from './InventoryScreen';

type Props = {
  product: Product;
  onClose: () => void;
  onAdjust: (productId: string, physicalStock: number, reason: string) => void;
};

const adjustmentReasons = [
  { value: 'damage', label: 'Producto dañado', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'missing', label: 'Faltante / Merma', icon: TrendingDown, color: 'text-orange-600' },
  { value: 'count_error', label: 'Error de conteo', icon: Package, color: 'text-blue-600' },
  { value: 'manual_entry', label: 'Entrada manual', icon: TrendingUp, color: 'text-green-600' },
  { value: 'return', label: 'Devolución', icon: Package, color: 'text-purple-600' },
  { value: 'other', label: 'Otro motivo', icon: Package, color: 'text-gray-600' },
];

export function InventoryAdjustmentModal({ product, onClose, onAdjust }: Props) {
  const [physicalStock, setPhysicalStock] = useState<number>(product.stock);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const difference = physicalStock - product.stock;
  const isDifferent = difference !== 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDifferent && reason) {
      const finalReason = reason === 'other' ? customReason : adjustmentReasons.find(r => r.value === reason)?.label || reason;
      onAdjust(product.id, physicalStock, finalReason);
    }
  };

  const getDifferenceColor = () => {
    if (difference > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (difference < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getDifferenceIcon = () => {
    if (difference > 0) return <TrendingUp className="w-5 h-5" />;
    if (difference < 0) return <TrendingDown className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">Ajuste de Inventario</h2>
              <p className="text-white/90 text-sm">
                Ajusta el stock del producto según el conteo físico
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
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-xl flex items-center justify-center text-white text-xl">
              {product.image}
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.sku} • {product.category}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Current Stock */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 mb-1">Stock actual en sistema</p>
                  <p className="text-3xl text-gray-900">{product.stock}</p>
                  <p className="text-xs text-gray-600 mt-1">{product.unit}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Physical Stock Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">
                Stock físico contado *
              </label>
              <input
                type="number"
                min="0"
                value={physicalStock}
                onChange={(e) => setPhysicalStock(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                placeholder="0"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Ingresa la cantidad exacta que encontraste en el inventario físico
              </p>
            </div>

            {/* Difference Display */}
            {isDifferent && (
              <div className={`rounded-xl p-5 border-2 ${getDifferenceColor()}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1">Diferencia detectada</p>
                    <div className="flex items-center gap-2">
                      {getDifferenceIcon()}
                      <p className="text-3xl">
                        {difference > 0 ? '+' : ''}{difference}
                      </p>
                    </div>
                    <p className="text-xs mt-1">
                      {difference > 0 ? 'Entrada de stock' : 'Salida de stock'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1">Stock resultante</p>
                    <p className="text-2xl">{physicalStock}</p>
                    <p className="text-xs">{product.unit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No Difference */}
            {!isDifferent && physicalStock === product.stock && (
              <div className="rounded-xl p-5 border-2 border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-200 rounded-xl">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Sin diferencias</p>
                    <p className="text-sm text-gray-600">
                      El stock físico coincide con el stock en sistema
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason Selection */}
            {isDifferent && (
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  Motivo del ajuste *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {adjustmentReasons.map((reasonOption) => (
                    <label
                      key={reasonOption.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        reason === reasonOption.value
                          ? 'border-[#D0323A] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reasonOption.value}
                        checked={reason === reasonOption.value}
                        onChange={(e) => setReason(e.target.value)}
                        className="sr-only"
                      />
                      <reasonOption.icon className={`w-5 h-5 ${reasonOption.color}`} />
                      <span className="text-sm text-gray-900">{reasonOption.label}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Reason */}
                {reason === 'other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                      placeholder="Describe el motivo del ajuste..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* Warning */}
            {isDifferent && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900 mb-1">
                      Atención: Esta acción modificará el stock del producto
                    </p>
                    <p className="text-xs text-yellow-700">
                      El ajuste quedará registrado en el historial de movimientos del producto.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isDifferent || !reason || (reason === 'other' && !customReason)}
              className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
