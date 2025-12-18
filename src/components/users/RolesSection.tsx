import {Shield, Users, Key, Edit2, Plus} from "lucide-react";
import type {Role} from "../../data/types/users.types";

type Props = {
    roles: Role[];
    onEditPermissions: (role: Role) => void;
    onOpenCreateRoleModal: () => void;
};

// Helpers visuales
const getRoleColor = (roleName: string) => {
    switch (roleName) {
        case "Administrador":
            return {
                bg: "bg-gradient-to-br from-[#D0323A] to-[#9F2743]",
                badge: "bg-[#D0323A]",
                border: "border-[#D0323A]",
            };
        case "Operador":
            return {
                bg: "bg-gradient-to-br from-[#F6A016] to-[#E9540D]",
                badge: "bg-[#F6A016]",
                border: "border-[#F6A016]",
            };
        default:
            return {
                bg: "bg-gradient-to-br from-gray-600 to-gray-700",
                badge: "bg-gray-600",
                border: "border-gray-600",
            };
    }
};

export function RolesSection({roles, onEditPermissions, onOpenCreateRoleModal}: Props) {
    // Transformación visual (no altera el tipo Role)
    const decoratedRoles = roles.map((r) => ({
        ...r,
        usersCount: r.usersCount ?? 0,
        permissionsCount: r.permissions?.length ?? 0,
    }));

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#D0323A]/10 rounded-lg">
                            <Shield className="w-6 h-6 text-[#D0323A]"/>
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
                            <Users className="w-6 h-6 text-[#F6A016]"/>
                        </div>
                        <div>
                            <p className="text-2xl text-gray-900">
                                {decoratedRoles.reduce((sum, r) => sum + r.usersCount, 0)}
                            </p>
                            <p className="text-sm text-gray-600">Usuarios Asignados</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#E9540D]/10 rounded-lg">
                            <Key className="w-6 h-6 text-[#E9540D]"/>
                        </div>
                        <div>
                            <p className="text-2xl text-gray-900">
                                {Math.max(...decoratedRoles.map((r) => r.permissionsCount))}
                            </p>
                            <p className="text-sm text-gray-600">Permisos Máximos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decoratedRoles.map((role) => {
                    const colors = getRoleColor(role.name);

                    return (
                        <div
                            key={role.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className={`${colors.bg} p-6 text-white`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Shield className="w-6 h-6"/>
                                    </div>
                                    <button
                                        onClick={() => onEditPermissions(role)}
                                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                                    >
                                        <Edit2 className="w-4 h-4"/>
                                    </button>
                                </div>

                                <h3 className="text-white mb-1">{role.name}</h3>
                                <p className="text-white/90 text-sm">{role.description}</p>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-2xl text-gray-900">
                                            {role.usersCount}
                                        </p>
                                        <p className="text-xs text-gray-600">Usuarios</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl text-gray-900">
                                            {role.permissionsCount}
                                        </p>
                                        <p className="text-xs text-gray-600">Permisos</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onEditPermissions(role)}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 ${colors.border} text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`}
                                >
                                    <Key className="w-4 h-4"/>
                                    Gestionar Permisos
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Crear nuevo */}
                <button
                    onClick={onOpenCreateRoleModal}
                    className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-[#D0323A] hover:bg-gray-50 transition-all p-12 flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-[#D0323A] min-h-[280px]"
                >
                    <div className="p-4 bg-gray-100 rounded-full">
                        <Plus className="w-8 h-8"/>
                    </div>
                    <p className="font-medium">Crear Nuevo Rol</p>
                    <p className="text-sm">Define roles personalizados</p>
                </button>
            </div>
        </div>
    );
}
