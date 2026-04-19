import { Sun } from 'lucide-react';

const SunCard = ({ label, value, sub, iconColor }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-600 dark:text-gray-400 font-semibold">{label}</span>
      <Sun className={iconColor} size={24} />
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 mt-2">{sub}</p>
  </div>
);

const formatTime = (timestamp) =>
  new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

const SunriseSunsetBar = ({ sunrise, sunset }) => {
  const daylightHours = ((sunset - sunrise) / 3600).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <SunCard label="Sunrise"  value={`🌅 ${formatTime(sunrise)}`} sub="Early morning light"  iconColor="text-yellow-500" />
      <SunCard label="Daylight" value={`${daylightHours} hrs`}       sub="Hours of daylight"   iconColor="text-orange-500" />
      <SunCard label="Sunset"   value={`🌇 ${formatTime(sunset)}`}  sub="Evening twilight"    iconColor="text-red-500"    />
    </div>
  );
};

export default SunriseSunsetBar;