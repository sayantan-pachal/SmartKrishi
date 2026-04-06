import {
  Sprout,
  Droplets,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Trash2
} from "lucide-react";

/* ===============================
   Icons (Centralized)
================================ */
export const CROPS_ICONS = {
  Sprout,
  Droplets,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Trash2,
};

/* ===============================
   Default Crop Form State
================================ */
export const DEFAULT_CROP_FORM = {
  name: "",
  variety: "",
  plantedDate: "",
  expectedHarvest: "",
  moisture: "",
  status: "Healthy",
  healthScore: 90,
};

/* ===============================
   Crop Status Options
================================ */
export const CROP_STATUS_OPTIONS = [
  { label: "Healthy", value: "Healthy" },
  { label: "Needs Attention", value: "Attention" },
];

/* ===============================
   Helper Functions (Pure)
================================ */
export const getDaysUntilHarvest = (harvestDate) => {
  const today = new Date();
  const harvest = new Date(harvestDate);
  const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

export const formatHarvestDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getHarvestStatusColor = (harvestDate) => {
  const daysLeft = getDaysUntilHarvest(harvestDate);

  if (daysLeft <= 14)
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";

  if (daysLeft <= 30)
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";

  return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
};

/* ===============================
   Default Crop Image
================================ */
export const DEFAULT_CROP_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400";