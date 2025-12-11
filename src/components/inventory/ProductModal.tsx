import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, AlertCircle, Upload, Hash, Layers } from 'lucide-react';
import type {Product, Category} from './InventoryScreen';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

type Props = {
  categories: Category[];
  product?: Product | null;
  onClose: () => void;
  onCreate: (productData: Omit<Product, 'id'>) => void;
  onUpdate: (productId: string, updates: Partial<Product>) => void;
};

export function ProductModal({ categories, product, onClose, onCreate, onUpdate }: Props) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || categories[0]?.name || '',
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
    price: product?.price || 0,
    purchasePrice: product?.purchasePrice || 0,
    unit: product?.unit || 'pieza',
    supplier: product?.supplier || '',
    description: product?.description || '',
    status: product?.status || 'active',
    warehouse: product?.warehouse || 'Almacén Principal'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        stock: product.stock,
        minStock: product.minStock,
        price: product.price,
        purchasePrice: product.purchasePrice,
        unit: product.unit,
        supplier: product.supplier,
        description: product.description,
        status: product.status,
        warehouse: product.warehouse || 'Almacén Principal'
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El código/SKU es requerido';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'El precio de compra no puede ser negativo';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (isEditing && product) {
        onUpdate(product.id, formData);
      } else {
        onCreate(formData as Omit<Product, 'id'>);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const isFormValid = formData.name && formData.sku && formData.price > 0;

  useModalScrollLock();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">
                {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <p className="text-white/90 text-sm">
                {isEditing ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
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
                Nombre del producto *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                  }`}
                  placeholder="Ej: Laptop Dell XPS 15"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Código / SKU *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.sku
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                  }`}
                  placeholder="TECH-001"
                />
              </div>
              {errors.sku && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.sku}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Categoría *
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precio de Venta */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Precio de venta *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.price
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Precio de Compra */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Precio de compra
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock Inicial/Actual */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {isEditing ? 'Stock actual' : 'Stock inicial'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                placeholder="0"
                disabled={isEditing}
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Usa "Ajuste de inventario" para modificar el stock
                </p>
              )}
            </div>

            {/* Stock Mínimo */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Stock mínimo
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                placeholder="5"
              />
            </div>

            {/* Unidad de Medida */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Unidad de medida
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="pieza">Pieza</option>
                <option value="paquete">Paquete</option>
                <option value="caja">Caja</option>
                <option value="kg">Kilogramo (kg)</option>
                <option value="litro">Litro (L)</option>
                <option value="metro">Metro (m)</option>
                <option value="unidad">Unidad</option>
              </select>
            </div>

            {/* Almacén */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Almacén / Sucursal
              </label>
              <select
                value={formData.warehouse}
                onChange={(e) => handleChange('warehouse', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
              >
                <option value="Almacén Principal">Almacén Principal</option>
                <option value="Almacén Secundario">Almacén Secundario</option>
                <option value="Sucursal Norte">Sucursal Norte</option>
                <option value="Sucursal Sur">Sucursal Sur</option>
              </select>
            </div>

            {/* Proveedor */}
            <div className="md:col-span-2">
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

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent resize-none"
                placeholder="Descripción detallada del producto..."
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

            {/* Imagen del producto */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Imagen del producto (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D0323A] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Arrastra una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG hasta 5MB
                </p>
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
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
