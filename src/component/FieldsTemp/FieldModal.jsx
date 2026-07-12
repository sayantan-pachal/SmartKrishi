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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div
                ref={modalRef}
                className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300"
            >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-green-600 to-emerald-600 p-8 flex-shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)]" />
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                    <div className="mt-2 relative z-10">
                        <h2 className="font-fraunces text-3xl font-bold text-white leading-tight">{field.name}</h2>
                        <p className="text-green-100 text-xs font-bold uppercase tracking-[0.15em] mt-1">Field Analysis</p>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-8 space-y-8 font-dm">
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Size", value: field.size },
                            { label: "Crop", value: field.crop },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-4 bg-gray-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
                                <p className="font-bold text-[#111] dark:text-gray-100 text-lg">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Soil metrics */}
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">Soil Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {SOIL_METRIC_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* NPK */}
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">NPK Analysis</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {NPK_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* Status & recommendation */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Status</p>
                            <p className="font-bold text-[#111] dark:text-gray-100 flex items-center text-lg">
                                {statusStyle.icon} <span className="ml-2">{statusStyle.label}</span>
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Recommended Action</p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{statusStyle.action}</p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-[11px] font-medium text-gray-400 space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
                        <p>Created: {formatFieldDate(field.$createdAt)}</p>
                        <p>Updated: {formatFieldDate(field.$updatedAt)}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[#111] dark:bg-white dark:text-[#111] text-white font-bold rounded-2xl hover:opacity-80 transition-opacity"
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