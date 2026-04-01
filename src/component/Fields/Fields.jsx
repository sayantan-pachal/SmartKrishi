/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Map as MapIcon,
    Plus,
    Droplets,
    FlaskConical,
    Navigation,
    Trash2,
    Search,
    X,
    Calendar,
    Activity,
    Edit
} from "lucide-react";
import { databases } from "../../appwrite/config";

const DATABASE_ID = "69cd3978001f602e83b7";
const COLLECTION_ID = "fields";

// Memoized Detail Card Component
const DetailCard = React.memo(({ icon: Icon, label, value, color, bg }) => (
    <div className={`${bg} dark:bg-opacity-10 p-4 rounded-2xl flex flex-col items-start gap-1`}>
        <Icon size={18} className={color} />
        <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
));

DetailCard.displayName = "DetailCard";

// Memoized Field Card Component
const FieldCard = React.memo(({ field, onViewDetails, onEdit, onDelete }) => (
    <div className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        {/* Status Badge */}
        <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                field.status === "Healthy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }`}
        >
            {field.status}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{field.name}</h3>
        <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
            <Navigation size={14} /> {field.size} • Current: {field.crop}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Droplets size={16} />
                    <span className="text-xs font-bold uppercase">Moisture</span>
                </div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{field.moisture}</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                    <FlaskConical size={16} />
                    <span className="text-xs font-bold uppercase">Soil PH</span>
                </div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{field.ph}</p>
            </div>
        </div>

        <div className="flex items-center justify-between gap-3">
            <button
                onClick={() => onViewDetails(field)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
            >
                View Details
            </button>
            <button
                onClick={() => onEdit(field)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Edit field"
            >
                <Edit size={20} />
            </button>
            <button
                onClick={() => onDelete(field.$id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete field"
            >
                <Trash2 size={20} />
            </button>
        </div>
    </div>
));

FieldCard.displayName = "FieldCard";

// Modal Component
const FieldModal = React.memo(({ field, isOpen, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, onClose]);

    if (!isOpen || !field) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]"
            >
                {/* Modal Header */}
                <div className="relative h-32 bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mt-4">{field.name}</h2>
                    <p className="text-green-50 text-sm">Detailed Field Analysis</p>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto flex-1">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <DetailCard
                                icon={Droplets}
                                label="Moisture"
                                value={field.moisture}
                                color="text-blue-500"
                                bg="bg-blue-50"
                            />
                            <DetailCard
                                icon={FlaskConical}
                                label="Soil PH"
                                value={field.ph}
                                color="text-purple-500"
                                bg="bg-purple-50"
                            />
                            <DetailCard
                                icon={Activity}
                                label="Nitrogen"
                                value={field.nitrogen}
                                color="text-orange-500"
                                bg="bg-orange-50"
                            />
                            <DetailCard
                                icon={Calendar}
                                label="Last Test"
                                value={field.lastTested}
                                color="text-gray-500"
                                bg="bg-gray-50"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Recommended Action
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {field.status === "Healthy"
                                        ? "Maintain current irrigation schedule. No immediate action required."
                                        : "Increase water supply by 20% over the next 48 hours to reach optimal moisture."}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
                        >
                            Close Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

FieldModal.displayName = "FieldModal";

// Add/Edit Field Form Modal
const FormFieldModal = React.memo(({ isOpen, onClose, onSubmit, initialData = null, isEditMode = false }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        size: "",
        crop: "",
        moisture: "",
        ph: "",
        nitrogen: "Optimal",
        status: "Healthy",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                size: initialData.size.replace(" Acres", ""),
                crop: initialData.crop,
                moisture: initialData.moisture.replace("%", ""),
                ph: initialData.ph,
                nitrogen: initialData.nitrogen,
                status: initialData.status,
            });
        } else {
            setFormData({
                name: "",
                size: "",
                crop: "",
                moisture: "",
                ph: "",
                nitrogen: "Optimal",
                status: "Healthy",
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, handleClickOutside]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Field name is required";
        if (!formData.size.trim()) newErrors.size = "Size is required";
        if (!formData.crop.trim()) newErrors.crop = "Crop type is required";
        if (!formData.moisture.trim()) newErrors.moisture = "Moisture level is required";
        if (!formData.ph.trim()) newErrors.ph = "Soil PH is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
                setFormData({
                    name: "",
                    size: "",
                    crop: "",
                    moisture: "",
                    ph: "",
                    nitrogen: "Optimal",
                    status: "Healthy",
                });
                setErrors({});
            } catch (error) {
                console.error("Error submitting form:", error);
                setErrors({ submit: "Failed to submit form. Please try again." });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]"
            >
                {/* Modal Header */}
                <div className="relative h-32 bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        aria-label="Close modal"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mt-4">
                        {isEditMode ? "Edit Field" : "Add New Field"}
                    </h2>
                    <p className="text-green-50 text-sm">
                        {isEditMode ? "Update the details of your field" : "Fill in the details of your field"}
                    </p>
                </div>

                {/* Modal Body - Scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                    <div className="p-8 space-y-4">
                        {errors.submit && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{errors.submit}</p>
                            </div>
                        )}

                        {/* Field Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Field Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., North Paddy Square"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Size and Crop */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Size (Acres)
                                </label>
                                <input
                                    type="number"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    placeholder="e.g., 2.5"
                                    step="0.1"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                />
                                {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Crop Type
                                </label>
                                <input
                                    type="text"
                                    name="crop"
                                    value={formData.crop}
                                    onChange={handleChange}
                                    placeholder="e.g., Rice"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                />
                                {errors.crop && <p className="text-red-500 text-xs mt-1">{errors.crop}</p>}
                            </div>
                        </div>

                        {/* Moisture and PH */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Moisture (%)
                                </label>
                                <input
                                    type="number"
                                    name="moisture"
                                    value={formData.moisture}
                                    onChange={handleChange}
                                    placeholder="e.g., 45"
                                    min="0"
                                    max="100"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                />
                                {errors.moisture && <p className="text-red-500 text-xs mt-1">{errors.moisture}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Soil PH
                                </label>
                                <input
                                    type="number"
                                    name="ph"
                                    value={formData.ph}
                                    onChange={handleChange}
                                    placeholder="e.g., 6.5"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                />
                                {errors.ph && <p className="text-red-500 text-xs mt-1">{errors.ph}</p>}
                            </div>
                        </div>

                        {/* Nitrogen Level and Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Nitrogen Level
                                </label>
                                <select
                                    name="nitrogen"
                                    value={formData.nitrogen}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Optimal">Optimal</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50"
                                >
                                    <option value="Healthy">Healthy</option>
                                    <option value="Needs Water">Needs Water</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : isEditMode ? "Update Field" : "Add Field"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
});

FormFieldModal.displayName = "FormFieldModal";

// Main Fields Component
function Fields() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedField, setSelectedField] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch fields from Appwrite
    useEffect(() => {
        const fetchFields = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID
                );
                setFields(response.documents);
            } catch (err) {
                console.error("Error fetching fields:", err.message);
                setError("Failed to load fields. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, []);

    const deleteField = useCallback(async (fieldId) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                fieldId
            );
            setFields((prevFields) => prevFields.filter((field) => field.$id !== fieldId));
        } catch (err) {
            console.error("Error deleting field:", err.message);
            setError("Failed to delete field. Please try again.");
        }
    }, []);

    const handleAddField = useCallback(async (formData) => {
        try {
            if (editingField) {
                // Update existing field
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    editingField.$id,
                    {
                        name: formData.name,
                        size: `${formData.size} Acres`,
                        crop: formData.crop,
                        moisture: `${formData.moisture}%`,
                        ph: formData.ph,
                        status: formData.status,
                        nitrogen: formData.nitrogen,
                    }
                );

                setFields((prevFields) =>
                    prevFields.map((field) =>
                        field.$id === editingField.$id
                            ? {
                                ...field,
                                name: formData.name,
                                size: `${formData.size} Acres`,
                                crop: formData.crop,
                                moisture: `${formData.moisture}%`,
                                ph: formData.ph,
                                status: formData.status,
                                nitrogen: formData.nitrogen,
                            }
                            : field
                    )
                );
                setEditingField(null);
            } else {
                // Add new field
                const newFieldData = {
                    name: formData.name,
                    size: `${formData.size} Acres`,
                    crop: formData.crop,
                    moisture: `${formData.moisture}%`,
                    ph: formData.ph,
                    status: formData.status,
                    nitrogen: formData.nitrogen,
                    lastTested: new Date().toISOString().split("T")[0],
                };

                const response = await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    "unique()",
                    newFieldData
                );

                setFields((prevFields) => [response, ...prevFields]);
            }
            setIsFormModalOpen(false);
        } catch (err) {
            console.error("Error saving field:", err.message);
            setError("Failed to save field. Please try again.");
        }
    }, [editingField]);

    const handleEditField = useCallback((field) => {
        setEditingField(field);
        setIsFormModalOpen(true);
    }, []);

    const handleAddNewField = useCallback(() => {
        setEditingField(null);
        setIsFormModalOpen(true);
    }, []);

    const filteredFields = fields.filter(
        (field) =>
            field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.crop.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-32 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex p-6 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <MapIcon size={48} className="text-green-600 dark:text-green-400 animate-spin" />
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-bold text-xl">Loading Fields...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-28 px-4 pb-20">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <MapIcon className="text-green-600" /> My Fields
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and monitor your land performance
                        </p>
                    </div>

                    <button
                        onClick={handleAddNewField}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add New Field
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                        <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 dark:text-red-400 text-sm underline mt-2 hover:no-underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or crop..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                    />
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFields.map((field) => (
                        <FieldCard
                            key={field.$id}
                            field={field}
                            onViewDetails={setSelectedField}
                            onEdit={handleEditField}
                            onDelete={deleteField}
                        />
                    ))}

                    {filteredFields.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
                                <MapIcon size={48} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                {searchTerm ? "No fields found matching your search." : "No fields yet. Create one to get started!"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
            <FormFieldModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingField(null);
                }}
                onSubmit={handleAddField}
                initialData={editingField}
                isEditMode={!!editingField}
            />
        </div>
    );
}

export default Fields;