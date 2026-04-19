import React from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { CROP_STATUS_OPTIONS } from "../../data/CropsData";
import CustomDropdown from "../Other/CustomDropdown";

const CropFormModal = React.memo(({ isOpen, onClose, onSubmit, formData, onChange, isLoading, isEditMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? "Edit Crop" : "Add New Crop"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <X size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

                    {/* Crop Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Crop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            placeholder="e.g., Basmati Rice"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                            required
                        />
                    </div>

                    {/* Variety */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Variety <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="variety"
                            value={formData.variety}
                            onChange={onChange}
                            placeholder="e.g., Pusa 1121"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                            required
                        />
                    </div>

                    {/* Planted Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Planted Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="plantedDate"
                            value={formData.plantedDate}
                            onChange={onChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                            required
                        />
                    </div>

                    {/* Expected Harvest */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Expected Harvest <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="expectedHarvest"
                            value={formData.expectedHarvest}
                            onChange={onChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                            required
                        />
                    </div>

                    {/* Moisture */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Moisture Level
                        </label>
                        <input
                            type="text"
                            name="moisture"
                            value={formData.moisture}
                            onChange={onChange}
                            placeholder="e.g., 15%"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                        />
                    </div>

                    {/* Health Score */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Health Score (0-100)
                        </label>
                        <input
                            type="range"
                            name="healthScore"
                            min="0"
                            max="100"
                            value={formData.healthScore}
                            onChange={onChange}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formData.healthScore}%</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Status
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
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {isEditMode ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    {isEditMode ? "Update Crop" : "Add Crop"}
                                </>
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