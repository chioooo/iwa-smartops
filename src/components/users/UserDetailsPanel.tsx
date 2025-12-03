import React, { useState } from 'react';
import { X, Mail, Calendar, Shield, Key, Power, Edit2, Check } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

type Props = {
  user: User;
  roles: Role[];
  onClose: () => void;
  onUpdate: (updates: Partial<User>) => void;
};

export function UserDetailsPanel({ user, roles, onClose, onUpdate }: Props) {
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const currentRole = roles.find(r => r.name === user.role);

  const handleSaveRole = () => {
    onUpdate({ role: selectedRole });
    setIsEditingRole(false);
  };

  const handleToggleStatus = () => {
    onUpdate({ status: user.status === 'active' ? 'inactive' : 'active' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Permisos agrupados por categoría
  const permissionCategories = [
    {
      name: 'Usuarios',
      permissions: currentRole?.permissions.filter(p => p.startsWith('users.')) || []
    },
    {
      name: 'Inventario',
      permissions: currentRole?.permissions.filter(p => p.startsWith('inventory.')) || []
    },
    {
      name: 'Facturación',
      permissions: currentRole?.permissions.filter(p => p.startsWith('billing.')) || []
    },
    {
      name: 'Operaciones',
      permissions: currentRole?.permissions.filter(p => p.startsWith('operations.')) || []
    },
    {
      name: 'Reportes',
      permissions: currentRole?.permissions.filter(p => p.startsWith('reports.')) || []
    },
    {
      name: 'Configuración',
      permissions: currentRole?.permissions.filter(p => p.startsWith('settings.')) || []
    }
  ].filter(cat => cat.permissions.length > 0);

  const getPermissionLabel = (permission: string) => {
    const [category, action] = permission.split('.');
    const actionLabels: Record<string, string> = {
      view: 'Ver',
      create: 'Crear',
      edit: 'Editar',
      delete: 'Eliminar'
    };
    return actionLabels[action] || action;
  };

  return (
    <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col max-h-[calc(100vh-8rem)] animate-slide-in">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-gray-900">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D0323A] to-[#9F2743] flex items-center justify-center text-white text-2xl mb-3">
            {user.avatar}
          </div>
          <h3 className="text-gray-900">{user.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className={`text-sm ${
              user.status === 'active' ? 'text-green-700' : 'text-gray-500'
            }`}>
              {user.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-gray-900 text-sm mb-3">Información Personal</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Correo electrónico</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Fecha de creación</p>
                  <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 text-sm">Rol Asignado</h3>
              {!isEditingRole ? (
                <button
                  onClick={() => setIsEditingRole(true)}
                  className="text-[#D0323A] hover:text-[#9F2743] text-sm flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Cambiar
                </button>
              ) : (
                <button
                  onClick={handleSaveRole}
                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Guardar
                </button>
              )}
            </div>

            {isEditingRole ? (
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-2 bg-white rounded-lg">
                  <Shield className="w-5 h-5 text-[#D0323A]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{user.role}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentRole?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Permisos heredados */}
          <div>
            <h3 className="text-gray-900 text-sm mb-3">Permisos Heredados del Rol</h3>
            <div className="space-y-3">
              {permissionCategories.map((category) => (
                <div key={category.name} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-700 mb-2">{category.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200"
                      >
                        {getPermissionLabel(permission)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {permissionCategories.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay permisos asignados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl space-y-3">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Key className="w-4 h-4" />
          Restablecer Contraseña
        </button>
        
        <button
          onClick={handleToggleStatus}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
            user.status === 'active'
              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
          }`}
        >
          <Power className="w-4 h-4" />
          {user.status === 'active' ? 'Desactivar Usuario' : 'Activar Usuario'}
        </button>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
