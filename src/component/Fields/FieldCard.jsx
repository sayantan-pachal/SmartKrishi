/* eslint-disable no-unused-vars */
import React from "react";
import { Navigation, Leaf, Edit, Trash2 } from "lucide-react";
import { SOIL_METRIC_CARDS, getStatusStyle } from "../../data/FieldsData";

const FieldCard = React.memo(({ field, onViewDetails, onEdit, onDelete }) => {
    const statusStyle = getStatusStyle(field.status);

    return (
        <div className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
            {/* Status badge */}
            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.badge}`}>
                {field.status}
            </span>

            {/* Field name + size */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 pr-28 leading-tight">
                {field.name}
            </h3>
            <p className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
                <Navigation size={13} />
                <span>{field.size}</span>
                <span className="mx-1 text-gray-300">·</span>
                <Leaf size={13} className="text-green-500" />
                <span>{field.crop}</span>
            </p>

            {/* Soil metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                {SOIL_METRIC_CARDS.map(({ key, label, icon: Icon, iconClass, bg, darkBg }) => (
                    <div key={key} className={`${bg} ${darkBg} p-3 rounded-2xl`}>
                        <div className={`flex items-center gap-1.5 ${iconClass} mb-1`}>
                            <Icon size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
                        </div>
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                            {field[key] || "N/A"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onViewDetails(field)}
                    className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 text-gray-600 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors border border-gray-100 dark:border-gray-700"
                >
                    View Details
                </button>
                <button
                    onClick={() => onEdit(field)}
                    className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                    aria-label="Edit field"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => onDelete(field.$id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    aria-label="Delete field"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
});

FieldCard.displayName = "FieldCard";
export default FieldCard;