import React, { useState } from 'react';
import { Users, Shield, Search, Plus, Filter } from 'lucide-react';
import { UserTable } from './UserTable';
import { RolesSection } from './RolesSection';
import { CreateUserModal } from './CreateUserModal';
import { UserDetailsPanel } from './UserDetailsPanel';
import { PermissionsEditor } from './PermissionsEditor';

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
  permissionsCount: number;
  usersCount: number;
  permissions: string[];
};

export function UsersScreen() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissionsEditor, setShowPermissionsEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@iwa.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15',
      avatar: 'MG'
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@iwa.com',
      role: 'Usuario',
      status: 'active',
      createdAt: '2024-02-20',
      avatar: 'CR'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana.martinez@iwa.com',
      role: 'Operador',
      status: 'active',
      createdAt: '2024-03-10',
      avatar: 'AM'
    },
    {
      id: '4',
      name: 'Luis Fernández',
      email: 'luis.fernandez@iwa.com',
      role: 'Usuario',
      status: 'inactive',
      createdAt: '2024-02-05',
      avatar: 'LF'
    },
    {
      id: '5',
      name: 'Patricia López',
      email: 'patricia.lopez@iwa.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-20',
      avatar: 'PL'
    },
  ]);

  // Mock data - roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Acceso completo al sistema',
      permissionsCount: 24,
      usersCount: 2,
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'inventory.view', 'inventory.create', 'billing.view', 'billing.create', 'reports.view', 'settings.edit']
    },
    {
      id: '2',
      name: 'Usuario',
      description: 'Acceso estándar con permisos limitados',
      permissionsCount: 12,
      usersCount: 2,
      permissions: ['users.view', 'inventory.view', 'billing.view', 'reports.view']
    },
    {
      id: '3',
      name: 'Operador',
      description: 'Gestión de operaciones y servicios',
      permissionsCount: 16,
      usersCount: 1,
      permissions: ['inventory.view', 'inventory.create', 'inventory.edit', 'operations.view', 'operations.create', 'billing.view']
    },
  ]);

  const handleCreateUser = (userData: any) => {
    const newUser: User = {
      id: String(users.length + 1),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || 'active',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, ...updates });
    }
  };

  const handleCreateRole = (roleData: any) => {
    const newRole: Role = {
      id: String(roles.length + 1),
      name: roleData.name,
      description: roleData.description,
      permissionsCount: 0,
      usersCount: 0,
      permissions: []
    };
    setRoles([...roles, newRole]);
  };

  const handleUpdatePermissions = (roleId: string, permissions: string[]) => {
    setRoles(roles.map(r => 
      r.id === roleId 
        ? { ...r, permissions, permissionsCount: permissions.length }
        : r
    ));
    setShowPermissionsEditor(false);
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 mb-2">Gestión de Usuarios</h1>
              <p className="text-gray-600">Administra usuarios, roles y permisos del sistema</p>
            </div>
            <button
              onClick={() => activeTab === 'users' ? setShowCreateModal(true) : handleCreateRole({})}
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
            <div className={`flex-1 transition-all duration-300 ${selectedUser ? 'mr-0' : ''}`}>
              {/* Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex gap-4 items-center">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o correo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent"
                    />
                  </div>

                  {/* Role Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
                    >
                      <option value="all">Todos los roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Usuario">Usuario</option>
                      <option value="Operador">Operador</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent bg-white"
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
                onSelectUser={setSelectedUser}
                onUpdateUser={handleUpdateUser}
                selectedUserId={selectedUser?.id}
              />
            </div>

            {/* User Details Panel */}
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
            onCreateRole={handleCreateRole}
          />
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          roles={roles}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateUser}
        />
      )}

      {/* Permissions Editor */}
      {showPermissionsEditor && selectedRole && (
        <PermissionsEditor
          role={selectedRole}
          onClose={() => {
            setShowPermissionsEditor(false);
            setSelectedRole(null);
          }}
          onSave={(permissions) => handleUpdatePermissions(selectedRole.id, permissions)}
        />
      )}
    </div>
  );
}
