import { Bug, AlertCircle, Droplets, ThermometerSun } from 'lucide-react';

const DiseaseRiskCard = ({ weather }) => {
    const humidity = weather.main.humidity;
    const temp = weather.main.temp;

    // Calculate Risk based on Humidity and Temp combinations
    let risk = { level: "Low Risk", color: "text-emerald-500", bar: "bg-emerald-500", w: "w-1/4", msg: "Conditions do not favor fungal growth." };

    if (humidity > 85 && temp > 20 && temp < 30) {
        risk = { level: "Critical Risk", color: "text-red-500", bar: "bg-red-500", w: "w-full", msg: "High humidity and warmth strongly promote blight and mildew. Monitor crops closely." };
    } else if (humidity > 70 && temp > 15) {
        risk = { level: "Moderate Risk", color: "text-amber-500", bar: "bg-amber-500", w: "w-1/2", msg: "Elevated moisture may encourage fungal spores. Ensure good air circulation." };
    } else if (humidity < 30 && temp > 30) {
         risk = { level: "Pest Warning", color: "text-amber-500", bar: "bg-amber-500", w: "w-1/2", msg: "Hot, dry conditions may increase risks of mites and certain insects." };
    }

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-black/5 dark:border-white/5 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Plant Health</p>
                    <h3 className="font-fraunces font-bold text-lg text-[#111] dark:text-white">Disease Risk</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] ${risk.color}`}>
                    <Bug size={20} />
                </div>
            </div>

            <div className="mb-5">
                <div className="flex items-end justify-between mb-2">
                    <p className={`font-bold text-lg ${risk.color}`}>{risk.level}</p>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${risk.bar} ${risk.w} rounded-full transition-all duration-1000`} />
                </div>
            </div>

            <div className="flex items-start gap-2 mb-4 bg-gray-50/50 dark:bg-white/[0.02] p-3 rounded-xl border border-black/5 dark:border-white/5">
                <AlertCircle size={14} className={`${risk.color} mt-0.5 flex-shrink-0`} />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    {risk.msg}
                </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <Droplets size={12} /> {humidity}% Hum
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <ThermometerSun size={12} /> {Math.round(temp)}°C Temp
                </div>
            </div>
        </div>
    );
};

export default DiseaseRiskCard;