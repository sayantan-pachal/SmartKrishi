import React from "react";
import { Leaf } from "lucide-react";

import { WeatherLoading, WeatherError } from "./WeatherLoadingError";
import WeatherHero from "./WeatherHero";
import WeatherMetricsGrid from "./WeatherMetricsGrid";
import SunriseSunsetBar from "./SunriseSunsetBar";
import ETIndexCard from "./ETIndexCard";
import AdvisoryCards from "./AdvisoryCards";
import ForecastGrid from "./ForecastGrid";
import FarmingTips from "./FarmingTips";

import { useWeather } from "../../hooks/useWeather";

const Advisory = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    locationName,
    retry,
  } = useWeather();

  if (loading) return <WeatherLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-black dark:to-gray-900 pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <Leaf className="text-green-600" size={36} />
            Smart Crop Advisory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time farming recommendations based on your location's weather
          </p>
        </div>

        {error && <WeatherError error={error} onRetry={retry} />}

        {weather && !error && (
          <>
            <WeatherHero weather={weather} locationName={locationName} />
            <WeatherMetricsGrid weather={weather} />
            <SunriseSunsetBar
              sunrise={weather.sys.sunrise}
              sunset={weather.sys.sunset}
            />
            <ETIndexCard
              temp={weather.main.temp}
              humidity={weather.main.humidity}
            />
            <AdvisoryCards weather={weather} />
            <ForecastGrid forecast={forecast} />
            <FarmingTips />
          </>
        )}
      </div>
    </div>
  );
};

export default Advisory;