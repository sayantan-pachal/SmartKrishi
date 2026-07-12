import { getWeatherGradient } from '../../data/weatherUtils';
import { MapPin, Sun, Moon } from 'lucide-react';

const WeatherHero = ({ weather, locationName }) => {
    // 1. Base Background Gradient
    const baseGradient = getWeatherGradient(weather.main.temp);
    
    // 2. Time & Celestial Calculations
    // eslint-disable-next-line react-hooks/purity
    const currentTime = weather.dt || Math.floor(Date.now() / 1000);
    const sunrise = weather.sys?.sunrise || (currentTime - 43200);
    const sunset = weather.sys?.sunset || (currentTime + 43200);

    // Determine if it's currently Day or Night
    const isDay = currentTime >= sunrise && currentTime < sunset;
    
    // Calculate how far along the Day or Night we are (0.0 to 1.0)
    let progress = 0;
    if (isDay) {
        progress = (currentTime - sunrise) / (sunset - sunrise);
    } else {
        const nightDuration = 86400 - (sunset - sunrise); 
        if (currentTime >= sunset) {
            progress = (currentTime - sunset) / nightDuration;
        } else {
            progress = ((currentTime + 86400) - sunset) / nightDuration;
        }
    }
    
    // Keep progress between 2% and 98% so the icon doesn't fall off the edges
    const safeProgress = Math.max(0.02, Math.min(0.98, progress));
    
    // 3. Dynamic Greeting based on local hour
    const currentHour = new Date(currentTime * 1000).getHours();
    let greeting = "Good Evening";
    if (currentHour >= 5 && currentHour < 12) greeting = "Good Morning";
    else if (currentHour >= 12 && currentHour < 17) greeting = "Good Afternoon";

    return (
        <div className={`relative overflow-hidden p-8 md:p-10 rounded-[2rem] bg-gradient-to-br ${baseGradient} text-white shadow-xl shadow-black/5 dark:shadow-black/20 font-dm transition-colors duration-1000`}>
            
            {/* Glassy Overlays for Texture */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* 3-Part Grid Layout */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6 items-center">
                
                {/* --- PART 1: LOCATION, GREETING, CONDITIONS --- */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-md rounded-lg mb-4 border border-white/10 shadow-sm">
                        <MapPin size={14} className="text-white/90" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/90">
                            {locationName}
                        </span>
                    </div>
                    
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-white/70 mb-1">
                        {greeting}
                    </p>
                    <h2 className="font-fraunces font-bold text-4xl mb-2 tracking-tight capitalize">
                        {weather.weather[0].description}
                    </h2>
                </div>

                {/* --- PART 2: THE SKY TRACKER --- */}
                <div className="relative w-full max-w-[260px] mx-auto h-32 flex flex-col justify-end">
                    
                    {/* The Dashed Arc representing the sky */}
                    <div className="absolute bottom-6 w-full h-[70px] border-t-2 border-l-2 border-r-2 border-dashed border-white/30 rounded-t-full" />

                    {/* The Moving Sun/Moon */}
                    <div 
                        className="absolute z-10 transition-all duration-1000 ease-in-out"
                        style={{ 
                            left: `${safeProgress * 100}%`, 
                            bottom: `calc(24px + ${Math.sin(safeProgress * Math.PI) * 70}px)`,
                            transform: 'translate(-50%, -50%)' // Centers the icon exactly on the line
                        }}
                    >
                        {isDay ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-[20px] opacity-70 w-16 h-16 -left-4 -top-4" />
                                <Sun size={32} className="text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,1)] animate-[spin_30s_linear_infinite] relative z-10" />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-200 rounded-full blur-[20px] opacity-40 w-16 h-16 -left-4 -top-4" />
                                <Moon size={28} className="text-blue-100 drop-shadow-[0_0_10px_rgba(219,234,254,0.8)] relative z-10" />
                            </div>
                        )}
                    </div>

                    {/* Labels under the arc */}
                    <div className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60 mt-auto">
                        <span className="relative -left-6">{isDay ? 'Sunrise' : 'Sunset'}</span>
                        <span className="relative left-6">{isDay ? 'Sunset' : 'Sunrise'}</span>
                    </div>
                </div>
                
                {/* --- PART 3: TEMPERATURE BLOCK --- */}
                <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
                    <div className="bg-black/10 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/10 min-w-[200px] shadow-lg w-full lg:w-auto">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 mb-1">
                            Current Temp
                        </p>
                        <div className="font-fraunces font-black text-6xl tracking-tighter mb-2">
                            {Math.round(weather.main.temp)}°
                        </div>
                        <p className="text-sm font-medium text-white/80">
                            Feels like {Math.round(weather.main.feels_like)}°C
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeatherHero;