import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Maximize2, Minimize2, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente SmartOps IA. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("factura") || input.includes("facturación")) {
      return "Puedo ayudarte con la facturación. Actualmente tienes 156 facturas generadas este mes. ¿Deseas crear una nueva factura, ver las pendientes o exportar un reporte?";
    }
    if (input.includes("inventario") || input.includes("stock")) {
      return "El inventario muestra 7 productos con stock bajo. Te recomiendo revisar la sección de Inventario para realizar pedidos. ¿Quieres que te muestre los detalles?";
    }
    if (input.includes("cliente") || input.includes("clientes")) {
      return "Tienes 892 clientes activos en el sistema. El último cliente registrado fue Tech Solutions Inc. hace 1 hora. ¿Necesitas buscar o agregar un cliente?";
    }
    if (input.includes("ingreso") || input.includes("ventas") || input.includes("dinero")) {
      return "Los ingresos del mes actual son de $45,280, con un incremento del 8.5% respecto al mes anterior. ¿Deseas ver un análisis detallado o exportar un reporte financiero?";
    }
    if (input.includes("reporte") || input.includes("análisis")) {
      return "Puedo generar reportes de ventas, inventario, clientes o finanzas. ¿Qué tipo de reporte necesitas?";
    }
    if (input.includes("hola") || input.includes("hi") || input.includes("buenos")) {
      return "¡Hola! ¿En qué puedo asistirte hoy? Puedo ayudarte con facturación, inventario, clientes, reportes y más.";
    }
    if (input.includes("gracias") || input.includes("thank")) {
      return "¡De nada! Estoy aquí para ayudarte cuando lo necesites. 😊";
    }
    
    return "Entiendo tu consulta. Puedo ayudarte con facturación, inventario, gestión de clientes, reportes financieros y análisis de datos. ¿Sobre cuál de estos temas necesitas información?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        isExpanded
          ? "bottom-4 right-4 left-4 top-4 md:left-auto md:w-[600px] md:h-[700px]"
          : "bottom-4 right-4 w-[400px] h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#D0323A] to-[#E9540D] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">Asistente SmartOps IA</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/90">En línea</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white"
                  : "bg-white border border-gray-200"
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#F6A016]" />
                  <span className="text-xs text-gray-500">SmartOps IA</span>
                </div>
              )}
              <p className={`text-sm ${message.sender === "user" ? "text-white" : "text-gray-800"}`}>
                {message.text}
              </p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === "user" ? "text-white/70" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F6A016]" />
                <span className="text-xs text-gray-500">SmartOps IA está escribiendo</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#D0323A] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#E9540D] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-[#F6A016] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-200 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Ver facturas", "Estado inventario", "Clientes activos", "Generar reporte"].map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setInputValue(action);
                handleSendMessage();
              }}
              className="flex-shrink-0 px-3 py-1.5 text-xs bg-gradient-to-r from-[#D0323A]/10 to-[#E9540D]/10 text-[#D0323A] rounded-lg hover:from-[#D0323A]/20 hover:to-[#E9540D]/20 transition-all border border-[#D0323A]/20"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0323A] focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white rounded-xl hover:shadow-lg hover:shadow-[#D0323A]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Button Component
interface ChatbotButtonProps {
  onClick: () => void;
  hasNotification?: boolean;
}

export function ChatbotButton({ onClick, hasNotification }: ChatbotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#D0323A]/40 transition-all hover:scale-110 z-40 flex items-center justify-center group"
    >
      <Bot className="w-6 h-6" />
      {hasNotification && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F9DC00] border-2 border-white rounded-full animate-pulse"></span>
      )}
      <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Asistente IA
      </span>
    </button>
  );
}
