/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Leaf, CloudRain, Bug, Map, TrendingUp, Calendar, AlertCircle, CheckCircle, Clock, Droplets, Thermometer, Loader2, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { account, databases, DATABASE_ID, CROPS_COLLECTION_ID } from "../../appwrite/config";
import { Query } from "appwrite";
import { CROP_SEASONS, DASHBOARD_CARDS } from "../../data/DashboardData";


function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [crops, setCrops] = useState([]);
  const [cropStats, setCropStats] = useState({
    totalCrops: 0,
    healthyCount: 0,
    averageHealth: 0,
    readyToHarvest: [],
    upcomingHarvest: [],
    upcomingSeasons: [],
  });

  // Crop data with seasons and health parameters
  const cropSeasons = CROP_SEASONS;

  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = currentMonth >= 6 && currentMonth <= 9 ? "Kharif" : currentMonth >= 10 && currentMonth <= 3 ? "Rabi" : "Summer";

  // 🔐 Fetch current user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Not logged in:", error);
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [navigate]);

  // 🌾 Fetch crops and calculate statistics
  useEffect(() => {
    const fetchCropStats = async () => {
      try {
        setLoading(true);

        // Get current user
        const currentUser = await account.get();

        // Fetch all crops for this user
        const response = await databases.listDocuments(
          DATABASE_ID,
          CROPS_COLLECTION_ID,
          [Query.equal("userId", currentUser.$id)]
        );

        const cropsList = response.documents || [];
        console.log("📊 Crops fetched:", cropsList.length, cropsList);
        setCrops(cropsList);

        if (cropsList.length === 0) {
          setCropStats({
            totalCrops: 0,
            healthyCount: 0,
            averageHealth: 0,
            readyToHarvest: [],
            upcomingHarvest: [],
            upcomingSeasons: [],
          });
          setLoading(false);
          return;
        }

        // Calculate health statistics - FIXED
        let totalHealth = 0;
        let validHealthCount = 0;
        let healthyCount = 0;
        const readyToHarvest = [];
        const upcomingHarvest = [];
        const upcomingSeasons = new Set();

        const now = new Date();

        cropsList.forEach((crop) => {
          // ✅ FIX: Use healthScore instead of health
          const health = parseInt(crop.healthScore) || 0;

          console.log(`Crop: ${crop.name}, Health: ${health}`);

          // Only count crops with valid health scores
          if (health > 0) {
            totalHealth += health;
            validHealthCount++;
          }

          if (health >= 80) healthyCount++;

          // Calculate harvest timeline
          if (crop.expectedHarvest) {
            const harvestDate = new Date(crop.expectedHarvest);
            const daysUntilHarvest = Math.floor((harvestDate - now) / (1000 * 60 * 60 * 24));

            // Ready to harvest (within 2 weeks)
            if (daysUntilHarvest <= 14 && daysUntilHarvest > 0) {
              readyToHarvest.push({
                name: crop.name,
                daysLeft: daysUntilHarvest,
                harvestDate: harvestDate,
              });
            }

            // Upcoming harvest (2-8 weeks)
            if (daysUntilHarvest > 14 && daysUntilHarvest <= 56) {
              upcomingHarvest.push({
                name: crop.name,
                daysLeft: daysUntilHarvest,
                harvestDate: harvestDate,
              });
            }
          }

          // Get the appropriate season for this crop
          const cropKey = crop.name?.toLowerCase() || "";
          const cropInfo = cropSeasons[cropKey] || { season: "Unknown" };
          if (cropInfo.season) {
            upcomingSeasons.add(cropInfo.season);
          }
        });

        // ✅ FIX: Calculate average only from crops with valid health scores
        const averageHealth = validHealthCount > 0 ? Math.round(totalHealth / validHealthCount) : 0;

        console.log(`Total Crops: ${cropsList.length}, Valid Health Count: ${validHealthCount}, Average Health: ${averageHealth}, Healthy: ${healthyCount}`);

        setCropStats({
          totalCrops: cropsList.length,
          healthyCount,
          averageHealth,
          readyToHarvest: readyToHarvest.sort((a, b) => a.daysLeft - b.daysLeft),
          upcomingHarvest: upcomingHarvest.sort((a, b) => a.daysLeft - b.daysLeft),
          upcomingSeasons: Array.from(upcomingSeasons),
        });
      } catch (error) {
        console.error("Error fetching crops:", error);
        setCropStats({
          totalCrops: 0,
          healthyCount: 0,
          averageHealth: 0,
          readyToHarvest: [],
          upcomingHarvest: [],
          upcomingSeasons: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCropStats();
  }, []);

  // Get health color based on percentage
  const getHealthColor = (health) => {
    if (health >= 80) return "text-green-600 dark:text-green-400";
    if (health >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthBgColor = (health) => {
    if (health >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (health >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  // Format name with proper capitalization
  const formatName = (name = "") =>
    name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cards = DASHBOARD_CARDS;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] dark:bg-black flex items-center justify-center pt-28">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-blue-50 dark:from-black dark:to-gray-900 pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto x-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name ? formatName(user.name) : "Farmer"} 🌾
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Crops */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Crops</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{cropStats.totalCrops}</p>
            <p className="text-xs text-gray-500 mt-1">Active crops tracked</p>
          </div>

          {/* Healthy Crops */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Healthy Crops</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {cropStats.healthyCount}/{cropStats.totalCrops}
            </p>
            <p className="text-xs text-gray-500 mt-1">Above 80% health</p>
          </div>

          {/* Average Health */}
          <div className={`p-6 rounded-xl shadow-md border ${getHealthBgColor(cropStats.averageHealth)} hover:shadow-lg transition`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Farm Health</span>
              <BarChart3 className={`w-5 h-5 ${getHealthColor(cropStats.averageHealth)}`} />
            </div>
            <p className={`text-3xl font-bold ${getHealthColor(cropStats.averageHealth)}`}>{cropStats.averageHealth}%</p>
            <p className="text-xs text-gray-500 mt-1">Average health score</p>
          </div>

          {/* Ready to Harvest */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ready Soon</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{cropStats.readyToHarvest.length}</p>
            <p className="text-xs text-gray-500 mt-1">Within 2 weeks</p>
          </div>
        </div>

        {/* Health Progress Bar */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Farm Health</h3>
            <span className={`text-2xl font-bold ${getHealthColor(cropStats.averageHealth)}`}>
              {cropStats.averageHealth}%
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cropStats.averageHealth >= 80
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : cropStats.averageHealth >= 60
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                    : "bg-gradient-to-r from-red-500 to-rose-600"
                }`}
              style={{ width: `${cropStats.averageHealth}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {cropStats.averageHealth >= 80
              ? "✅ Excellent condition - Keep up with regular monitoring"
              : cropStats.averageHealth >= 60
                ? "⚠️ Good health - Watch for potential issues"
                : cropStats.averageHealth > 0
                  ? "🔴 Needs attention - Review crops for problems"
                  : "No crops to analyze"}
          </p>
        </div>

        {/* Ready to Harvest & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ready to Harvest */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Harvest</h3>
            </div>
            {cropStats.readyToHarvest.length > 0 ? (
              <div className="space-y-3">
                {cropStats.readyToHarvest.map((crop, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{crop.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">in {crop.daysLeft} day{crop.daysLeft > 1 ? "s" : ""}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full font-semibold">
                      {formatDate(crop.harvestDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No crops ready to harvest soon</p>
            )}
          </div>

          {/* Upcoming Harvest */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Harvest</h3>
            </div>
            {cropStats.upcomingHarvest.length > 0 ? (
              <div className="space-y-3">
                {cropStats.upcomingHarvest.map((crop, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{crop.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">in {crop.daysLeft} days</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
                      {formatDate(crop.harvestDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming harvests</p>
            )}
          </div>
        </div>

        {/* Current & Upcoming Seasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Season */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Season</h3>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">{currentSeason}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentSeason === "Kharif"
                  ? "Monsoon season - Good for rice, cotton, sugarcane"
                  : currentSeason === "Rabi"
                    ? "Winter season - Good for wheat, potato, onion"
                    : "Summer season - Good for vegetables"}
              </p>
            </div>
          </div>

          {/* Crop Seasons in Farm */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crop Seasons</h3>
            </div>
            <div className="space-y-2">
              {cropStats.upcomingSeasons.length > 0 ? (
                cropStats.upcomingSeasons.map((season, idx) => (
                  <div key={idx} className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="font-semibold text-gray-900 dark:text-white">{season} Season</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No crops recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group p-6 rounded-xl bg-white dark:bg-gray-900 backdrop-blur shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:scale-[1.02] transition"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${card.color} group-hover:scale-110 transition`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            🌾 Smart Farming Insights for Better Harvests
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor your crops regularly, plan your harvest, and optimize your farming with real-time data
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;