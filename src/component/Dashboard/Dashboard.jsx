import React, { useEffect, useState } from "react";
import { Leaf, Tractor, AlertCircle, CheckCircle, Clock, BarChart3, Calendar, Loader2, Sprout, LeafyGreen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { account, databases, DATABASE_ID, CROPS_COLLECTION_ID } from "../../appwrite/config";
import { Query } from "appwrite";
import { CROP_SEASONS, DASHBOARD_CARDS, SEASON_META } from "../../data/DashboardData";

import {
  Reveal,
  StatCard,
  PanelCard,
  EmptyState,
  HarvestItem,
  SeasonChip,
  SectionHeader,
  QuickAccessGrid,
  FooterBanner,
  HealthBar,
  PageBackground,
  WeatherSection,
  ActivitySection,
} from "./DashboardComponents";

/* ─── Constants ─── */
const CACHE_KEY = "dashboard_crop_data";
const CACHE_TIME_KEY = "dashboard_cache_time";
const CACHE_TTL_MS = 15 * 60 * 1000;
const MIN_LOAD_MS = 1800;

/* ─── Helpers ─── */
const getSeason = (month) => {
  if (month >= 6 && month <= 9) return "Kharif";
  if (month >= 10 || month <= 3) return "Rabi";
  return "Summer";
};

const formatName = (name = "") =>
  name.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const healthMessage = (avg) => {
  if (avg >= 80) return { icon: "✅", text: "Excellent — keep up with regular monitoring" };
  if (avg >= 60) return { icon: "⚠️", text: "Good health — watch for potential issues" };
  if (avg > 0) return { icon: "🔴", text: "Needs attention — review crops for problems" };
  return { icon: "🌱", text: "No crops to analyse yet" };
};

/* ─── Stat config ─── */
const buildStatCards = (stats) => [
  { label: "Total Crops", value: stats.totalCrops, sub: "Active crops tracked", icon: Leaf, iconColor: "text-smart-green-600", accent: true },
  { label: "Healthy Crops", value: `${stats.healthyCount}/${stats.totalCrops}`, sub: "Above 80% health", icon: CheckCircle, iconColor: "text-emerald-500" },
  { label: "Farm Health", value: `${stats.averageHealth}%`, sub: "Average health score", icon: BarChart3, iconColor: "text-smart-green-600", accent: true, health: stats.averageHealth },
  { label: "Ready Soon", value: stats.readyToHarvest.length, sub: "Harvest within 2 weeks", icon: Clock, iconColor: "text-orange-500" },
];

/* ─── Crop data fetcher ─── */
const fetchAndComputeStats = async (cropSeasons) => {
  const cached = sessionStorage.getItem(CACHE_KEY);
  const cacheTime = sessionStorage.getItem(CACHE_TIME_KEY);
  const now = Date.now();

  if (cached && cacheTime && now - parseInt(cacheTime) < CACHE_TTL_MS) {
    return JSON.parse(cached);
  }

  const currentUser = await account.get();
  const response = await databases.listDocuments(
    DATABASE_ID, CROPS_COLLECTION_ID,
    [Query.equal("userId", currentUser.$id)]
  );

  const cropsList = response.documents || [];
  let totalHealth = 0, validHealthCount = 0, healthyCount = 0;
  const readyToHarvest = [], upcomingHarvest = [], upcomingSeasons = new Set();
  const today = new Date();

  cropsList.forEach((crop) => {
    const health = parseInt(crop.healthScore) || 0;
    if (health > 0) { totalHealth += health; validHealthCount++; }
    if (health >= 80) healthyCount++;

    if (crop.expectedHarvest) {
      const harvestDate = new Date(crop.expectedHarvest);
      const days = Math.floor((harvestDate - today) / 86400000);
      if (days > 0 && days <= 14) readyToHarvest.push({ name: crop.name, daysLeft: days, harvestDate });
      else if (days > 14 && days <= 56) upcomingHarvest.push({ name: crop.name, daysLeft: days, harvestDate });
    }

    const info = cropSeasons[crop.name?.toLowerCase() || ""] || { season: "Unknown" };
    if (info.season) upcomingSeasons.add(info.season);
  });

  const cropNames = Array.from(new Set(cropsList.map(c => c.name)));

  const stats = {
    totalCrops: cropsList.length,
    healthyCount,
    averageHealth: validHealthCount > 0 ? Math.round(totalHealth / validHealthCount) : 0,
    readyToHarvest: readyToHarvest.sort((a, b) => a.daysLeft - b.daysLeft),
    upcomingHarvest: upcomingHarvest.sort((a, b) => a.daysLeft - b.daysLeft),
    upcomingSeasons: Array.from(upcomingSeasons),
    allCropNames: cropNames,
  };

  const payload = { crops: cropsList, stats };
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  sessionStorage.setItem(CACHE_TIME_KEY, now.toString());
  return payload;
};

//  Dashboard — main page component with auth guard, data fetching, and layout
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cropStats, setCropStats] = useState({
    totalCrops: 0, healthyCount: 0, averageHealth: 0,
    readyToHarvest: [], upcomingHarvest: [], upcomingSeasons: [],
  });

  const currentSeason = getSeason(new Date().getMonth() + 1);

  /* Auth guard */
  useEffect(() => {
    account.get().then(setUser).catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  /* Data fetch */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [{ stats }] = await Promise.all([
          fetchAndComputeStats(CROP_SEASONS),
          new Promise(r => setTimeout(r, MIN_LOAD_MS)),
        ]);
        setCropStats(stats);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="inline-flex p-6 bg-smart-green-50 dark:bg-smart-green-900/20 rounded-full mb-5">
            <Loader2 className="w-10 h-10 text-smart-green-600 animate-spin" />
          </div>
          <p className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2">Loading your farm</p>
          <p className="text-sm text-gray-400">Fetching latest crop data…</p>
        </div>
      </div>
    );
  }

  /* ── Derived display values ── */
  const statCards = buildStatCards(cropStats);
  const healthMsg = healthMessage(cropStats.averageHealth);

  /* Harvest panel theme tokens */
  const harvestTheme = {
    ready: {
      accentBg: "bg-orange-50 dark:bg-orange-900/10",
      accentBorder: "border-orange-100 dark:border-orange-900/30",
      accentHover: "hover:border-orange-300 dark:hover:border-orange-700",
      badgeBg: "bg-orange-500",
    },
    upcoming: {
      accentBg: "bg-blue-50 dark:bg-blue-900/10",
      accentBorder: "border-blue-100 dark:border-blue-900/30",
      accentHover: "hover:border-blue-300 dark:hover:border-blue-700",
      badgeBg: "bg-blue-500",
    },
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-[#111] dark:text-gray-100 pt-24 pb-24 transition-colors duration-300">
      <PageBackground />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Page header ── */}
        <div className="mb-10" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 mb-3 block">
            Farm Overview
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
            <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
              Welcome back,{" "}
              <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent">
                {user?.name ? formatName(user.name) : "Farmer"}
              </em>
              <Tractor className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-2" />
            </h1>
          </div>
          <p className="text-md font-medium text-gray-400 mt-2 shrink-0">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <StatCard {...s} />
            </Reveal>
          ))}
        </div>

        {/* ── Health bar ── */}
        <Reveal className="mb-8">
          <HealthBar percent={cropStats.averageHealth} message={healthMsg} />
        </Reveal>

        {/* ── Harvest panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Reveal>
            <PanelCard
              icon={AlertCircle}
              iconBg="bg-orange-50 dark:bg-orange-900/20"
              iconColor="text-orange-500"
              title="Ready to Harvest"
              subtitle="Within 14 days"
            >
              {cropStats.readyToHarvest.length > 0 ? (
                <div className="space-y-2.5">
                  {cropStats.readyToHarvest.map((crop, i) => (
                    <HarvestItem key={i} {...crop} {...harvestTheme.ready} formatDate={formatDate} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Sprout} message="No crops ready to harvest soon" />
              )}
            </PanelCard>
          </Reveal>

          <Reveal delay={80}>
            <PanelCard
              icon={Calendar}
              iconBg="bg-blue-50 dark:bg-blue-900/20"
              iconColor="text-blue-500"
              title="Upcoming Harvest"
              subtitle="15 – 56 days out"
            >
              {cropStats.upcomingHarvest.length > 0 ? (
                <div className="space-y-2.5">
                  {cropStats.upcomingHarvest.map((crop, i) => (
                    <HarvestItem key={i} {...crop} {...harvestTheme.upcoming} formatDate={formatDate} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Calendar} message="No upcoming harvests scheduled" />
              )}
            </PanelCard>
          </Reveal>
        </div>

        {/* ── Season panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Reveal>
            <PanelCard
              icon={Leaf}
              iconBg="bg-smart-green-50 dark:bg-smart-green-900/20"
              iconColor="text-smart-green-600"
              title="Current Season"
              subtitle="Based on today's date"
            >
              <div className={`p-4 rounded-xl border ${SEASON_META[currentSeason]?.bg} ${SEASON_META[currentSeason]?.border}`}>
                <p className={`font-fraunces font-bold text-3xl tracking-tight mb-1.5 ${SEASON_META[currentSeason]?.color}`}>
                  {SEASON_META[currentSeason]?.emoji} {currentSeason}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{SEASON_META[currentSeason]?.desc}</p>
              </div>
            </PanelCard>
          </Reveal>

          <Reveal delay={80}>
            <PanelCard
              icon={Calendar}
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              iconColor="text-purple-500"
              title="Crop Seasons on Farm"
              subtitle="Derived from your crops"
            >
              {cropStats.upcomingSeasons.length > 0 ? (
                <div className="space-y-2.5">
                  {cropStats.upcomingSeasons.map((season, i) => (
                    <SeasonChip key={i} season={season} meta={SEASON_META[season]} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Sprout} message="No crops recorded yet" />
              )}
            </PanelCard>
          </Reveal>
        </div>

        <div>
          {/* ── Active Crops Gallery ── */}
          <Reveal className="mb-8">
            {/* Corrected: PanelCard now properly closed */}
            <PanelCard
              icon={Sprout}
              title="Currently Cultivating"
              subtitle="All active crop varieties"
            >
              <div className="flex flex-wrap gap-2 mt-4">
                {cropStats.allCropNames?.length > 0 ? (
                  cropStats.allCropNames.map((name, i) => (
                    <span key={i} className="px-4 py-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full text-sm font-medium hover:border-smart-green-400 transition-colors capitalize">
                      {name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No crops registered.</p>
                )}
              </div>
            </PanelCard>
          </Reveal>

          {/* ── New Two-Column Section: Weather & Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Reveal>
              <WeatherSection />
            </Reveal>

            <Reveal delay={100}>
              <ActivitySection />
            </Reveal>
          </div>
        </div>

        {/* ── Quick access ── */}
        <Reveal className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <SectionHeader eyebrow="Tools" heading="Quick Access" />
          </div>
          <QuickAccessGrid cards={DASHBOARD_CARDS} />
        </Reveal>

        {/* ── Footer banner ── */}
        <Reveal>
          <FooterBanner
            heading={<><LeafyGreen className="inline w-6 h-6 mr-1" /> Smart Farming Insights for Better Harvests</>}
            body="Monitor your crops regularly, plan your harvest, and optimise your farm with real-time data and AI-powered recommendations."
          />
        </Reveal>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;