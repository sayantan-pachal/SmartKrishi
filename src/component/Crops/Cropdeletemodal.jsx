import React from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

const CropDeleteModal = React.memo(({ isOpen, onConfirm, onCancel, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <div className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200 font-dm">
                <div className="p-8 text-center">
                    <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={28} />
                    </div>
                    <h3 className="font-fraunces text-2xl font-bold text-[#111] dark:text-white mb-2">
                        Delete Crop?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                        Are you sure you want to delete this crop? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-white/[0.03] border border-transparent dark:border-white/5 text-[#111] dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 active:scale-95 text-sm"
                        >
                            {isDeleting ? (
                                <><Loader2 className="animate-spin" size={16} /> Deleting...</>
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

CropDeleteModal.displayName = "CropDeleteModal";
export default CropDeleteModal;