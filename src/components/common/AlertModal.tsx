import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type Props = {
  open: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
};

const iconMap: Record<AlertType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<AlertType, { icon: string; button: string; buttonHover: string }> = {
  success: {
    icon: 'text-green-500',
    button: 'bg-green-500',
    buttonHover: 'hover:bg-green-600',
  },
  error: {
    icon: 'text-red-500',
    button: 'bg-red-500',
    buttonHover: 'hover:bg-red-600',
  },
  warning: {
    icon: 'text-yellow-500',
    button: 'bg-yellow-500',
    buttonHover: 'hover:bg-yellow-600',
  },
  info: {
    icon: 'text-blue-500',
    button: 'bg-blue-500',
    buttonHover: 'hover:bg-blue-600',
  },
};

export function AlertModal({
  open,
  type = 'info',
  title,
  message,
  buttonLabel = 'Aceptar',
  onClose,
}: Props) {
  if (!open) return null;

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          <Icon className={`w-16 h-16 ${colors.icon} mb-4`} />
          <p className="text-gray-700 text-base">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className={`w-full px-4 py-3 ${colors.button} ${colors.buttonHover} text-white rounded-lg transition-colors font-medium`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
