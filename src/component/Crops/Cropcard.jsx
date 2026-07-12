/* eslint-disable no-unused-vars */
import React from "react";
import { Droplets, Calendar, Clock, CheckCircle2, AlertCircle, Trash2, Edit } from "lucide-react";

const getDaysUntilHarvest = (harvestDate) => {
    const today = new Date();
    const harvest = new Date(harvestDate);
    const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
};

const formatHarvestDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getHarvestStatusColor = (harvestDate) => {
    const daysLeft = getDaysUntilHarvest(harvestDate);
    if (daysLeft <= 14) return "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30 text-orange-600 dark:text-orange-400";
    if (daysLeft <= 30) return "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30 text-yellow-600 dark:text-yellow-400";
    return "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400";
};

const CropCard = React.memo(({ crop, onEdit, onDelete }) => (
    <div className="group relative bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-[2rem] hover:border-smart-green-300 dark:hover:border-smart-green-800 hover:shadow-xl hover:shadow-smart-green-900/5 transition-all duration-300 overflow-hidden flex flex-col h-full font-dm">
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
            {crop.image && (
                <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            )}

            {/* Status badge */}
            <div className="absolute top-5 right-5 flex gap-2">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md ${
                    crop.status === "Healthy"
                        ? "bg-emerald-500/90 dark:bg-emerald-500/20 text-white dark:text-emerald-300 shadow-sm"
                        : "bg-amber-500/90 dark:bg-amber-500/20 text-white dark:text-amber-300 shadow-sm"
                }`}>
                    {crop.status === "Healthy" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {crop.status}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-1 leading-tight">{crop.name}</h3>
                    <p className="text-xs font-semibold text-smart-green-600 dark:text-smart-green-500 uppercase tracking-widest">{crop.variety}</p>
                </div>
                <div className="text-right bg-gray-50/50 dark:bg-white/[0.02] px-3 py-2 rounded-xl border border-black/5 dark:border-white/5">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Health</p>
                    <p className={`text-lg font-bold ${crop.healthScore >= 80 ? 'text-emerald-500' : crop.healthScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                        {crop.healthScore}%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                        <Droplets size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Moisture</p>
                        <p className="text-sm font-bold text-[#111] dark:text-white">{crop.moisture || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-500">
                        <Clock size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Harvest In</p>
                        <p className="text-sm font-bold text-[#111] dark:text-white">{getDaysUntilHarvest(crop.expectedHarvest)} Days</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[11px] font-bold tracking-wide">
                        Planted: {new Date(crop.plantedDate).toLocaleDateString()}
                    </span>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border ${getHarvestStatusColor(crop.expectedHarvest)}`}>
                    <p className="text-[9px] uppercase font-bold tracking-widest mb-0.5 opacity-80">Harvest</p>
                    <p className="font-bold text-xs">{formatHarvestDate(crop.expectedHarvest)}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                <button
                    onClick={() => onEdit(crop)}
                    className="flex-1 py-3 bg-gray-50 dark:bg-white/[0.03] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 text-[#111] dark:text-gray-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2"
                >
                    <Edit size={14} /> Edit Crop
                </button>
                <button
                    onClick={() => onDelete(crop.$id)}
                    className="p-3 text-gray-400 bg-gray-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 rounded-xl transition-all"
                    aria-label="Delete crop"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
));

CropCard.displayName = "CropCard";
export default CropCard;