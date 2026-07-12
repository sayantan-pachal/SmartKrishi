/* eslint-disable no-unused-vars */
import { Sun, Moon, Clock } from 'lucide-react';

const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

const SunCard = ({ label, value, sub, icon: Icon, iconColor }) => (
    <div className="flex items-center gap-4 py-3 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0 first:pt-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] ${iconColor}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-0.5">{label}</p>
            <p className="font-bold text-sm text-[#111] dark:text-white mb-0.5">{value}</p>
            <p className="text-[10px] font-medium text-gray-500">{sub}</p>
        </div>
    </div>
);

const SunriseSunsetBar = ({ sunrise, sunset }) => {
    const daylightHours = ((sunset - sunrise) / 3600).toFixed(1);

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-black/5 dark:border-white/5 p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">Solar Cycle</h3>
            <div className="flex flex-col">
                <SunCard 
                    label="Sunrise"  
                    value={formatTime(sunrise)} 
                    sub="Morning light"  
                    icon={Sun}
                    iconColor="text-amber-500" 
                />
                <SunCard 
                    label="Daylight" 
                    value={`${daylightHours} hrs`}       
                    sub="Total sun exposure"   
                    icon={Clock}
                    iconColor="text-orange-500" 
                />
                <SunCard 
                    label="Sunset"   
                    value={formatTime(sunset)}  
                    sub="Evening twilight"    
                    icon={Moon}
                    iconColor="text-indigo-500"    
                />
            </div>
        </div>
    );
};

export default SunriseSunsetBar;