import React, { useState, useEffect } from 'react';
import {
    Sprout, Droplets, Calendar, TrendingUp, Plus, Search, Filter,
    AlertCircle, CheckCircle2, Clock, X, Loader2, Trash2
} from 'lucide-react';
import { databases, ID, account, DATABASE_ID, CROPS_COLLECTION_ID } from '../../appwrite/config';
import { Query } from 'appwrite';
import {
    CROPS_ICONS,
    DEFAULT_CROP_FORM,
    CROP_STATUS_OPTIONS,
    DEFAULT_CROP_IMAGE
} from "../../data/CropsData";

export default function Crops() {
    const [searchTerm, setSearchTerm] = useState("");
    const [crops, setCrops] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingCrops, setFetchingCrops] = useState(true);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingCrop, setEditingCrop] = useState(null);

    const [formData, setFormData] = useState(DEFAULT_CROP_FORM);

    // 🔑 Step 1: Get current user ID
    useEffect(() => {
        const getAccount = async () => {
            try {
                const user = await account.get();
                console.log("✅ User logged in:", user.$id);
                setUserId(user.$id);
                setError(null);
            } catch (err) {
                console.error("❌ User not logged in:", err);
                setError("Please log in to view crops");
            }
        };
        getAccount();
    }, []);

    // 📥 Step 2: Fetch ONLY this user's crops
    useEffect(() => {
        if (!userId) {
            console.log("⏳ Waiting for userId...");
            return;
        }

        const fetchCrops = async () => {
            try {
                setFetchingCrops(true);
                console.log("🔍 Fetching crops for userId:", userId);

                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CROPS_COLLECTION_ID,
                    [Query.equal("userId", userId)]
                );

                console.log("✅ Crops fetched:", response.documents.length);
                setCrops(response.documents);
                setError(null);
            } catch (error) {
                console.error("❌ Fetch Error:", error.message);
                setError(`Failed to load crops: ${error.message}`);
                setCrops([]);
            } finally {
                setFetchingCrops(false);
            }
        };

        fetchCrops();
    }, [userId]);

    // 🔄 Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'healthScore' ? parseInt(value) : value
        }));
    };

    // ✅ Step 3: Handle form submission WITH userId
    const handleAddCrop = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.variety || !formData.plantedDate || !formData.expectedHarvest) {
            setError("Please fill all required fields");
            return;
        }

        if (!userId) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("📤 Saving crop with userId:", userId);

            if (editingCrop) {
                // Update existing crop
                const updatedCrop = await databases.updateDocument(
                    DATABASE_ID,
                    CROPS_COLLECTION_ID,
                    editingCrop.$id,
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

                console.log("✅ Crop updated:", updatedCrop.$id);
                setCrops(prev => prev.map(crop => crop.$id === editingCrop.$id ? updatedCrop : crop));
                setEditingCrop(null);
            } else {
                // Create new crop
                const payload = {
                    name: formData.name,
                    variety: formData.variety,
                    plantedDate: formData.plantedDate,
                    expectedHarvest: formData.expectedHarvest,
                    moisture: formData.moisture,
                    status: formData.status,
                    healthScore: formData.healthScore,
                    userId: userId,
                    image: DEFAULT_CROP_IMAGE,
                    createdAt: new Date().toISOString()
                };

                const newCrop = await databases.createDocument(
                    DATABASE_ID,
                    CROPS_COLLECTION_ID,
                    ID.unique(),
                    payload
                );

                console.log("✅ Crop saved:", newCrop.$id);
                setCrops(prev => [newCrop, ...prev]);
            }

            // 🧹 Reset form
            setFormData(DEFAULT_CROP_FORM);
            setShowModal(false);
            setError(null);
        } catch (error) {
            console.error("❌ Error adding crop:", error);
            setError(`Failed to add crop: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ Handle delete crop
    const handleDeleteCrop = async (cropId) => {
        setDeletingId(cropId);
        try {
            console.log("🗑️ Deleting crop:", cropId);

            await databases.deleteDocument(
                DATABASE_ID,
                CROPS_COLLECTION_ID,
                cropId
            );

            console.log("✅ Crop deleted:", cropId);
            setCrops(prev => prev.filter(crop => crop.$id !== cropId));
            setShowDeleteConfirm(null);
            setError(null);
        } catch (error) {
            console.error("❌ Error deleting crop:", error);
            setError(`Failed to delete crop: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    // ✏️ Handle edit crop
    const handleEditCrop = (crop) => {
        setEditingCrop(crop);
        setFormData({
            name: crop.name,
            variety: crop.variety,
            plantedDate: crop.plantedDate,
            expectedHarvest: crop.expectedHarvest,
            moisture: crop.moisture,
            status: crop.status,
            healthScore: crop.healthScore
        });
        setShowModal(true);
    };

    // 🔍 Filter crops
    const filteredCrops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate days
    const getDaysUntilHarvest = (harvestDate) => {
        const today = new Date();
        const harvest = new Date(harvestDate);
        const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    // Format harvest date
    const formatHarvestDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get harvest status color
    const getHarvestStatusColor = (harvestDate) => {
        const daysLeft = getDaysUntilHarvest(harvestDate);
        if (daysLeft <= 14) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
        if (daysLeft <= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    };

    return (
        <div className="min-h-screen pt-28 px-4 pb-12 bg-smartkrishi-light dark:bg-smartkrishi-dark">
            <div className="max-w-7xl mx-auto x-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Sprout className="text-green-600" size={32} />
                            My Crops
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor your farm's active seasonal crops.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCrop(null);
                            setFormData({
                                name: "",
                                variety: "",
                                plantedDate: "",
                                expectedHarvest: "",
                                moisture: "",
                                status: "Healthy",
                                healthScore: 90
                            });
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add New Crop
                    </button>
                </div>

                {/* Error Display */}
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
                            {crops.length === 0 ? "No crops yet. Add one to get started! 🌾" : "No crops match your search."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCrops.map((crop) => (
                            <div key={crop.$id} className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                    {crop.image && (
                                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${crop.status === 'Healthy'
                                            ? 'bg-green-500/20 text-green-200'
                                            : 'bg-amber-500/20 text-amber-200'
                                            }`}>
                                            {crop.status === 'Healthy' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                            {crop.status}
                                        </span>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => setShowDeleteConfirm(crop.$id)}
                                        className="absolute top-4 left-4 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete crop"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEditCrop(crop)}
                                        className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 text-xs font-bold"
                                        title="Edit crop"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{crop.name}</h3>
                                            <p className="text-sm text-green-600 dark:text-green-400">{crop.variety}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Health</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{crop.healthScore}%</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 dark:border-gray-800 mb-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                <Droplets size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Moisture</p>
                                                <p className="text-sm font-bold dark:text-white">{crop.moisture || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Harvest In</p>
                                                <p className="text-sm font-bold dark:text-white">~{getDaysUntilHarvest(crop.expectedHarvest)} Days</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Calendar size={14} />
                                            <span className="text-xs font-medium">Planted: {new Date(crop.plantedDate).toLocaleDateString()}</span>
                                        </div>

                                        {/* ✅ Harvest Date Badge - Bottom Right */}
                                        <div className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getHarvestStatusColor(crop.expectedHarvest)}`}>
                                            <p className="text-[10px] uppercase font-bold mb-0.5">Harvest</p>
                                            <p className="font-bold text-sm">{formatHarvestDate(crop.expectedHarvest)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Crop Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingCrop ? "Edit Crop" : "Add New Crop"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingCrop(null);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                            >
                                <X size={24} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCrop} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Crop Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Basmati Rice"
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Variety <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="variety"
                                    value={formData.variety}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Pusa 1121"
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Planted Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="plantedDate"
                                    value={formData.plantedDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Expected Harvest <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="expectedHarvest"
                                    value={formData.expectedHarvest}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Moisture Level
                                </label>
                                <input
                                    type="text"
                                    name="moisture"
                                    value={formData.moisture}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 15%"
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                />
                            </div>

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
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formData.healthScore}%</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white"
                                >
                                    {CROP_STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCrop(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            {editingCrop ? "Updating..." : "Adding..."}
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            {editingCrop ? "Update Crop" : "Add Crop"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                    <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                                Delete Crop?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Are you sure you want to delete this crop? This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteCrop(showDeleteConfirm)}
                                    disabled={deletingId === showDeleteConfirm}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {deletingId === showDeleteConfirm ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}