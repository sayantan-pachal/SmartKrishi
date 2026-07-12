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
        "w-full px-4 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white disabled:opacity-50 transition font-medium text-sm";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div
                ref={modalRef}
                className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300 font-dm"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-8 flex-shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)]" />
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                    <div className="mt-2 relative z-10">
                        <h2 className="font-fraunces text-3xl font-bold text-white">
                            {isEditMode ? "Edit Field" : "Add New Field"}
                        </h2>
                        <p className="text-green-100 text-xs font-bold uppercase tracking-[0.15em] mt-2">
                            {isEditMode ? "Update field details" : "Fill in your field details"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-8 space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-bold">{errors.submit}</p>
                        </div>
                    )}

                    {FORM_FIELD_GROUPS.map((group, gi) => (
                        <div key={gi} className="mb-6">
                            {group.heading && (
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">
                                    {group.heading}
                                </h3>
                            )}
                            <div className={`grid gap-4 ${group.fields.length === 3 ? "grid-cols-3" : group.fields.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                {group.fields.map((f) => (
                                    <div key={f.name} className={f.colSpan === 2 ? "col-span-full" : ""}>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                            {f.label} {f.required && <span className="text-smart-green-500">*</span>}
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
                                            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors[f.name]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Status */}
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                            Field Status
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
                    <div className="flex gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-gray-100 dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-smart-green-600 text-white font-bold rounded-2xl hover:bg-smart-green-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={18} /> Processing…</>
                            ) : (
                                isEditMode ? "Update Field" : "Save New Field"
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