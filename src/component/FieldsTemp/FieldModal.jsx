import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
    SOIL_METRIC_CARDS,
    NPK_CARDS,
    getStatusStyle,
    formatFieldDate,
} from "../../data/FieldsData";
import DetailCard from "./DetailCard";

const FieldModal = React.memo(({ field, isOpen, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onClose]);

    if (!isOpen || !field) return null;

    const statusStyle = getStatusStyle(field.status);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-green-600 to-emerald-500 p-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    <div className="mt-3">
                        <h2 className="text-2xl font-bold text-white leading-tight">{field.name}</h2>
                        <p className="text-green-100 text-sm mt-0.5">Field Analysis</p>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Size", value: field.size },
                            { label: "Crop", value: field.crop },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Soil metrics */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Soil Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {SOIL_METRIC_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* NPK */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">NPK Analysis</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {NPK_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* Status & recommendation */}
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                {statusStyle.icon} {statusStyle.label}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended Action</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{statusStyle.action}</p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-400 space-y-0.5 pt-1">
                        <p>Created: {formatFieldDate(field.$createdAt)}</p>
                        <p>Updated: {formatFieldDate(field.$updatedAt)}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-900 dark:bg-white dark:text-black text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
});

FieldModal.displayName = "FieldModal";
export default FieldModal;