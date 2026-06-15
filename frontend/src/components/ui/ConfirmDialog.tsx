import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDialog = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="mb-8 ml-13">
                    <p className="text-slate-400">{message}</p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
