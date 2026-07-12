import { getFarmingAdvice } from '../../data/weatherUtils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const typeStyles = {
    warning: {
        bg: "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30",
        text: "text-red-900 dark:text-red-300",
        icon: <AlertCircle className="text-red-600 dark:text-red-400 mt-1 flex-shrink-0" size={20} />
    },
    caution: {
        bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30",
        text: "text-amber-900 dark:text-amber-300",
        icon: <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
    },
    success: {
        bg: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30",
        text: "text-emerald-900 dark:text-emerald-300",
        icon: <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={20} />
    },
    info: {
        bg: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30",
        text: "text-blue-900 dark:text-blue-300",
        icon: <Info className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
    },
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
        <div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-black/5 dark:border-white/5 p-8 h-full">
            <h3 className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-smart-green-50 dark:bg-white/10 flex items-center justify-center text-sm">📝</span>
                Actionable Advisory
            </h3>
            <div className="space-y-4">
                {advisories.map((advice, idx) => {
                    const style = typeStyles[advice.type] || typeStyles.info;
                    return (
                        <div key={idx} className={`p-5 rounded-2xl border transition-colors ${style.bg}`}>
                            <div className="flex items-start gap-4">
                                {style.icon}
                                <div>
                                    <p className={`font-semibold text-sm leading-relaxed ${style.text}`}>
                                        {advice.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvisoryCards;