import { useState } from "react";
import ThemeToggle from "./ThemeToggle"
import { Menu, X, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Fields", to: "/fields" },
    { label: "Crops", to: "/crops" },
    { label: "Advisory", to: "/advisory" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const navigate = useNavigate();

    // 1. Fetch user session and database from localStorage
    const session = JSON.parse(localStorage.getItem("smartkrishi_session"));
    const users = JSON.parse(localStorage.getItem("smartkrishi_users")) || [];

    // 2. Find the full details of the current logged-in user
    const currentUser = users.find((u) => u.email === session?.email);

    const handleLogout = () => {
        // 3. Remove the CORRECT key on logout
        localStorage.removeItem("smartkrishi_session");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="bg-[linear-gradient(180deg,#f0fdf4,#dcfce7)] dark:bg-[linear-gradient(180deg,#020617,#020617)] dark:border-gray-700 fixed top-0 z-50 w-full border-b ">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Logo />
                </div>
                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `font-semibold transition-colors duration-200 ${isActive
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-700 dark:text-gray-300"
                                    } hover:text-green-600 dark:hover:text-green-400 lg:p-0`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                {/* Right Section */}
                <div className="flex items-center gap-4 relative">
                    {/* Dark Mode Toggle */}
                    <ThemeToggle />
                    {/* User Avatar */}
                    <button onClick={() => setUserOpen(!userOpen)} className="focus:outline-none hover:opacity-80 transition">
                        <UserRound className="w-9 h-9 p-1.5 rounded-full border border-gray-800 dark:border-gray-600 text-gray-600 dark:text-gray-400" />
                    </button>
                    {/* User Dropdown */}
                    {userOpen && (
                        <div className="absolute right-0 top-12 w-56 bg-[#f0fdf4] dark:bg-gray-800 border dark:border-gray-700 rounded-tr-2xl rounded-bl-2xl shadow-xl overflow-hidden z-50">
                            <div className="px-4 py-3 border-b dark:border-gray-700 bg-green-50/30 dark:bg-gray-800/50">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={currentUser?.name}>
                                    {currentUser?.name || "Farmer"}
                                </p>
                                <p className="text-xs text-gray-500 truncate" title={currentUser?.email}>
                                    {currentUser?.email || ""}
                                </p>
                            </div>
                            <ul className="text-sm dark:text-gray-300">
                                <li>
                                    <Link to="/profile" onClick={() => setUserOpen(false)} className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/reset-password" onClick={() => setUserOpen(false)} className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
                                        Reset Password
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" onClick={() => setUserOpen(false)} className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-6 h-6 text-gray-500 dark:text-gray-400" /> : <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 px-4 rounded-lg font-semibold transition-colors ${isActive
                                        ? "bg-orange-50 text-green-600 dark:bg-orange-900/20 dark:text-green-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </div>
            )}
        </nav>
    );
}