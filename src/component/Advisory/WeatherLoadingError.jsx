import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';

export const WeatherLoading = () => (
  <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-black dark:to-gray-900 pt-28 px-4 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-flex p-6 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
        <Loader2 size={48} className="text-green-600 dark:text-green-400 animate-spin" />
      </div>
      <p className="text-green-600 dark:text-green-400 font-bold text-xl">
        Detecting location and fetching weather...
      </p>
    </div>
  </div>
);

export const WeatherError = ({ error, onRetry }) => (
  <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
    <div className="flex items-start gap-3">
      <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
      <div className="flex-1">
        <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Error</h3>
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          <RotateCcw size={16} /> Retry Access
        </button>
      </div>
    </div>
  </div>
);