import { SprayCan, Wind, CloudRain, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const SprayWindowCard = ({ weather }) => {
    const windKmh = weather.wind.speed * 3.6;
    const isRaining = weather.weather[0].main.toLowerCase().includes('rain');
    const temp = weather.main.temp;

    // Determine Spraying Conditions
    let status = { text: "Optimal for Spraying", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30", icon: CheckCircle2, reason: "Wind and temperature are ideal." };

    if (isRaining) {
        status = { text: "Do Not Spray", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/30", icon: XCircle, reason: "Rain will wash away chemicals." };
    } else if (windKmh > 15) {
        status = { text: "Poor Conditions", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/30", icon: XCircle, reason: "High wind will cause chemical drift." };
    } else if (temp > 30) {
        status = { text: "Marginal Conditions", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-900/30", icon: AlertTriangle, reason: "High temps may cause leaf burn." };
    } else if (windKmh > 10) {
        status = { text: "Marginal Conditions", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-900/30", icon: AlertTriangle, reason: "Moderate wind. Spray with caution." };
    }

    const StatusIcon = status.icon;

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-black/5 dark:border-white/5 p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] text-gray-500`}>
                    <SprayCan size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Operations</p>
                    <h3 className="font-fraunces font-bold text-lg text-[#111] dark:text-white">Spraying Window</h3>
                </div>
            </div>

            <div className={`p-4 rounded-2xl border ${status.bg} ${status.border} flex items-start gap-3 mb-5`}>
                <StatusIcon className={`${status.color} mt-0.5 flex-shrink-0`} size={18} />
                <div>
                    <p className={`font-bold text-sm mb-1 ${status.color}`}>{status.text}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{status.reason}</p>
                </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 border-t border-black/5 dark:border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Wind size={14} className="text-gray-400" />
                    {windKmh.toFixed(1)} km/h
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <CloudRain size={14} className="text-gray-400" />
                    {isRaining ? "Precipitation" : "Dry"}
                </div>
            </div>
        </div>
    );
};

export default SprayWindowCard;