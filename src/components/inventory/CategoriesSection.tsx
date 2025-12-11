import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Grid3x3, Package, X, AlertCircle } from 'lucide-react';
import type {Category, Product} from './InventoryScreen';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

type Props = {
  categories: Category[];
  products: Product[];
  onUpdateCategories: (categories: Category[]) => void;
};

export function CategoriesSection({ categories, products, onUpdateCategories }: Props) {
  // Calcular conteo de productos por categoría dinámicamente
  const getProductCount = (categoryName: string) => 
    products.filter(p => p.category === categoryName).length;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const totalProducts = products.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#D0323A] to-[#9F2743] rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Categorías Totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#F6A016] to-[#E9540D] rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">{totalProducts}</p>
              <p className="text-sm text-gray-600">Productos Asignados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">
                {totalProducts > 0 ? Math.round(totalProducts / categories.length) : 0}
              </p>
              <p className="text-sm text-gray-600">Promedio por Categoría</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-[#D0323A] hover:shadow-md transition-all overflow-hidden group"
          >
            {/* Category Header with Color */}
            <div
              className="h-2"
              style={{ backgroundColor: category.color }}
            />

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Grid3x3
                    className="w-6 h-6"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCreateModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-[#F6A016] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const productCount = getProductCount(category.name);
                      if (productCount === 0) {
                        if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
                          onUpdateCategories(categories.filter(c => c.id !== category.id));
                        }
                      } else {
                        alert('No puedes eliminar una categoría con productos asignados');
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Eliminar"
                    disabled={getProductCount(category.name) > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">Productos</span>
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}
                >
                  {getProductCount(category.name)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Category Card */}
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowCreateModal(true);
          }}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-[#D0323A] hover:bg-gray-50 transition-all p-12 flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-[#D0323A] min-h-[250px]"
        >
          <div className="p-4 bg-gray-100 rounded-full">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium">Nueva Categoría</p>
            <p className="text-sm mt-1">Organiza tus productos</p>
          </div>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">Organización por Categorías</h3>
            <p className="text-sm text-gray-700 mb-4">
              Las categorías te ayudan a organizar y clasificar tus productos de manera eficiente.
              Asigna un color distintivo a cada categoría para identificarlas rápidamente.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-700 truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CategoryModal
          category={editingCategory}
          categories={categories}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCategory(null);
          }}
          onSave={(categoryData) => {
            if (editingCategory) {
              // Update existing category
              onUpdateCategories(
                categories.map(c =>
                  c.id === editingCategory.id
                    ? { ...c, ...categoryData }
                    : c
                )
              );
            } else {
              // Create new category
              const newCategory: Category = {
                id: String(categories.length + 1),
                name: categoryData.name,
                description: categoryData.description,
                productsCount: 0,
                color: categoryData.color
              };
              onUpdateCategories([...categories, newCategory]);
            }
            setShowCreateModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

// Category Modal Component
type CategoryModalProps = {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: (categoryData: { name: string; description: string; color: string }) => void;
};

function CategoryModal({ category, categories, onClose, onSave }: CategoryModalProps) {
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#D0323A'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const predefinedColors = [
    '#D0323A', '#9F2743', '#E9540D', '#F6A016', '#F9DC00',
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#6366F1'
  ];

  useModalScrollLock();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Check for duplicate names (excluding current category if editing)
    const duplicate = categories.find(
      c => c.name.toLowerCase() === formData.name.toLowerCase() &&
      (!isEditing || c.id !== category.id)
    );
    if (duplicate) {
      newErrors.name = 'Ya existe una categoría con este nombre';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-white/90 text-sm">
                {isEditing ? 'Actualiza la información' : 'Crea una nueva categoría de productos'}
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
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                }`}
                placeholder="Ej: Tecnología"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                }`}
                placeholder="Describe esta categoría..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">
                Color identificador *
              </label>
              <div className="grid grid-cols-5 gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      formData.color === color
                        ? 'ring-4 ring-offset-2 ring-gray-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  O selecciona un color personalizado
                </span>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="h-2" style={{ backgroundColor: formData.color }} />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      <Grid3x3 className="w-5 h-5" style={{ color: formData.color }} />
                    </div>
                    <span className="text-gray-900">{formData.name || 'Nombre de categoría'}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formData.description || 'Descripción de la categoría'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
            >
              {isEditing ? 'Actualizar' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
