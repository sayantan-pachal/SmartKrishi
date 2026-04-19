import React from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

const CropDeleteModal = React.memo(({ isOpen, onConfirm, onCancel, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        Delete Crop?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Are you sure you want to delete this crop? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

CropDeleteModal.displayName = "CropDeleteModal";
export default CropDeleteModal;