/* eslint-disable no-unused-vars */
import React from "react";
import { Navigation, Leaf, Edit, Trash2 } from "lucide-react";
import { SOIL_METRIC_CARDS, getStatusStyle } from "../../data/FieldsData";

const FieldCard = React.memo(({ field, onViewDetails, onEdit, onDelete }) => {
    const statusStyle = getStatusStyle(field.status);

    return (
        <div className="group relative bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-[2rem] p-6 hover:border-smart-green-300 dark:hover:border-smart-green-800 hover:shadow-xl hover:shadow-smart-green-900/5 transition-all duration-300 overflow-hidden flex flex-col h-full">
            
            {/* Status badge */}
            <span className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${statusStyle.badge}`}>
                {field.status}
            </span>

            {/* Field name + size */}
            <h3 className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2 pr-24 leading-tight">
                {field.name}
            </h3>
            
            <p className="text-xs font-semibold text-gray-400 mb-6 flex items-center gap-2">
                <Navigation size={14} className="text-gray-300 dark:text-gray-600" />
                <span>{field.size}</span>
                <span className="text-gray-200 dark:text-gray-800">•</span>
                <Leaf size={14} className="text-smart-green-500" />
                <span>{field.crop}</span>
            </p>

            {/* Soil metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                {SOIL_METRIC_CARDS.map(({ key, label, icon: Icon, iconClass, bg, darkBg }) => (
                    <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${darkBg}`}>
                            <Icon size={14} className={iconClass} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                            <p className="text-sm font-bold text-[#111] dark:text-white">
                                {field[key] || "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                <button
                    onClick={() => onViewDetails(field)}
                    className="flex-1 py-3 bg-gray-50 dark:bg-white/[0.03] hover:bg-smart-green-50 dark:hover:bg-smart-green-900/20 hover:text-smart-green-700 dark:hover:text-smart-green-400 text-[#111] dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-black/5 dark:border-white/5"
                >
                    View Details
                </button>
                <button
                    onClick={() => onEdit(field)}
                    className="p-3 text-gray-400 bg-gray-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition-all"
                    aria-label="Edit field"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(field.$id)}
                    className="p-3 text-gray-400 bg-gray-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 rounded-xl transition-all"
                    aria-label="Delete field"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
});

FieldCard.displayName = "FieldCard";
export default FieldCard;