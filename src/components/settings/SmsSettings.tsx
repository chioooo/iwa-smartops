import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

import type { SmsStatusResponse } from '../../services/sms/sms.types';
import { fetchSmsStatus } from '../../services/sms/smsService';

export function SmsSettings() {
  const [status, setStatus] = useState<SmsStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSmsStatus();
      setStatus(result);
    } catch (e) {
      setError('No se pudo obtener el estado del servicio SMS.');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getFlagIcon = (flag: SmsStatusResponse['flag']) => {
    switch (flag) {
      case 'green':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'yellow':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'red':
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getFlagBgColor = (flag: SmsStatusResponse['flag']) => {
    switch (flag) {
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      case 'red':
        return 'bg-red-50 border-red-200';
    }
  };

  const getFlagTextColor = (flag: SmsStatusResponse['flag']) => {
    switch (flag) {
      case 'green':
        return 'text-green-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'red':
        return 'text-red-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Configuración SMS</h2>
          <p className="text-sm text-gray-600 mt-1">
            Estado de la conexión con el servicio de mensajería SMS (Pushbullet)
          </p>
        </div>
        <button
          type="button"
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Verificar estado
        </button>
      </div>

      {/* Estado del servicio */}
      {loading && !status && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Verificando estado del servicio...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {status && (
        <div className="space-y-6">
          {/* Estado general */}
          <div className={`rounded-lg border p-4 ${getFlagBgColor(status.flag)}`}>
            <div className="flex items-center gap-3">
              {getFlagIcon(status.flag)}
              <div>
                <p className={`font-medium ${getFlagTextColor(status.flag)}`}>
                  {status.status}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Estado general del servicio SMS
                </p>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usuario/Token */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Estado del Token</span>
              </div>
              <p className={`text-sm ${status.user === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                {status.user === 'ok' ? 'Token válido' : status.user}
              </p>
            </div>

            {/* Dispositivo */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Estado del Dispositivo</span>
              </div>
              <p className={`text-sm ${status.device === 'ok' ? 'text-green-600' : 'text-yellow-600'}`}>
                {status.device === 'ok' ? 'Dispositivo encontrado' : status.device}
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Este servicio utiliza una API externa para enviar mensajes SMS.
              Asegúrate de tener configurado correctamente el token de acceso y el dispositivo objetivo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
