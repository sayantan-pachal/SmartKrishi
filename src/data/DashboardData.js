// src/data/dashboard.data.js
import {
  Leaf,
  CloudRain,
  Bug,
  Map,
  Sun,
  Snowflake,
} from "lucide-react";

/* ===============================
   Crop Seasons
================================ */
export const CROP_SEASONS = {
  wheat:        { season: "Rabi",   daysToMaturity: 120, harvestMonth: "April" },
  rice:         { season: "Kharif", daysToMaturity: 150, harvestMonth: "September" },
  corn:         { season: "Kharif", daysToMaturity: 90,  harvestMonth: "August" },
  "basmati rice": { season: "Kharif", daysToMaturity: 150, harvestMonth: "September" },
  sugarcane:    { season: "Kharif", daysToMaturity: 360, harvestMonth: "December" },
  cotton:       { season: "Kharif", daysToMaturity: 210, harvestMonth: "October" },
  potato:       { season: "Rabi",   daysToMaturity: 120, harvestMonth: "March" },
  onion:        { season: "Rabi",   daysToMaturity: 150, harvestMonth: "April" },
  cabbage:      { season: "Rabi",   daysToMaturity: 120, harvestMonth: "March" },
  carrot:       { season: "Rabi",   daysToMaturity: 100, harvestMonth: "March" },
  tomato:       { season: "Summer", daysToMaturity: 70,  harvestMonth: "June" },
  groundnut:    { season: "Kharif", daysToMaturity: 120, harvestMonth: "August" },
  soybean:      { season: "Kharif", daysToMaturity: 100, harvestMonth: "August" },
};

/* ===============================
   Season UI Metadata
================================ */
export const SEASON_META = {
  Kharif: {
    emoji: "🌧️",
    icon: CloudRain,
    desc: "Monsoon season — rice, cotton, sugarcane",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
  Rabi: {
    emoji: "❄️",
    icon: Leaf,
    desc: "Winter season — wheat, potato, onion",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  Summer: {
    emoji: "☀️",
    icon: Sun,
    desc: "Summer season — vegetables, fruits",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  Winter: {
    emoji: "❄️",
    icon: Snowflake,
    color: "text-sky-600",
  },
};

/* ===============================
   Quick Access Cards
================================ */
export const DASHBOARD_CARDS = [
  {
    title: "My Fields",
    desc: "Manage and monitor all your farm fields",
    icon: Map,
    link: "/fields",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "My Crops",
    desc: "Track your seasonal crops and harvests",
    icon: Leaf,
    link: "/crops",
    color: "from-lime-500 to-green-600",
  },
  {
    title: "Weather Insights",
    desc: "Real-time weather updates for your area",
    icon: CloudRain,
    link: "/advisory",
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "Disease Detection",
    desc: "Identify crop diseases using AI",
    icon: Bug,
    link: "/disease-detection",
    color: "from-rose-500 to-red-600",
  },
];