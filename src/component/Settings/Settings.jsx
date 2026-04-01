/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import {
    User,
    Bell,
    Lock,
    Globe,
    Moon,
    Shield,
    ChevronRight,
    Save
} from "lucide-react";
import { Link } from "react-router-dom";

function Settings() {
    const [notifications, setNotifications] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("English");

    // Mock data from session
    const session = JSON.parse(localStorage.getItem("smartkrishi_session"));

    const SettingSection = ({ title, children }) => (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 px-2">
                {title}
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm divide-y dark:divide-gray-800">
                {children}
            </div>
        </div>
    );

    // eslint-disable-next-line no-unused-vars
    const SettingItem = ({ icon: Icon, label, desc, action, danger }) => (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${danger ? 'bg-red-100 text-red-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className={`font-semibold ${danger ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}>{label}</p>
                    {desc && <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>}
                </div>
            </div>
            {action}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-28 px-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                {/* Account Settings */}
                <SettingSection title="Account">
                    <Link to="/profile">
                        <SettingItem
                            icon={User}
                            label="Profile Information"
                            desc={session?.email || "Manage your personal details"}
                            action={<ChevronRight size={18} className="text-gray-400" />}
                        />
                    </Link>
                    <Link to="/reset-password">
                        <SettingItem
                            icon={Lock}
                            label="Password & Security"
                            desc="Change password and 2FA"
                            action={<ChevronRight size={18} className="text-gray-400" />}
                        />
                    </Link>
                </SettingSection>

                {/* Preferences */}
                <SettingSection title="Preferences">
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        desc="Alerts for crop health & weather"
                        action={
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'left-6' : 'left-1'}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Globe}
                        label="App Language"
                        desc={language}
                        action={
                            <select
                                className="bg-transparent text-sm font-semibold text-green-600 focus:outline-none cursor-pointer"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option>English</option>
                                <option>Bengali</option>
                                <option>Hindi</option>
                            </select>
                        }
                    />
                </SettingSection>

                {/* Support & Legal */}
                <SettingSection title="More">
                    <SettingItem
                        icon={Shield}
                        label="Privacy Policy"
                        action={<ChevronRight size={18} className="text-gray-400" />}
                    />
                    <SettingItem
                        icon={Shield}
                        label="Delete Account"
                        desc="Permanently remove your data"
                        danger
                        action={<ChevronRight size={18} className="text-red-400" />}
                    />
                </SettingSection>

                <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg transition-all">
                    <Save size={20} />
                    Save All Changes
                </button>
            </div>
        </div>
    );
}

export default Settings;