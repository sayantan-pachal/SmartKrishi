import { Calendar } from 'lucide-react';
import { calculateETIndex } from '../../data/weatherUtils';

const formatDate = (dateString) =>
  new Date(dateString + ' 00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const ForecastGrid = ({ forecast }) => {
  if (!forecast?.length) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar size={28} /> 5-Day Forecast
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, idx) => {
          const date      = day.dt_txt.split(' ')[0];
          const temp      = Math.round(day.main.temp);
          const humidity  = day.main.humidity;
          const windSpeed = (day.wind.speed * 3.6).toFixed(1);
          const etData    = calculateETIndex(temp, humidity);

          return (
            <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
              <p className="font-bold text-gray-900 dark:text-white mb-3">{formatDate(date)}</p>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{temp}°C</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{day.weather[0].main}</p>
                <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p>💧 {humidity}%</p>
                  <p>💨 {windSpeed} km/h</p>
                  <p className={`font-semibold ${etData.color}`}>ET: {etData.level}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastGrid;