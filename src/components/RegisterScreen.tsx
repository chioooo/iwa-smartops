import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import logoImage from "../assets/logo.png";

interface RegisterScreenProps {
  onBackToLogin: () => void;
}

export function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "El nombre debe tener al menos 3 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Register attempt:", formData);
      // Here you would handle the registration logic
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#D0323A] via-[#E9540D] to-[#F6A016] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <img src={logoImage} alt="iWA SmartOps" className="h-16 mb-8" />
          <h1 className="text-white text-5xl mb-4 max-w-lg leading-tight">
            Únete a iWA SmartOps
          </h1>
          <p className="text-white/90 text-xl max-w-md">
            Gestiona tus servicios, facturación e integra IA en un solo lugar
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-white mb-4">¿Por qué elegirnos?</h3>
            <ul className="space-y-3 text-white/90 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#F9DC00] mt-0.5">✓</span>
                <span>ERP completo para gestión de servicios</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F9DC00] mt-0.5">✓</span>
                <span>Facturación electrónica integrada</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F9DC00] mt-0.5">✓</span>
                <span>IA para optimizar tus operaciones</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-8 text-white/80 text-sm">
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
            <a href="#" className="hover:text-white transition-colors">Documentación</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-[#D0323A] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Volver al inicio de sesión</span>
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={logoImage} alt="iWA SmartOps" className="h-12 mx-auto mb-4" />
            <h2 className="text-[#D0323A] text-2xl">iWA SmartOps</h2>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">
              Crea tu cuenta
            </h2>
            <p className="text-gray-600">
              Comienza a optimizar tus operaciones hoy
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all`}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all`}
                  placeholder="juan@empresa.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full pl-12 pr-12 py-3.5 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={`w-full pl-12 pr-12 py-3.5 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-gray-300 text-[#D0323A] focus:ring-[#D0323A] focus:ring-2 mt-0.5 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                Acepto los{" "}
                <a href="#" className="text-[#D0323A] hover:text-[#9F2743] transition-colors">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="text-[#D0323A] hover:text-[#9F2743] transition-colors">
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white rounded-xl hover:shadow-lg hover:shadow-[#D0323A]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Crear cuenta
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={onBackToLogin}
                className="text-[#D0323A] hover:text-[#9F2743] transition-colors"
              >
                Iniciar sesión
              </button>
            </p>
          </div>

          {/* Version */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Versión Demo 1.0 • © 2025 iWA SmartOps
          </div>
        </div>
      </div>
    </div>
  );
}
