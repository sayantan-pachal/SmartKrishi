import React, { useState, useEffect } from "react";
import { Sprout, Search, Plus, X, Loader2 } from "lucide-react";
import { databases, ID, account, DATABASE_ID, CROPS_COLLECTION_ID } from "../../appwrite/config";
import { Query } from "appwrite";
import { DEFAULT_CROP_FORM, DEFAULT_CROP_IMAGE } from "../../data/CropsData";

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

    // 🔑 Get current user
    useEffect(() => {
        account.get()
            .then((user) => { setUserId(user.$id); setError(null); })
            .catch(() => setError("Please log in to view crops"));
    }, []);

    // 📥 Fetch user's crops
    useEffect(() => {
        if (!userId) return;
        const fetchCrops = async () => {
            try {
                setFetchingCrops(true);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CROPS_COLLECTION_ID,
                    [Query.equal("userId", userId)]
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

    // 🔄 Form input change
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

    // ✏️ Open edit modal
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

    // Close form modal
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

    return (
        <div className="min-h-screen pt-28 px-4 pb-12 bg-smartkrishi-light dark:bg-smartkrishi-dark">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Sprout className="text-green-600" size={32} />
                            My Crops
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and monitor your farm's active seasonal crops.
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingCrop(null); setFormData(DEFAULT_CROP_FORM); setShowModal(true); }}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add New Crop
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-start justify-between">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)} className="text-lg hover:text-red-900">×</button>
                    </div>
                )}

                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search crops or varieties..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Crops Grid */}
                {fetchingCrops ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-green-600" size={32} />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading crops...</span>
                    </div>
                ) : filteredCrops.length === 0 ? (
                    <div className="text-center py-12">
                        <Sprout className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            {crops.length === 0
                                ? "No crops yet. Add one to get started! 🌾"
                                : "No crops match your search."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCrops.map((crop) => (
                            <CropCard
                                key={crop.$id}
                                crop={crop}
                                onEdit={handleEditCrop}
                                onDelete={(id) => setShowDeleteConfirm(id)}
                            />
                        ))}
                    </div>
                )}
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
        </div>
    );
}