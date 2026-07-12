import React, { useState, useEffect } from "react";
import { Sprout, Search, Plus, X, Loader2 } from "lucide-react";
import { databases, ID, account, DATABASE_ID, CROPS_COLLECTION_ID } from "../../appwrite/config";
import { DEFAULT_CROP_FORM, DEFAULT_CROP_IMAGE } from "../../data/CropsData";

import { PageBackground, Reveal } from "../DashTemp/DashboardComponents";
import CropCard        from "./Cropcard";
import CropFormModal   from "./Cropformmodal";
import CropDeleteModal from "./Cropdeletemodal";

export default function Crops() {
    const [searchTerm, setSearchTerm]           = useState("");
    const [crops, setCrops]                     = useState([]);
    const [showModal, setShowModal]             = useState(false);
    const [loading, setLoading]                 = useState(false);
    const [fetchingCrops, setFetchingCrops]     = useState(true);
    const [userId, setUserId]                   = useState(null);
    const [error, setError]                     = useState(null);
    const [deletingId, setDeletingId]           = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingCrop, setEditingCrop]         = useState(null);
    const [formData, setFormData]               = useState(DEFAULT_CROP_FORM);

    // 🔑 Get current user profile from localStorage system wrapper
    useEffect(() => {
        account.get()
            .then((user) => { setUserId(user.userId || user.$id); setError(null); })
            .catch(() => setError("Please log in to view crops"));
    }, []);

    // 📥 Fetch user's crops from Sheet
    useEffect(() => {
        if (!userId) return;
        const fetchCrops = async () => {
            try {
                setFetchingCrops(true);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CROPS_COLLECTION_ID
                );
                setCrops(response.documents);
                setError(null);
            } catch (err) {
                setError(`Failed to load crops: ${err.message}`);
                setCrops([]);
            } finally {
                setFetchingCrops(false);
            }
        };
        fetchCrops();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "healthScore" ? parseInt(value) : value,
        }));
    };

    // ✅ Add or update crop
    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.variety || !formData.plantedDate || !formData.expectedHarvest) {
            setError("Please fill all required fields");
            return;
        }
        if (!userId) { setError("User not authenticated"); return; }

        setLoading(true);
        setError(null);
        try {
            if (editingCrop) {
                const updatedCrop = await databases.updateDocument(
                    DATABASE_ID, CROPS_COLLECTION_ID, editingCrop.$id,
                    {
                        name: formData.name,
                        variety: formData.variety,
                        plantedDate: formData.plantedDate,
                        expectedHarvest: formData.expectedHarvest,
                        moisture: formData.moisture,
                        status: formData.status,
                        healthScore: formData.healthScore,
                        userId
                    }
                );
                setCrops((prev) => prev.map((c) => (c.$id === editingCrop.$id ? updatedCrop : c)));
                setEditingCrop(null);
            } else {
                const newCrop = await databases.createDocument(
                    DATABASE_ID, CROPS_COLLECTION_ID, ID.unique(),
                    {
                        name: formData.name,
                        variety: formData.variety,
                        plantedDate: formData.plantedDate,
                        expectedHarvest: formData.expectedHarvest,
                        moisture: formData.moisture,
                        status: formData.status,
                        healthScore: formData.healthScore,
                        userId,
                        image: DEFAULT_CROP_IMAGE,
                        createdAt: new Date().toISOString(),
                    }
                );
                setCrops((prev) => [newCrop, ...prev]);
            }
            setFormData(DEFAULT_CROP_FORM);
            setShowModal(false);
        } catch (err) {
            setError(`Failed to save crop: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ Delete crop
    const handleDeleteCrop = async () => {
        if (!showDeleteConfirm) return;
        setDeletingId(showDeleteConfirm);
        try {
            await databases.deleteDocument(DATABASE_ID, CROPS_COLLECTION_ID, showDeleteConfirm);
            setCrops((prev) => prev.filter((c) => c.$id !== showDeleteConfirm));
            setShowDeleteConfirm(null);
        } catch (err) {
            setError(`Failed to delete crop: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditCrop = (crop) => {
        setEditingCrop(crop);
        setFormData({
            name: crop.name,
            variety: crop.variety,
            plantedDate: crop.plantedDate,
            expectedHarvest: crop.expectedHarvest,
            moisture: crop.moisture,
            status: crop.status,
            healthScore: crop.healthScore,
        });
        setShowModal(true);
    };

    const handleCloseForm = () => {
        setShowModal(false);
        setEditingCrop(null);
        setFormData(DEFAULT_CROP_FORM);
    };

    const filteredCrops = crops.filter(
        (crop) =>
            crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (fetchingCrops && crops.length === 0) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm flex items-center justify-center pt-28">
                <div className="text-center">
                    <div className="inline-flex p-6 bg-smart-green-50 dark:bg-smart-green-900/20 rounded-full mb-5">
                        <Loader2 className="w-10 h-10 text-smart-green-600 animate-spin" />
                    </div>
                    <p className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2">Loading your crops</p>
                    <p className="text-sm text-gray-400">Fetching latest harvest data…</p>
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
                        Harvest Management
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
                        <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
                            My <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent ml-2">Crops</em>
                            <Sprout className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-3" />
                        </h1>
                        <button
                            onClick={() => { setEditingCrop(null); setFormData(DEFAULT_CROP_FORM); setShowModal(true); }}
                            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm"
                        >
                            <Plus size={18} />
                            Add New Crop
                        </button>
                    </div>
                    <p className="text-md font-medium text-gray-400 mt-2 shrink-0">
                        Manage and monitor your farm's active seasonal crops.
                    </p>
                </div>

                {error && (
                    <Reveal>
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start justify-between gap-4">
                            <p className="text-red-600 dark:text-red-400 font-medium text-sm">{error}</p>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0 bg-red-100 dark:bg-red-900/20 p-1 rounded-full">
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
                        placeholder="Search crops or varieties..."
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
                    {filteredCrops.map((crop, i) => (
                        <Reveal key={crop.$id} delay={i * 60}>
                            <CropCard
                                crop={crop}
                                onEdit={handleEditCrop}
                                onDelete={(id) => setShowDeleteConfirm(id)}
                            />
                        </Reveal>
                    ))}

                    {filteredCrops.length === 0 && !fetchingCrops && (
                        <div className="col-span-full py-24 text-center">
                            <div className="inline-flex p-6 bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-full mb-4">
                                <Sprout size={40} className="text-gray-300 dark:text-gray-700" />
                            </div>
                            <h3 className="font-fraunces font-bold text-2xl mb-2">No Crops Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchTerm ? "We couldn't find any crops matching your search." : "You haven't added any crops yet. Click 'Add New Crop' to start."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <CropFormModal
                isOpen={showModal}
                onClose={handleCloseForm}
                onSubmit={handleAddCrop}
                formData={formData}
                onChange={handleInputChange}
                isLoading={loading}
                isEditMode={!!editingCrop}
            />
            <CropDeleteModal
                isOpen={!!showDeleteConfirm}
                onConfirm={handleDeleteCrop}
                onCancel={() => setShowDeleteConfirm(null)}
                isDeleting={deletingId === showDeleteConfirm}
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