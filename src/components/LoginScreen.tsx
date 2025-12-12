import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logoImage from "../assets/logo.png";

interface LoginScreenProps {
  onGoToRegister: () => void;
  onLogin: (email: string) => void;
}

export function LoginScreen({ onGoToRegister, onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
    console.log("Login attempt:", { email, password });
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
            iWA SmartOps
          </h1>
          <p className="text-white/90 text-xl max-w-md">
            Demo Mini ERP de Servicios con Facturación e IA
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-8 text-white/80 text-sm">
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
            <a href="#" className="hover:text-white transition-colors">Documentación</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={logoImage} alt="iWA SmartOps" className="h-12 mx-auto mb-4" />
            <h2 className="text-[#D0323A] text-2xl">iWA SmartOps</h2>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">
              Bienvenid@ de vuelta
            </h2>
            <p className="text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Usuario o correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all"
                  placeholder="usuario@empresa.com"
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent transition-all"
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
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#D0323A] focus:ring-[#D0323A] focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  Recordarme
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-[#D0323A] hover:text-[#9F2743] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white rounded-xl hover:shadow-lg hover:shadow-[#D0323A]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={onGoToRegister}
                className="text-[#D0323A] hover:text-[#9F2743] transition-colors"
              >
                Solicita acceso
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
