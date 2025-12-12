import { X, AlertTriangle } from "lucide-react";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({
                                 open,
                                 title,
                                 message,
                                 confirmLabel = "Confirmar",
                                 cancelLabel = "Cancelar",
                                 onConfirm,
                                 onCancel,
                             }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] px-6 py-5 text-white flex items-center justify-between">
                    <h2 className="text-white text-lg">{title}</h2>

                    <button
                        onClick={onCancel}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center text-center">
                    <AlertTriangle className="w-12 h-12 text-[#D0323A] mb-4" />

                    <p className="text-gray-700 text-base">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-[#D0323A] text-white rounded-lg hover:bg-[#9F2743] transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
