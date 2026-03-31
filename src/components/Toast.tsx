import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow-xl transition-all animate-in slide-in-from-right-full ${
      type === "success" 
        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/80 dark:text-emerald-300 dark:border-emerald-800" 
        : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/80 dark:text-red-300 dark:border-red-800"
    }`}>
      <div className="text-sm font-medium">{message}</div>
      <button 
        onClick={onClose}
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 hover:bg-black/5 inline-flex items-center justify-center h-8 w-8"
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
};
