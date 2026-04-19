/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { CircleCheck, CircleX } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: "", type: null, visible: false });

    const showToast = useCallback((message, type = "error") => {
        setToast({ message, type, visible: true });

        // Auto-hide after 4 seconds
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}

            {/* Global Toast UI */}
            {toast.visible && (
                <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-2xl font-semibold animate-toastDrop text-white flex items-center gap-2
                ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-[linear-gradient(90deg,#f53123,#60a5fa)]"}`}>
                    {toast.type === "success" ? (
                        <CircleCheck className="w-5 h-5 text-white" />
                    ) : (
                        <CircleX className="w-5 h-5 text-white" />
                    )} {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};

// Custom Hook for easy access
export const useToast = () => useContext(ToastContext);