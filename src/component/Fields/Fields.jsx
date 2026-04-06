/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Map as MapIcon, Plus, Droplets, FlaskConical,
    Navigation, Trash2, Search, X, Calendar,
    Activity, Edit, AlertCircle, Loader2, Leaf,
} from "lucide-react";
import { databases, account, DATABASE_ID, FIELDS_COLLECTION_ID } from "../../appwrite/config";
import { Query } from "appwrite";

import {
    SOIL_METRIC_CARDS,
    NPK_CARDS,
    FIELD_STATUS_OPTIONS,
    FORM_FIELD_GROUPS,
    DEFAULT_FORM_DATA,
    getStatusStyle,
    validateFieldForm,
    buildFieldPayload,
    fieldDocToFormData,
    filterFields,
    formatFieldDate,
} from "../../data/FieldsData";

const COLLECTION_ID = FIELDS_COLLECTION_ID;


// ─── DetailCard ───────────────────────────────────────────────────────────────
const DetailCard = React.memo(({ icon: Icon, label, value, iconColor, bg }) => (
    <div className={`${bg} dark:bg-opacity-10 p-4 rounded-2xl flex flex-col gap-1.5`}>
        <Icon size={16} className={iconColor} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-base font-bold text-gray-800 dark:text-gray-200">{value || "N/A"}</span>
    </div>
));
DetailCard.displayName = "DetailCard";


// ─── FieldCard ────────────────────────────────────────────────────────────────
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


// ─── FieldModal ───────────────────────────────────────────────────────────────
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-green-600 to-emerald-500 p-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    <div className="mt-3">
                        <h2 className="text-2xl font-bold text-white leading-tight">{field.name}</h2>
                        <p className="text-green-100 text-sm mt-0.5">Field Analysis</p>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Size", value: field.size },
                            { label: "Crop", value: field.crop },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Soil metrics */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Soil Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {SOIL_METRIC_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* NPK */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">NPK Analysis</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {NPK_CARDS.map((m) => (
                                <DetailCard key={m.key} icon={m.icon} label={m.label} value={field[m.key]} iconColor={m.iconColor} bg={m.bg} />
                            ))}
                        </div>
                    </div>

                    {/* Status & recommendation */}
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                {statusStyle.icon} {statusStyle.label}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended Action</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{statusStyle.action}</p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-400 space-y-0.5 pt-1">
                        <p>Created: {formatFieldDate(field.$createdAt)}</p>
                        <p>Updated: {formatFieldDate(field.$updatedAt)}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-900 dark:bg-white dark:text-black text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
});
FieldModal.displayName = "FieldModal";


// ─── DeleteConfirmModal ───────────────────────────────────────────────────────
const DeleteConfirmModal = React.memo(({ isOpen, fieldName, onConfirm, onCancel, isDeleting }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onCancel();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-200"
            >
                <div className="p-8 text-center">
                    <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Field?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Delete <span className="font-semibold">"{fieldName}"</span>?
                    </p>
                    <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <><Loader2 className="animate-spin" size={16} /> Deleting…</>
                            ) : (
                                <><Trash2 size={16} /> Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});
DeleteConfirmModal.displayName = "DeleteConfirmModal";


// ─── FormFieldModal ───────────────────────────────────────────────────────────
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
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className={inputBase}
                        >
                            {FIELD_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
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


// ─── Fields (main) ────────────────────────────────────────────────────────────
function Fields() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedField, setSelectedField] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Auth
    useEffect(() => {
        account.get()
            .then((u) => setUserId(u.$id))
            .catch(() => setError("Please log in to view your fields."));
    }, []);

    // Fetch fields
    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                    Query.equal("userId", userId),
                ]);
                setFields(res.documents);
            } catch (err) {
                setError("Failed to load fields. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId]);

    // Delete
    const handleDeleteClick = useCallback((fieldId, fieldName) => {
        setDeleteConfirm({ fieldId, fieldName });
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteConfirm) return;
        setIsDeleting(true);
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, deleteConfirm.fieldId);
            setFields((prev) => prev.filter((f) => f.$id !== deleteConfirm.fieldId));
            setDeleteConfirm(null);
        } catch {
            setError("Failed to delete field. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }, [deleteConfirm]);

    // Add / Edit
    const handleSaveField = useCallback(async (formData) => {
        if (!userId) { setError("User not authenticated."); return; }

        if (editingField) {
            const payload = buildFieldPayload(formData);
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, editingField.$id, payload);
            setFields((prev) =>
                prev.map((f) => (f.$id === editingField.$id ? { ...f, ...payload } : f))
            );
            setEditingField(null);
        } else {
            const payload = buildFieldPayload(formData, userId);
            const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", payload);
            setFields((prev) => [doc, ...prev]);
        }
        setIsFormOpen(false);
    }, [editingField, userId]);

    const handleEdit = useCallback((field) => {
        setEditingField(field);
        setIsFormOpen(true);
    }, []);

    const handleAddNew = useCallback(() => {
        setEditingField(null);
        setIsFormOpen(true);
    }, []);

    const filteredFields = filterFields(fields, searchTerm);

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-32 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex p-5 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <Loader2 size={36} className="text-green-600 dark:text-green-400 animate-spin" />
                    </div>
                    <p className="text-green-700 dark:text-green-400 font-semibold">Loading fields…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-28 px-4 pb-20">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <MapIcon className="text-green-600" size={28} />
                            My Fields
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage and monitor your land performance
                        </p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-md shadow-green-200 dark:shadow-none transition-all active:scale-95 text-sm"
                    >
                        <Plus size={18} />
                        Add New Field
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start justify-between gap-4">
                        <p className="text-red-600 dark:text-red-400 font-semibold text-sm">{error}</p>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Search */}
                <div className="relative mb-7">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by field name or crop…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white text-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFields.map((field) => (
                        <FieldCard
                            key={field.$id}
                            field={field}
                            onViewDetails={setSelectedField}
                            onEdit={handleEdit}
                            onDelete={(id) => handleDeleteClick(id, field.name)}
                        />
                    ))}

                    {filteredFields.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="inline-flex p-5 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
                                <MapIcon size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm
                                    ? "No fields match your search."
                                    : "No fields yet. Add one to get started!"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <FieldModal
                field={selectedField}
                isOpen={!!selectedField}
                onClose={() => setSelectedField(null)}
            />
            <FormFieldModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingField(null); }}
                onSubmit={handleSaveField}
                initialData={editingField}
                isEditMode={!!editingField}
            />
            <DeleteConfirmModal
                isOpen={!!deleteConfirm}
                fieldName={deleteConfirm?.fieldName}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm(null)}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default Fields;