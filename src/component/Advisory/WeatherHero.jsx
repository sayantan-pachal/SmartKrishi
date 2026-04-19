import { getWeatherGradient } from '../../data/weatherUtils';

const WeatherHero = ({ weather, locationName }) => (
  <div className={`mb-8 p-8 rounded-3xl bg-gradient-to-br ${getWeatherGradient(weather.main.temp)} text-white shadow-lg`}>
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
);

export default WeatherHero;