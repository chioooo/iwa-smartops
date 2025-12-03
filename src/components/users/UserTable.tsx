import React, { useState } from 'react';
import { Eye, Edit2, Power, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
};

type Props = {
  users: User[];
  onSelectUser: (user: User) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  selectedUserId?: string;
};

export function UserTable({ users, onSelectUser, onUpdateUser, selectedUserId }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handleToggleStatus = (user: User) => {
    onUpdateUser(user.id, {
      status: user.status === 'active' ? 'inactive' : 'active'
    });
    setOpenMenuId(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-[#D0323A] text-white';
      case 'Operador':
        return 'bg-[#F6A016] text-white';
      case 'Usuario':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-700 text-sm">Usuario</th>
              <th className="text-left px-6 py-4 text-gray-700 text-sm">Correo</th>
              <th className="text-left px-6 py-4 text-gray-700 text-sm">Rol</th>
              <th className="text-left px-6 py-4 text-gray-700 text-sm">Estado</th>
              <th className="text-left px-6 py-4 text-gray-700 text-sm">Fecha de creación</th>
              <th className="text-right px-6 py-4 text-gray-700 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedUserId === user.id ? 'bg-blue-50' : ''
                }`}
              >
                {/* Usuario */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D0323A] to-[#9F2743] flex items-center justify-center text-white">
                        {user.avatar}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </td>

                {/* Correo */}
                <td className="px-6 py-4">
                  <span className="text-gray-600">{user.email}</span>
                </td>

                {/* Rol */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      user.status === 'active' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-6 py-4">
                  <span className="text-gray-600 text-sm">{formatDate(user.createdAt)}</span>
                </td>

                {/* Acciones */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 relative">
                    <button
                      onClick={() => onSelectUser(user)}
                      className="p-2 text-gray-600 hover:text-[#D0323A] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectUser(user)}
                      className="p-2 text-gray-600 hover:text-[#F6A016] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === user.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Power className="w-4 h-4" />
                              {user.status === 'active' ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1} - {Math.min(endIndex, users.length)} de {users.length} usuarios
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-[#D0323A] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
