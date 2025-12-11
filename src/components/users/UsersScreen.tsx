import { useState, useEffect } from 'react';
import { Users, Shield, Search, Plus, Filter } from 'lucide-react';
import { UserTable } from './UserTable';
import { RolesSection } from './RolesSection';
import { CreateUserModal } from './CreateUserModal';
import { UserDetailsPanel } from './UserDetailsPanel';
import { PermissionsEditor } from './PermissionsEditor';

import { demoDataService } from '../../services/usersService.tsx'
import type { User, Role } from "../../data/types/users.types.ts";
import {CreateRoleModal} from "./CreateRoleModal.tsx";

export function UsersScreen() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissionsEditor, setShowPermissionsEditor] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Cargar datos desde localStorage (una sola vez)
  useEffect(() => {
    setUsers(demoDataService.getUsers());
    setRoles(demoDataService.getRoles());
  }, []);

  //  CRUD USERS

  const handleCreateUser = (userData: User) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: userData.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
    };

    demoDataService.addUser(newUser);   // ✔ guardar en localStorage
    setUsers(demoDataService.getUsers()); // ✔ actualizar UI

    setShowCreateModal(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    const existing = users.find(u => u.id === userId);
    if (!existing) return;

    const updatedUser: User = {
      ...existing,
      ...updates,
    };

    demoDataService.updateUser(updatedUser);

    const updatedList = demoDataService.getUsers();
    setUsers(updatedList);

    if (selectedUser?.id === userId) {
      setSelectedUser(updatedUser);
    }
  };

  //  ROLES

  const handleCreateRole = (roleData: Role) => {
    const newRole: Role = {
      id: crypto.randomUUID(),
      name: roleData.name,
      description: roleData.description,
      permissionsCount: 0,
      usersCount: 0,
      permissions: [],
    };

    demoDataService.addRole(newRole);
    setRoles(demoDataService.getRoles());
  };

  const handleUpdatePermissions = (roleId: string, permissions: string[]) => {
    const updatedRole = {
      ...roles.find(r => r.id === roleId)!,
      permissions,
      permissionsCount: permissions.length,
    };

    demoDataService.updateRole(updatedRole);
    setRoles(demoDataService.getRoles());

    setShowPermissionsEditor(false);
  };

  //  FILTRADO

  const filteredUsers = users.filter((user) => {
    if (!user) return false;

    const name = user.name ?? "";
    const email = user.email ?? "";
    const query = searchQuery.toLowerCase();

    const matchesSearch =
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  //  RENDER

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-900 mb-2">Gestión de Usuarios</h1>
                <p className="text-gray-600">
                  Administra usuarios, roles y permisos del sistema
                </p>
              </div>

              <button
                  onClick={() =>
                      activeTab === 'users'
                          ? setShowCreateModal(true)
                          : setShowCreateRoleModal(true)
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
              >
                <Plus className="w-5 h-5" />
                {activeTab === 'users' ? 'Nuevo Usuario' : 'Nuevo Rol'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200">
              <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                      activeTab === 'users'
                          ? 'border-[#D0323A] text-[#D0323A]'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Users className="w-5 h-5" />
                Usuarios
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {users.length}
              </span>
              </button>

              <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                      activeTab === 'roles'
                          ? 'border-[#D0323A] text-[#D0323A]'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Shield className="w-5 h-5" />
                Roles y Permisos
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {roles.length}
              </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === 'users' ? (
              <div className="flex gap-6">
                {/* Main Content */}
                <div className={`flex-1`}>
                  {/* Filters */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0323A]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="all">Todos los roles</option>

                          {roles.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                          ))}
                        </select>
                      </div>

                      <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                      </select>
                    </div>
                  </div>

                  {/* User Table */}
                  <UserTable
                      users={filteredUsers}
                      onUpdateUser={handleUpdateUser}
                      onEditUser={(user) => setEditUser(user)}
                      selectedUserId={selectedUser?.id}
                  />
                </div>

                {selectedUser && (
                    <UserDetailsPanel
                        user={selectedUser}
                        roles={roles}
                        onClose={() => setSelectedUser(null)}
                        onUpdate={(updates) => handleUpdateUser(selectedUser.id, updates)}
                    />
                )}
              </div>
          ) : (
              <RolesSection
                  roles={roles}
                  onEditPermissions={(role) => {
                    setSelectedRole(role);
                    setShowPermissionsEditor(true);
                  }}
                  onOpenCreateRoleModal={() => setShowCreateRoleModal(true)}
              />
          )}
        </div>

        {/* Modal Crear */}
        {showCreateModal && (
            <CreateUserModal
                roles={roles}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateUser}
            />
        )}

        {/* Modal Editar */}
        {editUser && (
            <CreateUserModal
                roles={roles}
                initialData={editUser}
                onClose={() => setEditUser(null)}
                onUpdate={(updates) => {
                  handleUpdateUser(editUser.id, updates);
                  setEditUser(null);
                }}
            />
        )}

        {showCreateRoleModal && (
            <CreateRoleModal
                onClose={() => setShowCreateRoleModal(false)}
                onCreate={handleCreateRole}
            />
        )}

        {showPermissionsEditor && selectedRole && (
            <PermissionsEditor
                role={selectedRole}
                onClose={() => {
                  setShowPermissionsEditor(false);
                  setSelectedRole(null);
                }}
                onSave={(permissions) =>
                    handleUpdatePermissions(selectedRole.id!, permissions)
                }
            />
        )}
      </div>
  );
}
