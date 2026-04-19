import { getFarmingAdvice } from '../../data/weatherUtils';

const typeStyles = {
  warning: "bg-red-50 dark:bg-red-900/10 border-red-500 text-red-700 dark:text-red-300",
  caution: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500 text-yellow-700 dark:text-yellow-300",
  success: "bg-green-50 dark:bg-green-900/10 border-green-500 text-green-700 dark:text-green-300",
  info:    "bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-700 dark:text-blue-300",
};

const AdvisoryCards = ({ weather }) => {
  const advisories = getFarmingAdvice(
    weather.main.temp,
    weather.main.humidity,
    weather.wind.speed * 3.6,
    weather.clouds.all,
    weather.rain?.['1h'] || 0
  );

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📋 Today's Advisory</h3>
      {advisories.map((advice, idx) => (
        <div key={idx} className={`p-6 rounded-2xl border-l-4 shadow-sm ${typeStyles[advice.type] ?? typeStyles.info}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{advice.icon}</span>
            <p className="font-semibold text-lg">{advice.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvisoryCards;