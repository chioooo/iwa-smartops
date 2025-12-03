import React from 'react';
import { Shield, Users, Key, Edit2, Plus } from 'lucide-react';

type Role = {
  id: string;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
};

type Props = {
  roles: Role[];
  onEditPermissions: (role: Role) => void;
  onCreateRole: (roleData: any) => void;
};

export function RolesSection({ roles, onEditPermissions, onCreateRole }: Props) {
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return {
          bg: 'bg-gradient-to-br from-[#D0323A] to-[#9F2743]',
          badge: 'bg-[#D0323A]',
          border: 'border-[#D0323A]'
        };
      case 'Operador':
        return {
          bg: 'bg-gradient-to-br from-[#F6A016] to-[#E9540D]',
          badge: 'bg-[#F6A016]',
          border: 'border-[#F6A016]'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-600 to-gray-700',
          badge: 'bg-gray-600',
          border: 'border-gray-600'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D0323A]/10 rounded-lg">
              <Shield className="w-6 h-6 text-[#D0323A]" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">{roles.length}</p>
              <p className="text-sm text-gray-600">Roles Totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F6A016]/10 rounded-lg">
              <Users className="w-6 h-6 text-[#F6A016]" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">
                {roles.reduce((sum, role) => sum + role.usersCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Usuarios Asignados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E9540D]/10 rounded-lg">
              <Key className="w-6 h-6 text-[#E9540D]" />
            </div>
            <div>
              <p className="text-2xl text-gray-900">
                {Math.max(...roles.map(r => r.permissionsCount))}
              </p>
              <p className="text-sm text-gray-600">Permisos Máximos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const colors = getRoleColor(role.name);
          
          return (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Role Header */}
              <div className={`${colors.bg} p-6 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Shield className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => onEditPermissions(role)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                    title="Editar permisos"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white mb-1">{role.name}</h3>
                <p className="text-white/90 text-sm">{role.description}</p>
              </div>

              {/* Role Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-2xl text-gray-900">{role.usersCount}</p>
                    <p className="text-xs text-gray-600">Usuarios</p>
                  </div>
                  <div>
                    <p className="text-2xl text-gray-900">{role.permissionsCount}</p>
                    <p className="text-xs text-gray-600">Permisos</p>
                  </div>
                </div>

                <button
                  onClick={() => onEditPermissions(role)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 ${colors.border} text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`}
                >
                  <Key className="w-4 h-4" />
                  Gestionar Permisos
                </button>
              </div>
            </div>
          );
        })}

        {/* Create New Role Card */}
        <button
          onClick={() => {
            const name = prompt('Nombre del nuevo rol:');
            const description = prompt('Descripción del rol:');
            if (name && description) {
              onCreateRole({ name, description });
            }
          }}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-[#D0323A] hover:bg-gray-50 transition-all p-12 flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-[#D0323A] min-h-[280px]"
        >
          <div className="p-4 bg-gray-100 rounded-full">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium">Crear Nuevo Rol</p>
            <p className="text-sm mt-1">Define roles personalizados</p>
          </div>
        </button>
      </div>

      {/* Permissions Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">Guía de Permisos</h3>
            <p className="text-sm text-gray-700 mb-4">
              Los permisos se organizan por categorías y definen qué acciones puede realizar cada rol en el sistema.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Usuarios</p>
                <p className="text-sm text-gray-900">Gestión de usuarios</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Inventario</p>
                <p className="text-sm text-gray-900">Control de stock</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Facturación</p>
                <p className="text-sm text-gray-900">Gestión de facturas</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Operaciones</p>
                <p className="text-sm text-gray-900">Servicios y tareas</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Reportes</p>
                <p className="text-sm text-gray-900">Análisis y métricas</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Configuración</p>
                <p className="text-sm text-gray-900">Ajustes del sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
