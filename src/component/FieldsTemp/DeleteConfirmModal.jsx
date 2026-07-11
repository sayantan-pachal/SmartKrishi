import React, { useEffect, useRef } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

const DeleteConfirmModal = React.memo(({ isOpen, fieldName, onConfirm, onCancel, isDeleting }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onCancel();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-200"
            >
                <div className="p-8 text-center">
                    <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Field?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Delete <span className="font-semibold">"{fieldName}"</span>?
                    </p>
                    <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <><Loader2 className="animate-spin" size={16} /> Deleting…</>
                            ) : (
                                <><Trash2 size={16} /> Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

DeleteConfirmModal.displayName = "DeleteConfirmModal";
export default DeleteConfirmModal;