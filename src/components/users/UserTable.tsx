import { useState } from "react";
import {
  Eye,
  Edit2,
  Power,
  ChevronLeft,
  ChevronRight, Trash2,
} from "lucide-react";

import type { User } from '../../data/types/users.types.ts'
import {ConfirmModal} from "../common/ConfirmModal.tsx";
import {Tooltip} from "../common/Tooltip.tsx";

type Props = {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  selectedUserId?: string;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
};

export function UserTable({
                            users,
                            onUpdateUser,
                            selectedUserId,
                            onEditUser,
                            onDeleteUser,
                          }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);


    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    const handleToggleStatus = (user: User) => {
    onUpdateUser(user.id, {
      status: user.status === "active" ? "inactive" : "active",
    });
    };

    const formatDate = (dateString: string) =>
      new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[550px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-700 text-sm">
                  Usuario
                </th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">
                  Correo
                </th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">Rol</th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-gray-700 text-sm">
                  Fecha de creación
                </th>
                <th className="text-right px-6 py-4 text-gray-700 text-sm">
                  Acciones
                </th>
              </tr>
              </thead>

              <tbody>
              {currentUsers.map((user) => (
                  <tr
                      key={user.id}
                      className={`border-b border-gray-100 transition-all duration-150 ${
                          selectedUserId === user.id
                              ? "bg-blue-50 shadow-sm"
                              : "hover:bg-gray-50"
                      }`}
                  >
                    {/* Avatar + Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D0323A] to-[#9F2743] flex items-center justify-center text-white">
                          {user.avatar || user.name.charAt(0)}
                        </div>
                        <span className="text-gray-900 font-medium">
                      {user.name}
                    </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                  <span
                      className={`px-3 py-1 rounded-full text-sm ${
                          user.role === "Admin"
                              ? "bg-[#D0323A] text-white"
                              : user.role === "Operador"
                                  ? "bg-[#F6A016] text-white"
                                  : "bg-gray-600 text-white"
                      }`}
                  >
                    {user.role}
                  </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${
                            user.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                    />
                        <span
                            className={`text-sm ${
                                user.status === "active"
                                    ? "text-green-700"
                                    : "text-gray-500"
                            }`}
                        >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">

                        {/* Editar */}
                          <Tooltip text="Editar">
                              <button
                                  onClick={() => onEditUser(user)}
                                  className="p-2 text-gray-600 hover:text-[#F6A016] hover:bg-gray-100 rounded-lg"
                              >
                                  <Edit2 className="w-4 h-4" />
                              </button>
                          </Tooltip>

                        {/* Activar/Desactivar */}
                          <Tooltip text={user.status !== "active" ? "Activar" : "Desactivar"}>
                            <button
                                onClick={() => handleToggleStatus(user)}
                                className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <Power className={`w-4 h-4 rounded-full ${
                                    user.status !== "active"
                                        ? "text-green-500"
                                        : "text-gray-400"
                                }`} />
                            </button>
                          </Tooltip>

                        {/* Eliminar */}
                          <Tooltip text="Eliminar">
                            <button
                                title={"eliminar"}
                                onClick={() => {
                                    setUserToDelete(user);
                                    setShowDeleteModal(true);
                                }}
                                className="p-2  rounded-lg text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {startIndex + 1} -{" "}
                {Math.min(endIndex, users.length)} de {users.length} usuarios
              </p>

              <div className="flex items-center gap-2">

                {/* Prev */}
                <button
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2)
                    )
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${
                                currentPage === page
                                    ? "bg-[#D0323A] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                    ))}

                {/* Next */}
                <button
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
        )}

        {/* Empty state */}
        {users.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-gray-900 text-lg mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-gray-600 text-sm">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
        )}

          <ConfirmModal
              open={showDeleteModal}
              title="¿Eliminar usuario?"
              message={
                  userToDelete
                      ? `Se eliminará a "${userToDelete.name}". Esta acción no se puede deshacer.`
                      : ""
              }
              confirmLabel="Eliminar"
              cancelLabel="Cancelar"
              onCancel={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
              }}
              onConfirm={() => {
                  if (userToDelete) {
                      onDeleteUser(userToDelete.id);
                  }
                  setShowDeleteModal(false);
                  setUserToDelete(null);
              }}
          />
      </div>
  );
}
