import { Calendar } from 'lucide-react';
import { calculateETIndex } from '../../data/weatherUtils';

const formatDate = (dateString) => {
    const date = new Date(dateString + ' 00:00');
    return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
};

const ForecastGrid = ({ forecast }) => {
    if (!forecast?.length) return null;

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-black/5 dark:border-white/5 p-8">
            <h3 className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-white/10 flex items-center justify-center text-blue-500"><Calendar size={16} /></span>
                5-Day Outlook
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {forecast.map((day, idx) => {
                    const dateInfo = formatDate(day.dt_txt.split(' ')[0]);
                    const temp = Math.round(day.main.temp);
                    const humidity = day.main.humidity;
                    const etData = calculateETIndex(temp, humidity);

                    return (
                        <div key={idx} className="bg-gray-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center text-center hover:bg-white dark:hover:bg-white/[0.04] transition-colors">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{dateInfo.day}</p>
                            <p className="text-sm font-bold text-[#111] dark:text-white mb-3">{dateInfo.dateNum}</p>
                            
                            <div className="font-fraunces font-bold text-3xl text-[#111] dark:text-white mb-1">
                                {temp}°
                            </div>
                            <p className="text-[10px] font-semibold text-smart-green-600 dark:text-smart-green-400 uppercase tracking-wider mb-4 h-6 flex items-center">
                                {day.weather[0].main}
                            </p>
                            
                            <div className="w-full pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                <p>💧 {humidity}%</p>
                                <p className={`font-bold mt-1 ${etData.color}`}>ET: {etData.level}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastGrid;