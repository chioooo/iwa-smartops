import {useState} from "react";
import {X, Shield, FileText, AlertCircle} from "lucide-react";

interface Props {
    onClose: () => void;
    onCreate: (roleData: { name: string; description: string }) => void;
}

export function CreateRoleModal({onClose, onCreate}: Props) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: "name" | "description", value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
        setErrors((prev) => ({...prev, [field]: ""}));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre del rol es obligatorio";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onCreate({
                name: formData.name.trim(),
                description: formData.description.trim(),
            });

            onClose();
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
                            <h2 className="text-white mb-1">Crear Nuevo Rol</h2>
                            <p className="text-white/90 text-sm">
                                Define los datos del nuevo rol del sistema
                            </p>
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

                        {/* Nombre del rol */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Nombre del rol *
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                        errors.name
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-gray-300 focus:ring-[#D0323A] focus:border-transparent"
                                    }`}
                                    placeholder="Ej: Administrador, Operador, Supervisor"
                                />
                            </div>

                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Descripción
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400"/>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleChange("description", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-colors"
                                    placeholder="Describe brevemente la función del rol"
                                />
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
                            Crear Rol
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
