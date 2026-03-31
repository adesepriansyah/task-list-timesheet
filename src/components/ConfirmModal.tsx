import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "warning" | "info" | "danger";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel",
  type = "info"
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
      case "warning":
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
      default:
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    }
  };

  const getThemeClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-500";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-500";
      default:
        return "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-500";
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 shadow-red-500/20";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20";
      default:
        return "bg-zinc-900 dark:bg-orange-500 hover:scale-105 shadow-orange-500/10";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className={`flex items-start gap-4 p-5 rounded-2xl border ${getThemeClass()}`}>
          <div className="mt-1 flex-shrink-0">
            {getIcon()}
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-bold text-sm">
            {message}
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onConfirm} 
            className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 ${getButtonClass()}`}
          >
            {confirmLabel}
          </Button>
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
