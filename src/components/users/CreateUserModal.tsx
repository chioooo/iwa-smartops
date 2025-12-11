import React, {useEffect, useState} from 'react';
import {X, User, Mail, Shield, Lock, AlertCircle} from 'lucide-react';
import type {Role} from "../../data/types/users.types.ts";

type Props = {
    roles: Role[];
    onClose: () => void;
    onCreate?: (userData: any) => void;
    onUpdate?: (userData: any) => void;
    initialData?: any;
};

export function CreateUserModal({roles, onClose, onCreate, onUpdate, initialData}: Props) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        role: initialData?.roleId || roles[0]?.id || '',
        status: initialData?.status || 'active',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!initialData) return;

        setFormData(prev => ({
            ...prev,
            name: initialData.name || '',
            email: initialData.email || '',
            role: initialData.roleId || '',
            status: initialData.status || 'active',
        }));
    }, [initialData]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = Boolean(initialData);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.role) {
            newErrors.role = 'Selecciona un rol';
        }

        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const selectedRole = roles.find(r => r.id === formData.role);

            const payload = {
                name: formData.name,
                email: formData.email,
                roleId: selectedRole?.id,
                role: selectedRole?.name || 'Usuario',
                status: formData.status
            };

            if (isEdit && onUpdate) {
                onUpdate(payload);
            } else if (onCreate) {
                onCreate(payload);
            }
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData({...formData, [field]: value});
        if (errors[field]) {
            setErrors({...errors, [field]: ''});
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto">
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 rounded-t-2xl text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-white mb-1">{isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                            <p className="text-white/90 text-sm">{isEdit ? 'Actualiza los datos del usuario' : 'Completa los datos del nuevo usuario'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Nombre completo */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Nombre completo *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                        errors.name
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                                    }`}
                                    placeholder="Ej: María González"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Correo electrónico */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Correo electrónico *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                        errors.email
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                                    }`}
                                    placeholder="usuario@iwa.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Rol inicial *
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none bg-white ${
                                        errors.role
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                                    }`}
                                >
                                    <option value="">Selecciona un rol</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} - {role.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.role && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-3">
                                Estado inicial
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
                    <div className="w-2 h-2 rounded-full bg-green-500"/>
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
                    <div className="w-2 h-2 rounded-full bg-gray-400"/>
                    <span className="text-gray-700">Inactivo</span>
                  </span>
                                </label>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-gray-900 text-sm mb-3 flex items-center gap-2">
                                <Lock className="w-4 h-4"/>
                                Contraseña *
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                            errors.password
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                                        }`}
                                        placeholder="Contraseña"
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4"/>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                            errors.confirmPassword
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-300 focus:ring-[#D0323A] focus:border-transparent'
                                        }`}
                                        placeholder="Confirmar contraseña"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4"/>
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
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
                            className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
                        >
                            {isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
