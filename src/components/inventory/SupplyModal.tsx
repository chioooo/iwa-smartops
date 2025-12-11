import React, { useState, useEffect } from 'react';
import { X, Package, AlertCircle, Layers } from 'lucide-react';
import type { Supply, Category } from './InventoryScreen';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

type Props = {
  supply?: Supply | null;
  categories: Category[];
  onClose: () => void;
  onCreate: (supplyData: Omit<Supply, 'id'>) => void;
  onUpdate?: (supplyId: string, updates: Partial<Supply>) => void;
};

export function SupplyModal({ supply, categories, onClose, onCreate, onUpdate }: Props) {
  const isEditing = !!supply;

  const [formData, setFormData] = useState({
    name: supply?.name || '',
    unit: supply?.unit || 'pieza',
    stock: supply?.stock || 0,
    category: supply?.category || '',
    supplier: supply?.supplier || '',
    status: supply?.status || 'active' as 'active' | 'inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supply) {
      setFormData({
        name: supply.name,
        unit: supply.unit,
        stock: supply.stock,
        category: supply.category,
        supplier: supply.supplier,
        status: supply.status
      });
    }
  }, [supply]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (isEditing && supply && onUpdate) {
        onUpdate(supply.id, formData);
      } else {
        onCreate(formData as Omit<Supply, 'id'>);
      }
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const isFormValid = formData.name && formData.category;

  const units = ['pieza', 'caja', 'paquete', 'litro', 'kilogramo', 'metro', 'rollo'];

  useModalScrollLock();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">
                {isEditing ? 'Editar Insumo' : 'Crear Nuevo Insumo'}
              </h2>
              <p className="text-white/90 text-sm">
                {isEditing ? 'Actualiza la información del insumo' : 'Completa los datos del nuevo insumo'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Nombre del insumo *
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                  }`}
                  placeholder="Ej: Tóner Negro HP"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                  errors.category
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Unidad */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Unidad de medida
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Stock inicial
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.stock
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.stock && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stock}
                </p>
              )}
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Proveedor
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                placeholder="Nombre del proveedor"
              />
            </div>

            {/* Estado */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-3">
                Estado
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-4 h-4 text-[#D0323A] focus:ring-[#D0323A]"
                  />
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Activo</span>
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-4 h-4 text-[#D0323A] focus:ring-[#D0323A]"
                  />
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-gray-700">Inactivo</span>
                  </span>
                </label>
              </div>
            </div>
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
              disabled={!isFormValid}
              className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Actualizar Insumo' : 'Crear Insumo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
