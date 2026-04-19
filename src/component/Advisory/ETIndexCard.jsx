import { Droplet } from 'lucide-react';
import { calculateETIndex } from '../../data/weatherUtils';

const ETIndexCard = ({ temp, humidity }) => {
  const et = calculateETIndex(temp, humidity);

  return (
    <div className={`mb-8 p-6 rounded-2xl border-2 ${et.bgColor}`}>
      <div className="flex items-start gap-4">
        <Droplet className={`${et.color} flex-shrink-0`} size={32} />
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${et.color} mb-2`}>
            Evapotranspiration (ET) Index: {et.level}
          </h3>
          <p className={`${et.color} mb-2`}>{et.advice}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            💡 ET Index is calculated based on temperature and humidity. High values indicate
            more water loss from soil and plants, requiring increased irrigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ETIndexCard;