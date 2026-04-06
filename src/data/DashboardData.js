import {
  Leaf,
  CloudRain,
  Bug,
  Map,
} from "lucide-react";

/* ===============================
   Crop Seasons & Metadata
================================ */
export const CROP_SEASONS = {
  wheat: { season: "Rabi", daysToMaturity: 120, harvestMonth: "April" },
  rice: { season: "Kharif", daysToMaturity: 150, harvestMonth: "September" },
  corn: { season: "Kharif", daysToMaturity: 90, harvestMonth: "August" },
  "basmati rice": { season: "Kharif", daysToMaturity: 150, harvestMonth: "September" },
  sugarcane: { season: "Kharif", daysToMaturity: 360, harvestMonth: "December" },
  cotton: { season: "Kharif", daysToMaturity: 210, harvestMonth: "October" },
  potato: { season: "Rabi", daysToMaturity: 120, harvestMonth: "March" },
  tomato: { season: "Summer", daysToMaturity: 70, harvestMonth: "June" },
  onion: { season: "Rabi", daysToMaturity: 150, harvestMonth: "April" },
  cabbage: { season: "Rabi", daysToMaturity: 120, harvestMonth: "March" },
  carrot: { season: "Rabi", daysToMaturity: 100, harvestMonth: "March" },
  groundnut: { season: "Kharif", daysToMaturity: 120, harvestMonth: "August" },
  soybean: { season: "Kharif", daysToMaturity: 100, harvestMonth: "August" },
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