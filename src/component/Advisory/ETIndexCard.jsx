import { Droplets } from 'lucide-react';
import { calculateETIndex } from '../../data/weatherUtils';

const ETIndexCard = ({ temp, humidity }) => {
    const et = calculateETIndex(temp, humidity);

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-black/5 dark:border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${et.bgColor}`}>
                    <Droplets className={et.color} size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Evapotranspiration</p>
                    <p className={`font-fraunces font-bold text-xl ${et.color}`}>{et.level}</p>
                </div>
            </div>
            
            <div className={`p-4 rounded-xl border ${et.bgColor} border-transparent mb-4`}>
                <p className={`text-sm font-semibold leading-relaxed ${et.color}`}>
                    {et.advice}
                </p>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                ET Index measures water loss from soil & plants. High values require increased irrigation cycles.
            </p>
        </div>
    );
};

export default ETIndexCard;