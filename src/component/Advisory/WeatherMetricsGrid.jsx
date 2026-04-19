import { Cloud, Droplets, Wind } from 'lucide-react';

const MetricCard = ({ label, value, sub, icon }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 dark:text-gray-400 font-semibold">{label}</span>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{sub}</p>
  </div>
);

const WeatherMetricsGrid = ({ weather }) => {
  const windKmh = weather.wind.speed * 3.6;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        label="Humidity"
        value={`${weather.main.humidity}%`}
        sub={weather.main.humidity > 85 ? "High - Risk of fungal diseases" : weather.main.humidity < 30 ? "Low - Drought risk" : "Normal"}
        icon={<Droplets className="text-blue-500" size={24} />}
      />
      <MetricCard
        label="Wind Speed"
        value={`${windKmh.toFixed(1)} km/h`}
        sub={windKmh > 20 ? "Strong - Monitor crops" : "Moderate"}
        icon={<Wind className="text-purple-500" size={24} />}
      />
      <MetricCard
        label="Pressure"
        value={`${weather.main.pressure} hPa`}
        sub="Atmospheric pressure"
        icon={<Cloud className="text-gray-500" size={24} />}
      />
      <MetricCard
        label="Clouds"
        value={`${weather.clouds.all}%`}
        sub="Cloud coverage"
        icon={<Cloud className="text-cyan-500" size={24} />}
      />
    </div>
  );
};

export default WeatherMetricsGrid;