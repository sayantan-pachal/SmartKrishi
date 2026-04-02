import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertCircle, Leaf, Loader2 } from 'lucide-react';

const Advisory = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("Your Location");

    // 📍 Step 1: Get geolocation
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("✅ Location found:", latitude, longitude);
                setLocation({
                    lat: latitude,
                    lon: longitude
                });
            },
            (err) => {
                console.error("❌ Geolocation error:", err);
                setError("Unable to access your location. Please enable location services.");
                setLoading(false);
            }
        );
    }, []);

    // 🌤️ Step 2: Fetch weather data
    useEffect(() => {
        if (!location.lat || !location.lon) return;

        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use the correct environment variable key
                const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

                if (!API_KEY) {
                    setError("Weather API key is not configured. Please add VITE_WEATHER_API_KEY to your .env file");
                    setLoading(false);
                    return;
                }

                console.log("🔍 Fetching weather for:", location.lat, location.lon);

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error(`Weather API error: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ Weather data received:", data);
                setWeather(data);
                setLocationName(data.name || "Your Location");
            } catch (err) {
                console.error("❌ Weather fetch error:", err);
                setError(`Failed to fetch weather: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    // 💡 Step 3: Generate advisory based on weather
    const getAdvice = (temp, humidity, windSpeed, clouds) => {
        const advices = [];

        // Temperature-based advice
        if (temp > 35) {
            advices.push({
                type: "warning",
                text: "🔥 Heat Alert: Increase irrigation to prevent crop wilting. Monitor soil moisture closely.",
                icon: "⚠️"
            });
        } else if (temp < 5) {
            advices.push({
                type: "warning",
                text: "❄️ Cold Alert: Protect sensitive crops. Consider covering if frost is expected.",
                icon: "⚠️"
            });
        }

        // Humidity-based advice
        if (humidity > 85) {
            advices.push({
                type: "caution",
                text: "💧 High Humidity: Risk of fungal diseases and pests increases. Inspect crops regularly and ensure good air circulation.",
                icon: "⚠️"
            });
        } else if (humidity < 30) {
            advices.push({
                type: "caution",
                text: "🌵 Low Humidity: Risk of drought stress. Increase irrigation frequency.",
                icon: "⚠️"
            });
        }

        // Wind-based advice
        if (windSpeed > 20) {
            advices.push({
                type: "caution",
                text: "💨 Strong Winds: Potential for crop damage. Monitor field closely and stake tall plants if necessary.",
                icon: "⚠️"
            });
        }

        // Cloud coverage advice
        if (clouds > 70) {
            advices.push({
                type: "info",
                text: "☁️ Overcast: Reduced sunlight may affect photosynthesis. Ensure adequate nutrients.",
                icon: "ℹ️"
            });
        }

        // Default positive message
        if (advices.length === 0) {
            advices.push({
                type: "success",
                text: "✅ Conditions are optimal. Proceed with regular maintenance. Weather is favorable for crop growth.",
                icon: "✓"
            });
        }

        return advices;
    };

    // Color mapping for weather conditions
    const getWeatherColor = (temp) => {
        if (temp > 35) return "from-red-500 to-orange-500";
        if (temp > 25) return "from-orange-500 to-yellow-500";
        if (temp > 15) return "from-yellow-500 to-green-500";
        if (temp > 5) return "from-green-500 to-blue-500";
        return "from-blue-500 to-cyan-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-black dark:to-gray-900 pt-28 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex p-6 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <Loader2 size={48} className="text-green-600 dark:text-green-400 animate-spin" />
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-bold text-xl">Detecting location and fetching weather...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-black dark:to-gray-900 pt-28 px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                        <Leaf className="text-green-600" size={36} />
                        Smart Crop Advisory
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Real-time farming recommendations based on your location's weather</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                            <div>
                                <h3 className="font-bold text-red-600 dark:text-red-400">Error</h3>
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Weather Card */}
                {weather && !error && (
                    <>
                        {/* Current Weather */}
                        <div className={`mb-8 p-8 rounded-3xl bg-gradient-to-br ${getWeatherColor(weather.main.temp)} text-white shadow-lg`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">{locationName}</h2>
                                    <p className="text-lg opacity-90 capitalize">{weather.weather[0].description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-6xl font-bold">{Math.round(weather.main.temp)}°C</div>
                                    <p className="text-sm opacity-75">Feels like {Math.round(weather.main.feels_like)}°C</p>
                                </div>
                            </div>
                        </div>

                        {/* Weather Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {/* Humidity */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Humidity</span>
                                    <Droplets className="text-blue-500" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weather.main.humidity}%</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {weather.main.humidity > 85 ? "High - Risk of fungal diseases" : weather.main.humidity < 30 ? "Low - Drought risk" : "Normal"}
                                </p>
                            </div>

                            {/* Wind Speed */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Wind Speed</span>
                                    <Wind className="text-purple-500" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{(weather.wind.speed * 3.6).toFixed(1)} km/h</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {weather.wind.speed * 3.6 > 20 ? "Strong - Monitor crops" : "Moderate"}
                                </p>
                            </div>

                            {/* Pressure */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Pressure</span>
                                    <Cloud className="text-gray-500" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weather.main.pressure} hPa</p>
                                <p className="text-xs text-gray-500 mt-1">Atmospheric pressure</p>
                            </div>

                            {/* Cloud Coverage */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Clouds</span>
                                    <Cloud className="text-cyan-500" size={24} />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weather.clouds.all}%</p>
                                <p className="text-xs text-gray-500 mt-1">Cloud coverage</p>
                            </div>
                        </div>

                        {/* Advisory Cards */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📋 Today's Advisory</h3>

                            {getAdvice(
                                weather.main.temp,
                                weather.main.humidity,
                                weather.wind.speed * 3.6,
                                weather.clouds.all
                            ).map((advice, idx) => (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border-l-4 ${
                                        advice.type === "warning"
                                            ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                                            : advice.type === "caution"
                                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400"
                                            : advice.type === "success"
                                            ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400"
                                    }`}
                                >
                                    <p className="font-semibold text-lg">{advice.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Farming Tips</h3>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                <li>• Monitor soil moisture regularly to optimize irrigation</li>
                                <li>• Check for pests and diseases during high humidity periods</li>
                                <li>• Protect crops from strong winds using windbreaks if necessary</li>
                                <li>• Adjust fertilizer application based on weather conditions</li>
                                <li>• Keep records of weather patterns for better crop planning</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Advisory;