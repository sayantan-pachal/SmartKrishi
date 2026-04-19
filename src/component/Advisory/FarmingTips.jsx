import { farmingTips } from '../../data/weatherUtils';

const FarmingTips = () => (
  <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Farming Tips</h3>
    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
      {farmingTips.map((tip, i) => <li key={i}>• {tip}</li>)}
    </ul>
  </div>
);

export default FarmingTips;