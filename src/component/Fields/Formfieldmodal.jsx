import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import CustomDropdown from "../Other/CustomDropdown";
import {
    FORM_FIELD_GROUPS,
    FIELD_STATUS_OPTIONS,
    DEFAULT_FORM_DATA,
    validateFieldForm,
    fieldDocToFormData,
} from "../../data/FieldsData";

const FormFieldModal = React.memo(({ isOpen, onClose, onSubmit, initialData = null, isEditMode = false }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(initialData ? fieldDocToFormData(initialData) : DEFAULT_FORM_DATA);
        setErrors({});
    }, [initialData, isOpen]);

    const handleClickOutside = useCallback(
        (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleClickOutside]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFieldForm(formData);
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData(DEFAULT_FORM_DATA);
            setErrors({});
        } catch (error) {
            console.error("Form submit error:", error);
            setErrors({ submit: "Failed to save field. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputBase =
        "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50 transition text-sm";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="relative h-28 bg-gradient-to-r from-green-600 to-emerald-500 p-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    <div className="mt-1">
                        <h2 className="text-xl font-bold text-white">
                            {isEditMode ? "Edit Field" : "Add New Field"}
                        </h2>
                        <p className="text-green-100 text-sm">
                            {isEditMode ? "Update field details" : "Fill in your field details"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{errors.submit}</p>
                        </div>
                    )}

                    {FORM_FIELD_GROUPS.map((group, gi) => (
                        <div key={gi}>
                            {group.heading && (
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    {group.heading}
                                </h3>
                            )}
                            <div className={`grid gap-3 ${group.fields.length === 3 ? "grid-cols-3" : group.fields.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                {group.fields.map((f) => (
                                    <div key={f.name} className={f.colSpan === 2 ? "col-span-full" : ""}>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                                            {f.label} {f.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type={f.type}
                                            name={f.name}
                                            value={formData[f.name]}
                                            onChange={handleChange}
                                            placeholder={f.placeholder}
                                            step={f.step}
                                            disabled={isSubmitting}
                                            className={inputBase}
                                        />
                                        {errors[f.name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                            Status
                        </label>
                        <CustomDropdown
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={FIELD_STATUS_OPTIONS}
                            disabled={isSubmitting}
                            error={errors.status}
                            required={true}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={16} /> Processing…</>
                            ) : (
                                isEditMode ? "Update Field" : "Add Field"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

FormFieldModal.displayName = "FormFieldModal";
export default FormFieldModal;