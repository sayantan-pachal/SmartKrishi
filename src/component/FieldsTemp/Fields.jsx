/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Map as MapIcon, Plus, Search, X, Loader2 } from "lucide-react";
import { databases, ID, account, DATABASE_ID, FIELDS_COLLECTION_ID } from "../../appwrite/config";

import { buildFieldPayload, filterFields } from "../../data/FieldsData";
import { PageBackground, Reveal } from "../DashTemp/DashboardComponents"; // Assumes DashboardComponents is accessible here

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

    // Auth Lookups
    useEffect(() => {
        account.get()
            .then((u) => setUserId(u.userId || u.$id))
            .catch(() => setError("Please log in to view your fields."));
    }, []);

    // Fetch fields
    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
                setFields(res.documents);
            } catch (err) {
                setError("Failed to load fields. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId]);

    // Delete handling
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

    // Add / Edit handling
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
            const generatedId = ID.unique();
            const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, generatedId, payload);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm flex items-center justify-center pt-28">
                <div className="text-center">
                    <div className="inline-flex p-6 bg-smart-green-50 dark:bg-smart-green-900/20 rounded-full mb-5">
                        <Loader2 className="w-10 h-10 text-smart-green-600 animate-spin" />
                    </div>
                    <p className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2">Loading your fields</p>
                    <p className="text-sm text-gray-400">Fetching latest field data…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-[#111] dark:text-gray-100 pt-24 pb-24 transition-colors duration-300">
            <PageBackground />
            
            <div className="relative max-w-7xl mx-auto px-6">
                
                {/* ── Page header ── */}
                <div className="mb-10" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 mb-3 block">
                        Farm Management
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
                        <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
                            My <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent ml-2">Fields</em>
                            <MapIcon className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-3" />
                        </h1>
                        <button
                            onClick={handleAddNew}
                            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm"
                        >
                            <Plus size={18} />
                            Add New Field
                        </button>
                    </div>
                    <p className="text-md font-medium text-gray-400 mt-2 shrink-0">
                        Manage, monitor, and optimize your land performance
                    </p>
                </div>

                {error && (
                    <Reveal>
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start justify-between gap-4">
                            <p className="text-red-600 dark:text-red-400 font-medium text-sm">{error}</p>
                            <button onClick={() => setError(null)} className="w-6 h-6 text-red-400 hover:text-red-600 flex-shrink-0 bg-red-100 dark:bg-red-900/20 p-1 rounded-full">
                                <X size={14} />
                            </button>
                        </div>
                    </Reveal>
                )}

                {/* ── Search Bar ── */}
                <div className="relative mb-8" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by field name or crop…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-2xl shadow-sm focus:ring-2 focus:ring-smart-green-500 outline-none dark:text-white text-sm transition-all placeholder:text-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* ── Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFields.map((field, i) => (
                        <Reveal key={field.$id} delay={i * 60}>
                            <FieldCard
                                field={field}
                                onViewDetails={setSelectedField}
                                onEdit={handleEdit}
                                onDelete={(id) => handleDeleteClick(id, field.name)}
                            />
                        </Reveal>
                    ))}

                    {filteredFields.length === 0 && (
                        <div className="col-span-full py-24 text-center">
                            <div className="inline-flex p-6 bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-full mb-4">
                                <MapIcon size={40} className="text-gray-300 dark:text-gray-700" />
                            </div>
                            <h3 className="font-fraunces font-bold text-2xl mb-2">No Fields Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchTerm ? "We couldn't find any fields matching your search." : "You haven't added any fields yet. Click 'Add New Field' to start."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

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

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default Fields;