/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Map as MapIcon, Plus, Search, X, Loader2 } from "lucide-react";
import { databases, account, DATABASE_ID, FIELDS_COLLECTION_ID } from "../../appwrite/config";
import { Query } from "appwrite";

import { buildFieldPayload, filterFields } from "../../data/FieldsData";

import FieldCard          from "./FieldCard";
import FieldModal         from "./FieldModal";
import FormFieldModal     from "./FormFieldModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const COLLECTION_ID = FIELDS_COLLECTION_ID;

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
        <div className="min-h-screen bg-smartkrishi-light dark:bg-smartkrishi-dark pt-28 px-4 pb-20">
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