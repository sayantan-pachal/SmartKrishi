import React from "react";
import { CloudSun } from "lucide-react";

import { WeatherLoading, WeatherError } from "./WeatherLoadingError";
import WeatherHero from "./WeatherHero";
import WeatherMetricsGrid from "./WeatherMetricsGrid";
import SunriseSunsetBar from "./SunriseSunsetBar";
import ETIndexCard from "./ETIndexCard";
import AdvisoryCards from "./AdvisoryCards";
import ForecastGrid from "./ForecastGrid";
import FarmingTips from "./FarmingTips";
import SprayWindowCard from "./SprayWindowCard";
import DiseaseRiskCard from "./DiseaseRiskCard";

import { useWeather } from "../../hooks/useWeather";
import { PageBackground, Reveal } from "../DashTemp/DashboardComponents";

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
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-[#111] dark:text-gray-100 pt-24 pb-24 transition-colors duration-300">
      <PageBackground />
      
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* ── Page header ── */}
        <div className="mb-10" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 mb-3 block">
                Climate Intelligence
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
                <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
                    Crop <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent ml-2">Advisory</em>
                    <CloudSun className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-3" />
                </h1>
            </div>
            <p className="text-md font-medium text-gray-400 mt-2 shrink-0">
                Real-time farming recommendations based on your local microclimate.
            </p>
        </div>

        {error && <WeatherError error={error} onRetry={retry} />}

        {weather && !error && (
          <div className="space-y-6">
            <Reveal>
                <WeatherHero weather={weather} locationName={locationName} />
            </Reveal>

            <Reveal delay={100}>
                <WeatherMetricsGrid weather={weather} />
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Reveal delay={150}>
                        <AdvisoryCards weather={weather} />
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Reveal delay={180}>
                            <SprayWindowCard weather={weather} />
                        </Reveal>
                        <Reveal delay={210}>
                            <DiseaseRiskCard weather={weather} />
                        </Reveal>
                    </div>
                    <Reveal delay={200}>
                        <ForecastGrid forecast={forecast} />
                    </Reveal>
                </div>
                
                <div className="space-y-6">
                    <Reveal delay={250}>
                        <ETIndexCard temp={weather.main.temp} humidity={weather.main.humidity} />
                    </Reveal>
                    <Reveal delay={300}>
                        <SunriseSunsetBar sunrise={weather.sys.sunrise} sunset={weather.sys.sunset} />
                    </Reveal>
                    <Reveal delay={350}>
                        <FarmingTips />
                    </Reveal>
                </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
          @keyframes fadeSlideDown {
              from { opacity: 0; transform: translateY(-18px); }
              to   { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};

export default Advisory;