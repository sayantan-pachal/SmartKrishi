/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getFarmingAdvice } from "../data/weatherUtils";
import { useToast } from "../component/Other/ToastContext";

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("Your Location");

    const showToast = useToast();

    // 📍 Step 1: Geolocation
    useEffect(() => {
        const cached = sessionStorage.getItem("userLocation");
        if (cached) {
            const { lat, lon } = JSON.parse(cached);
            showToast("Using saved location", "success");
            setLocation({ lat, lon });
            return;
        }

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                sessionStorage.setItem(
                    "userLocation",
                    JSON.stringify({ lat: latitude, lon: longitude })
                );
                setLocation({ lat: latitude, lon: longitude });
            },
            () => {
                showToast("Location access denied. Please enable GPS.", "error");
                setLoading(false);
            }
        );
    }, []);

    // 🌤️ Step 2: Fetch weather
    useEffect(() => {
        if (!location.lat || !location.lon) return;

        const cachedWeather = sessionStorage.getItem("weatherData");
        const cacheTime = sessionStorage.getItem("weatherCacheTime");
        const now = Date.now();

        if (cachedWeather && cacheTime && now - parseInt(cacheTime) < 30 * 60 * 1000) {
            const { weather, forecast, locationName } = JSON.parse(cachedWeather);
            setWeather(weather);
            setForecast(forecast);
            setLocationName(locationName);
            setLoading(false);
            return;
        }

        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
                if (!API_KEY) throw new Error("VITE_WEATHER_API_KEY not configured");

                const [wRes, fRes] = await Promise.all([
                    fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
                    ),
                    fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
                    ),
                ]);

                if (!wRes.ok) throw new Error(`Weather API error: ${wRes.status}`);
                if (!fRes.ok) throw new Error(`Forecast API error: ${fRes.status}`);

                const weatherData = await wRes.json();
                const forecastData = await fRes.json();

                // 🚨 Toast alerts
                const advisories = getFarmingAdvice(
                    weatherData.main.temp,
                    weatherData.main.humidity,
                    weatherData.wind.speed * 3.6,
                    weatherData.clouds.all,
                    weatherData.rain?.["1h"] || 0
                );

                const seriousAlert = advisories.find(
                    (a) => a.type === "warning" || a.type === "caution"
                );

                seriousAlert
                    ? showToast(`Weather Alert: ${seriousAlert.text}`, seriousAlert.type)
                    : showToast(`Weather updated for ${weatherData.name}`, "success");

                // 📆 Forecast → one per day
                const dailyMap = {};
                forecastData.list.forEach((item) => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!dailyMap[date]) dailyMap[date] = item;
                });

                const processedForecast = Object.values(dailyMap).slice(0, 5);

                sessionStorage.setItem(
                    "weatherData",
                    JSON.stringify({
                        weather: weatherData,
                        forecast: processedForecast,
                        locationName: weatherData.name || "Your Location",
                    })
                );
                sessionStorage.setItem("weatherCacheTime", now.toString());

                setWeather(weatherData);
                setForecast(processedForecast);
                setLocationName(weatherData.name || "Your Location");
            } catch (err) {
                setError(`Failed to fetch weather: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [location]);

    const retry = () => {
        ["userLocation", "weatherData", "weatherCacheTime"].forEach((k) =>
            sessionStorage.removeItem(k)
        );
        window.location.reload();
    };

    return {
        weather,
        forecast,
        loading,
        error,
        locationName,
        retry,
    };
};