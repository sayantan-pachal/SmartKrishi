/* eslint-disable no-unused-vars */
import { Cloud, Droplets, Wind, Gauge } from 'lucide-react';

const MetricCard = ({ label, value, sub, icon: Icon, iconColor }) => (
    <div className="bg-white dark:bg-white/[0.03] p-6 rounded-[2rem] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">{label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-white/[0.05] ${iconColor}`}>
                <Icon size={16} />
            </div>
        </div>
        <div className="mt-auto">
            <p className="font-fraunces font-bold text-3xl text-[#111] dark:text-white mb-1">{value}</p>
            <p className="text-[11px] font-medium text-gray-500">{sub}</p>
        </div>
    </div>
);

const WeatherMetricsGrid = ({ weather }) => {
    const windKmh = weather.wind.speed * 3.6;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                label="Humidity"
                value={`${weather.main.humidity}%`}
                sub={weather.main.humidity > 85 ? "High: Fungal risk" : weather.main.humidity < 30 ? "Low: Drought risk" : "Optimal range"}
                icon={Droplets}
                iconColor="text-blue-500"
            />
            <MetricCard
                label="Wind"
                value={`${windKmh.toFixed(1)} km/h`}
                sub={windKmh > 20 ? "Strong: Secure tall crops" : "Gentle breeze"}
                icon={Wind}
                iconColor="text-teal-500"
            />
            <MetricCard
                label="Pressure"
                value={`${weather.main.pressure} hPa`}
                sub="Atmospheric pressure"
                icon={Gauge}
                iconColor="text-purple-500"
            />
            <MetricCard
                label="Cloud Cover"
                value={`${weather.clouds.all}%`}
                sub="Direct sunlight blockage"
                icon={Cloud}
                iconColor="text-gray-400"
            />
        </div>
    );
};

export default WeatherMetricsGrid;