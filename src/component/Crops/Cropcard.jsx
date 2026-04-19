import React from "react";
import { Droplets, Calendar, Clock, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

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
    if (daysLeft <= 14) return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
    if (daysLeft <= 30) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
};

const CropCard = React.memo(({ crop, onEdit, onDelete }) => (
    <div className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
            {crop.image && (
                <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            )}

            {/* Status badge */}
            <div className="absolute top-4 right-4 flex gap-2">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                    crop.status === "Healthy"
                        ? "bg-green-500/20 text-green-200"
                        : "bg-amber-500/20 text-amber-200"
                }`}>
                    {crop.status === "Healthy" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {crop.status}
                </span>
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(crop.$id)}
                className="absolute top-4 left-4 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                title="Delete crop"
            >
                <Trash2 size={18} />
            </button>

            {/* Edit button */}
            <button
                onClick={() => onEdit(crop)}
                className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 text-xs font-bold"
                title="Edit crop"
            >
                Edit
            </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{crop.name}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">{crop.variety}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Health</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{crop.healthScore}%</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 dark:border-gray-800 mb-4 flex-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Droplets size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Moisture</p>
                        <p className="text-sm font-bold dark:text-white">{crop.moisture || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Harvest In</p>
                        <p className="text-sm font-bold dark:text-white">~{getDaysUntilHarvest(crop.expectedHarvest)} Days</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                        Planted: {new Date(crop.plantedDate).toLocaleDateString()}
                    </span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getHarvestStatusColor(crop.expectedHarvest)}`}>
                    <p className="text-[10px] uppercase font-bold mb-0.5">Harvest</p>
                    <p className="font-bold text-sm">{formatHarvestDate(crop.expectedHarvest)}</p>
                </div>
            </div>
        </div>
    </div>
));

CropCard.displayName = "CropCard";
export default CropCard;