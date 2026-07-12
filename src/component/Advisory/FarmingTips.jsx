import { farmingTips } from '../../data/weatherUtils';
import { Lightbulb } from 'lucide-react';

const FarmingTips = () => (
    <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-black/5 dark:border-white/5 p-6">
        <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                <Lightbulb size={16} />
            </div>
            <h3 className="font-fraunces font-bold text-lg text-[#111] dark:text-white">Pro Tips</h3>
        </div>
        <ul className="space-y-3">
            {farmingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-smart-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{tip}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default FarmingTips;