import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertCircle, Leaf, Loader2, Calendar, Sun, Droplet, RotateCcw } from 'lucide-react';

const Advisory = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("Your Location");

    // 📍 Step 1: Get geolocation (only once)
    useEffect(() => {
        // Check if location is already cached in sessionStorage
        const cachedLocation = sessionStorage.getItem('userLocation');

        if (cachedLocation) {
            const { lat, lon } = JSON.parse(cachedLocation);
            console.log("📍 Using cached location:", lat, lon);
            setLocation({ lat, lon });
            return;
        }

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("✅ Location found:", latitude, longitude);

                // Cache location in sessionStorage
                sessionStorage.setItem('userLocation', JSON.stringify({
                    lat: latitude,
                    lon: longitude
                }));

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

    // 🌤️ Step 2: Fetch weather data and forecast
    useEffect(() => {
        if (!location.lat || !location.lon) return;

        // Check if weather data is already cached
        const cachedWeather = sessionStorage.getItem('weatherData');
        const cacheTime = sessionStorage.getItem('weatherCacheTime');
        const now = Date.now();

        // Use cache if it's less than 30 minutes old
        if (cachedWeather && cacheTime && (now - parseInt(cacheTime) < 30 * 60 * 1000)) {
            const { weather: w, forecast: f, locationName: ln } = JSON.parse(cachedWeather);
            console.log("📦 Using cached weather data");
            setWeather(w);
            setForecast(f);
            setLocationName(ln);
            setLoading(false);
            return;
        }

        const fetchWeatherAndForecast = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

                if (!API_KEY) {
                    setError("Weather API key is not configured. Please add VITE_WEATHER_API_KEY to your .env file");
                    setLoading(false);
                    return;
                }

                console.log("🔍 Fetching weather for:", location.lat, location.lon);

                // Fetch current weather
                const weatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
                );

                if (!weatherResponse.ok) {
                    throw new Error(`Weather API error: ${weatherResponse.status}`);
                }

                const weatherData = await weatherResponse.json();
                console.log("✅ Weather data received:", weatherData);

                // Fetch 5-day forecast
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
                );

                if (!forecastResponse.ok) {
                    throw new Error(`Forecast API error: ${forecastResponse.status}`);
                }

                const forecastData = await forecastResponse.json();
                console.log("✅ Forecast data received:", forecastData);

                // Process forecast to get one entry per day
                const dailyForecasts = {};
                forecastData.list.forEach(item => {
                    const date = item.dt_txt.split(' ')[0]; // Get date part
                    if (!dailyForecasts[date]) {
                        dailyForecasts[date] = item;
                    }
                });

                const processedForecast = Object.values(dailyForecasts).slice(0, 5);

                // Cache the data
                sessionStorage.setItem('weatherData', JSON.stringify({
                    weather: weatherData,
                    forecast: processedForecast,
                    locationName: weatherData.name || "Your Location"
                }));
                sessionStorage.setItem('weatherCacheTime', now.toString());

                setWeather(weatherData);
                setForecast(processedForecast);
                setLocationName(weatherData.name || "Your Location");
            } catch (err) {
                console.error("❌ Weather fetch error:", err);
                setError(`Failed to fetch weather: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherAndForecast();
    }, [location]);

    // 🌡️ Calculate Evapotranspiration (ET) Index
    const calculateETIndex = (temp, humidity) => {
        // Simple ET estimation: High temp + Low humidity = High ET (more water loss)
        // Formula: ET Index = (Temperature / 30) × (100 - Humidity) / 50
        const etIndex = (temp / 30) * ((100 - humidity) / 50);
        
        if (etIndex > 1.5) {
            return {
                level: "Very High",
                color: "text-red-600 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                advice: "Critical irrigation needed. Water loss is very high."
            };
        } else if (etIndex > 1) {
            return {
                level: "High",
                color: "text-orange-600 dark:text-orange-400",
                bgColor: "bg-orange-50 dark:bg-orange-900/20",
                advice: "Increase irrigation frequency. Significant water loss expected."
            };
        } else if (etIndex > 0.5) {
            return {
                level: "Moderate",
                color: "text-yellow-600 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                advice: "Regular irrigation recommended. Normal water loss."
            };
        } else {
            return {
                level: "Low",
                color: "text-green-600 dark:text-green-400",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                advice: "Minimal irrigation needed. Low water loss due to cool & humid conditions."
            };
        }
    };

    // Format time from Unix timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Calculate daylight hours
    const calculateDaylightHours = (sunrise, sunset) => {
        const hours = (sunset - sunrise) / 3600;
        return hours.toFixed(1);
    };

    // 💡 Step 3: Generate advisory based on weather
    const getAdvice = (temp, humidity, windSpeed, clouds, rainData) => {
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

        // Rain detection
        if (rainData && rainData > 0) {
            advices.push({
                type: "info",
                text: "🌧️ Rain Detected: Postpone planned irrigation and fertilizer application to avoid runoff.",
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

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString + ' 00:00').toLocaleDateString('en-US', options);
    };

    // Retry function
    const handleRetry = () => {
        // Clear all cached data
        sessionStorage.removeItem('userLocation');
        sessionStorage.removeItem('weatherData');
        sessionStorage.removeItem('weatherCacheTime');
        
        setError(null);
        setLoading(true);
        setLocation({ lat: null, lon: null });
        
        // Reload the page
        window.location.reload();
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
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
                            <div className="flex-1">
                                <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Error</h3>
                                <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                                >
                                    <RotateCcw size={16} />
                                    Retry Access
                                </button>
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

                        {/* Sunrise & Sunset + Daylight Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {/* Sunrise */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Sunrise</span>
                                    <Sun className="text-yellow-500" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">🌅 {formatTime(weather.sys.sunrise)}</p>
                                <p className="text-xs text-gray-500 mt-2">Early morning light</p>
                            </div>

                            {/* Daylight Hours */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Daylight</span>
                                    <Sun className="text-orange-500" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateDaylightHours(weather.sys.sunrise, weather.sys.sunset)} hrs</p>
                                <p className="text-xs text-gray-500 mt-2">Hours of daylight</p>
                            </div>

                            {/* Sunset */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Sunset</span>
                                    <Sun className="text-red-500" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">🌇 {formatTime(weather.sys.sunset)}</p>
                                <p className="text-xs text-gray-500 mt-2">Evening twilight</p>
                            </div>
                        </div>

                        {/* Evapotranspiration (ET) Index */}
                        {weather && (
                            <div className={`mb-8 p-6 rounded-2xl border-2 ${calculateETIndex(weather.main.temp, weather.main.humidity).bgColor}`}>
                                <div className="flex items-start gap-4">
                                    <Droplet className={`${calculateETIndex(weather.main.temp, weather.main.humidity).color} flex-shrink-0`} size={32} />
                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold ${calculateETIndex(weather.main.temp, weather.main.humidity).color} mb-2`}>
                                            Evapotranspiration (ET) Index: {calculateETIndex(weather.main.temp, weather.main.humidity).level}
                                        </h3>
                                        <p className={`${calculateETIndex(weather.main.temp, weather.main.humidity).color} mb-2`}>
                                            {calculateETIndex(weather.main.temp, weather.main.humidity).advice}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                            💡 ET Index is calculated based on temperature and humidity. High values indicate more water loss from soil and plants, requiring increased irrigation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Advisory Cards */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📋 Today's Advisory</h3>

                            {getAdvice(
                                weather.main.temp,
                                weather.main.humidity,
                                weather.wind.speed * 3.6,
                                weather.clouds.all,
                                weather.rain?.['1h'] || 0
                            ).map((advice, idx) => (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border-l-4 ${advice.type === "warning"
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

                        {/* 5-Day Forecast */}
                        {forecast && forecast.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar size={28} />
                                    5-Day Forecast
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {forecast.map((day, idx) => {
                                        const date = day.dt_txt.split(' ')[0];
                                        const temp = Math.round(day.main.temp);
                                        const description = day.weather[0].main;
                                        const humidity = day.main.humidity;
                                        const windSpeed = (day.wind.speed * 3.6).toFixed(1);
                                        const etData = calculateETIndex(temp, humidity);

                                        return (
                                            <div
                                                key={idx}
                                                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition"
                                            >
                                                <p className="font-bold text-gray-900 dark:text-white mb-3">
                                                    {formatDate(date)}
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {temp}°C
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                        {description}
                                                    </p>
                                                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                        <p>💧 {humidity}%</p>
                                                        <p>💨 {windSpeed} km/h</p>
                                                        <p className={`font-semibold ${etData.color}`}>
                                                            ET: {etData.level}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Farming Tips</h3>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                <li>• Monitor soil moisture regularly to optimize irrigation</li>
                                <li>• Check for pests and diseases during high humidity periods</li>
                                <li>• Protect crops from strong winds using windbreaks if necessary</li>
                                <li>• Adjust fertilizer application based on weather conditions</li>
                                <li>• Keep records of weather patterns for better crop planning</li>
                                <li>• Use the 5-day forecast to plan irrigation and fertilizer schedules</li>
                                <li>• Plan field work around sunrise and sunset times for optimal productivity</li>
                                <li>• Higher ET Index values mean more frequent irrigation is needed</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Advisory;