import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { Reveal } from "../DashTemp/DashboardComponents";

export const WeatherLoading = () => (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm flex items-center justify-center pt-28 transition-colors duration-300">
        <div className="text-center">
            <div className="inline-flex p-6 bg-smart-green-50 dark:bg-smart-green-900/20 rounded-full mb-5">
                <Loader2 className="w-10 h-10 text-smart-green-600 animate-spin" />
            </div>
            <p className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2">Analyzing atmosphere</p>
            <p className="text-sm text-gray-400">Fetching localized climate data…</p>
        </div>
    </div>
);

export const WeatherError = ({ error, onRetry }) => (
    <Reveal>
        <div className="mb-8 p-6 bg-red-50 dark:bg-white/[0.02] border border-red-200 dark:border-red-900/30 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                    <h3 className="font-fraunces font-bold text-xl text-red-700 dark:text-red-400 mb-1">Connection Error</h3>
                    <p className="text-red-600/80 dark:text-red-400/80 text-sm font-medium">{error}</p>
                </div>
            </div>
            <button
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-sm w-full sm:w-auto"
            >
                <RotateCcw size={16} /> Retry Connection
            </button>
        </div>
    </Reveal>
);