import React from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { CROP_STATUS_OPTIONS } from "../../data/CropsData";
import CustomDropdown from "../Other/CustomDropdown";

const CropFormModal = React.memo(({ isOpen, onClose, onSubmit, formData, onChange, isLoading, isEditMode }) => {
    if (!isOpen) return null;

    const inputBase =
        "w-full px-4 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50 transition font-medium text-sm";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
            <div className="w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300 font-dm">

                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-8 flex-shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)]" />
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                    <div className="mt-2 relative z-10">
                        <h2 className="font-fraunces text-3xl font-bold text-white">
                            {isEditMode ? "Edit Crop" : "Add New Crop"}
                        </h2>
                        <p className="text-green-100 text-xs font-bold uppercase tracking-[0.15em] mt-2">
                            {isEditMode ? "Update crop details" : "Fill in your crop details"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="overflow-y-auto flex-1 p-8 space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Crop Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Crop Name <span className="text-smart-green-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                placeholder="e.g., Basmati Rice"
                                className={inputBase}
                                required
                            />
                        </div>

                        {/* Variety */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Variety <span className="text-smart-green-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="variety"
                                value={formData.variety}
                                onChange={onChange}
                                placeholder="e.g., Pusa 1121"
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Planted Date */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Planted Date <span className="text-smart-green-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="plantedDate"
                                value={formData.plantedDate}
                                onChange={onChange}
                                className={inputBase}
                                required
                            />
                        </div>

                        {/* Expected Harvest */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Expected Harvest <span className="text-smart-green-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expectedHarvest"
                                value={formData.expectedHarvest}
                                onChange={onChange}
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Moisture */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Moisture Level
                            </label>
                            <input
                                type="text"
                                name="moisture"
                                value={formData.moisture}
                                onChange={onChange}
                                placeholder="e.g., 15%"
                                className={inputBase}
                            />
                        </div>

                        {/* Health Score */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Health Score: <span className="text-smart-green-600 dark:text-smart-green-400">{formData.healthScore}%</span>
                            </label>
                            <input
                                type="range"
                                name="healthScore"
                                min="0"
                                max="100"
                                value={formData.healthScore}
                                onChange={onChange}
                                className="w-full mt-3 accent-smart-green-600"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                            Crop Status
                        </label>
                        <CustomDropdown
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                            options={CROP_STATUS_OPTIONS}
                            required={true}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-4 bg-gray-100 dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-4 bg-smart-green-600 text-white font-bold rounded-2xl hover:bg-smart-green-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={18} /> {isEditMode ? "Updating..." : "Adding..."}</>
                            ) : (
                                <>{isEditMode ? "Update Crop" : "Save New Crop"}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

CropFormModal.displayName = "CropFormModal";
export default CropFormModal;