import { Link } from "react-router-dom";
import Logo from "./../../../public/Logo";
import { Leaf, CloudRain, Bug, TabletSmartphone, Monitor } from "lucide-react";

export default function Footer() {
    return (
        <div>
            {/* Added font-dm here to cascade through the entire footer */}
            <footer className="bg-[linear-gradient(180deg,#f0fdf4,#dcfce7)] dark:bg-[linear-gradient(180deg,#020617,#020617)] text-gray-300 border-t border-[rgba(255,255,255,0.08)] font-dm">
                <div className="max-w-screen-xl mx-auto px-6 py-10 md:px-12">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <Link to="/" aria-label="SmartKrishi Home" className="flex items-center gap-3 mb-3">
                                <Logo />
                            </Link>
                            <p className="text-sm text-gray-700 dark:text-[#94a3b8] max-w-xs">
                                SmartKrishi helps farmers manage multiple fields, monitor crops,
                                get weather-based advisories, and detect crop diseases using
                                intelligent image analysis.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                            <div>
                                <h2 className="text-black dark:text-white font-semibold mb-3">Navigation</h2>
                                <nav aria-label="Footer Navigation">
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                                        <li>
                                            <Link to="/" className="hover:text-green-600">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/fields" className="hover:text-green-600">
                                                My Fields
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/advisory" className="hover:text-green-600">
                                                Advisory
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/about" className="hover:text-green-600">
                                                About SmartKrishi
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div>
                                <h2 className="text-black dark:text-white font-semibold mb-3">Key Features</h2>
                                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <Leaf size={16} aria-hidden="true" /> Multi-field crop management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CloudRain size={16} aria-hidden="true" /> Weather-based farming advisory
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Bug size={16} aria-hidden="true" /> Crop disease & pest detection
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-black dark:text-white font-semibold mb-3">Legal</h2>
                                <nav aria-label="Legal Navigation">
                                    <ul className="text-gray-500 font-medium">
                                        <li className="mb-4">
                                            <Link to="/legal" className="hover:text-gray-400 hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/legal" className="hover:text-gray-400 hover:underline">
                                                Terms & Conditions
                                            </Link>
                                        </li>
                                        <li className="mt-4">
                                            <TabletSmartphone className="block lg:hidden" aria-hidden="true" />
                                            <Monitor className="hidden lg:block" aria-hidden="true" />
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.1)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#94a3b8]">
                        <span className="text-sm text-gray-700 dark:text-gray-500 sm:text-center">
                            © {new Date().getFullYear()} SmartKrishi. All rights reserved.
                        </span>
                        <span className="mt-3 sm:mt-0 text-gray-700 dark:text-gray-500">
                            Built for farmers 🌾
                        </span>
                        <span className="mt-3 sm:mt-0 text-gray-700 dark:text-gray-500">
                            Designed & Developed by <a href="https://sayantanpachal.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-green-600">
                                Sayantan Pachal
                            </a>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}