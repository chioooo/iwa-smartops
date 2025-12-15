import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  Check,
  AlertCircle
} from 'lucide-react';
import type {Role} from "../../data/types/users.types.ts";


type Props = {
  role: Role;
  onClose: () => void;
  onSave: (permissions: string[]) => void;
};

type PermissionCategory = {
  name: string;
  icon: React.ReactNode;
  color: string;
  permissions: {
    id: string;
    label: string;
    description: string;
  }[];
};

export function PermissionsEditor({ role, onClose, onSave }: Props) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions!);
  const [hasChanges, setHasChanges] = useState(false);

  const permissionCategories: PermissionCategory[] = [
    {
      name: 'Usuarios',
      icon: <Users className="w-5 h-5" />,
      color: 'from-[#D0323A] to-[#9F2743]',
      permissions: [
        { id: 'users.view', label: 'Ver usuarios', description: 'Visualizar lista de usuarios' },
        { id: 'users.create', label: 'Crear usuarios', description: 'Agregar nuevos usuarios al sistema' },
        { id: 'users.edit', label: 'Editar usuarios', description: 'Modificar información de usuarios' },
        { id: 'users.delete', label: 'Eliminar usuarios', description: 'Borrar usuarios del sistema' },
      ]
    },
    {
      name: 'Inventario',
      icon: <Package className="w-5 h-5" />,
      color: 'from-[#F6A016] to-[#E9540D]',
      permissions: [
        { id: 'inventory.viewP', label: 'Ver productos', description: 'Consultar productos y stock' },
        { id: 'inventory.createP', label: 'Crear productos', description: 'Agregar nuevos productos' },
        { id: 'inventory.editP', label: 'Editar productos', description: 'Modificar productos y stock' },
        { id: 'inventory.deleteP', label: 'Eliminar productos', description: 'Borrar productos del inventario' },
        { id: 'inventory.viewS', label: 'Ver insumos', description: 'Consultar insumos y stock' },
        { id: 'inventory.createS', label: 'Crear insumos', description: 'Agregar nuevos insumos' },
        { id: 'inventory.editS', label: 'Editar insumos', description: 'Modificar insumos y stock' },
        { id: 'inventory.deleteS', label: 'Eliminar insumos', description: 'Borrar insumos del inventario' },
      ]
    },
    {
      name: 'Facturación',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-600',
      permissions: [
        { id: 'billing.view', label: 'Ver facturas', description: 'Consultar facturas generadas' },
        { id: 'billing.create', label: 'Crear facturas', description: 'Generar nuevas facturas' },
        { id: 'billing.delete', label: 'Anular facturas', description: 'Cancelar o anular facturas' },
      ]
    },
    {
      name: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      color: 'from-gray-600 to-gray-700',
      permissions: [
        { id: 'settings.view', label: 'Ver configuración', description: 'Acceder a ajustes del sistema' },
        { id: 'settings.edit', label: 'Editar configuración', description: 'Modificar ajustes del sistema' },
      ]
    }
  ];

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newPermissions = prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId];
      setHasChanges(true);
      return newPermissions;
    });
  };

  const toggleCategory = (category: PermissionCategory) => {
    const categoryPermissionIds = category.permissions.map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

    setSelectedPermissions((prev) => {
      if (allSelected) {
        return prev.filter(p => !categoryPermissionIds.includes(p));
      } else {
        const newPerms = [...prev];
        categoryPermissionIds.forEach(id => {
          if (!newPerms.includes(id)) {
            newPerms.push(id);
          }
        });
        return newPerms;
      }
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(selectedPermissions);
  };

  const getCategoryProgress = (category: PermissionCategory) => {
    const total = category.permissions.length;
    const selected = category.permissions.filter(p => selectedPermissions.includes(p.id)).length;
    return { selected, total, percentage: (selected / total) * 100 };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">Editor de Permisos</h2>
            <p className="text-sm text-gray-600">
              Configurando permisos para el rol: <span className="text-[#D0323A]">{role.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Summary Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1">Permisos seleccionados</p>
                <p className="text-3xl text-gray-900">
                  {selectedPermissions.length}
                  <span className="text-lg text-gray-600 ml-2">
                    / {permissionCategories.reduce((sum, cat) => sum + cat.permissions.length, 0)}
                  </span>
                </p>
              </div>
              {hasChanges && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Cambios sin guardar</span>
                </div>
              )}
            </div>
          </div>

          {/* Permission Categories */}
          <div className="space-y-6">
            {permissionCategories.map((category) => {
              const progress = getCategoryProgress(category);
              const allSelected = progress.selected === progress.total;

              return (
                <div
                  key={category.name}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-gradient-to-br ${category.color} text-white rounded-lg`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">
                            {progress.selected} de {progress.total} permisos seleccionados
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          allSelected
                            ? 'bg-[#D0323A] text-white hover:bg-[#9F2743]'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                        }`}
                      >
                        {allSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${category.color} transition-all duration-300`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Permissions List */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.permissions.map((permission) => {
                      const isSelected = selectedPermissions.includes(permission.id);

                      return (
                        <label
                          key={permission.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#D0323A] bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="pt-0.5">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#D0323A] border-[#D0323A]'
                                : 'bg-white border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm mb-0.5">{permission.label}</p>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePermission(permission.id)}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedPermissions.length} permisos seleccionados
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
