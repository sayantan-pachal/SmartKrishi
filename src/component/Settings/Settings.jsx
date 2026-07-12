/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import {
    User,
    Bell,
    Lock,
    Globe,
    Shield,
    ChevronRight,
    Save,
    Settings as SettingsIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageBackground, Reveal } from "../DashTemp/DashboardComponents";
import CustomDropdown from "../Other/CustomDropdown";

function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("English");

    // Mock data from session
    const session = JSON.parse(localStorage.getItem("smartkrishi_session"));

    const SettingSection = ({ title, children, delay = 0 }) => (
        <Reveal delay={delay}>
            <div className="mb-10">
                <h2 className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-4 px-2">
                    {title}
                </h2>
                {/* REMOVED overflow-hidden and added relative z-10 so dropdowns can overlap */}
                <div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-sm flex flex-col relative z-10">
                    {children}
                </div>
            </div>
        </Reveal>
    );

    const SettingItemContent = ({ icon: Icon, label, desc, action, danger }) => (
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${danger
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                        : 'bg-gray-50 dark:bg-white/[0.05] text-smart-green-600 dark:text-smart-green-400 group-hover:bg-smart-green-50 dark:group-hover:bg-smart-green-500/10'
                    }`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className={`font-bold text-base ${danger ? 'text-red-600 dark:text-red-400' : 'text-[#111] dark:text-white'}`}>
                        {label}
                    </p>
                    {desc && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>}
                </div>
            </div>
            <div className="shrink-0 flex items-center">
                {action}
            </div>
        </div>
    );

    const SettingItem = (props) => {
        const baseClasses = "group border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors block w-full text-left first:rounded-t-[2.5rem] last:rounded-b-[2.5rem]";

        if (props.to) {
            return (
                <Link to={props.to} className={baseClasses}>
                    <SettingItemContent {...props} />
                </Link>
            );
        }

        return (
            <div className={baseClasses}>
                <SettingItemContent {...props} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-[#111] dark:text-gray-100 pt-24 pb-24 transition-colors duration-300">
            <PageBackground />

            <div className="relative max-w-3xl mx-auto px-6">

                {/* ── Page header ── */}
                <div className="mb-12" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 mb-3 block">
                        Preferences
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
                        <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
                            Account <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent ml-2">Settings</em>
                            <SettingsIcon className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-3 hidden sm:block" />
                        </h1>
                    </div>
                </div>

                {/* ── Account Settings ── */}
                <SettingSection title="Account & Security" delay={50}>
                    <SettingItem
                        to="/profile"
                        icon={User}
                        label="Profile Information"
                        desc={session?.email || "Manage your personal details"}
                        action={<ChevronRight size={18} className="text-gray-400 group-hover:text-smart-green-500 transition-colors" />}
                    />
                    <SettingItem
                        to="/reset-password"
                        icon={Lock}
                        label="Password & Security"
                        desc="Change password and 2FA"
                        action={<ChevronRight size={18} className="text-gray-400 group-hover:text-smart-green-500 transition-colors" />}
                    />
                </SettingSection>

                {/* ── Preferences ── */}
                <SettingSection title="App Preferences" delay={100}>
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
                        desc="Change platform language"
                        action={
                            <div className="w-20 relative z-50 md:w-40">
                                <CustomDropdown
                                    name="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    options={[
                                        { label: "English", value: "English" },
                                        { label: "Bengali", value: "Bengali" }
                                    ]}
                                    required={false}
                                />
                            </div>
                        }
                    />
                </SettingSection>

                {/* ── Support & Legal ── */}
                <SettingSection title="Legal & Danger Zone" delay={150}>
                    <SettingItem
                        icon={Shield}
                        label="Privacy Policy"
                        desc="How we handle your data"
                        action={<ChevronRight size={18} className="text-gray-400 group-hover:text-smart-green-500 transition-colors" />}
                    />
                    <SettingItem
                        to="/profile"
                        icon={Shield}
                        label="Delete Account"
                        desc="Permanently remove your data"
                        danger={true}
                        action={<ChevronRight size={18} className="text-red-400 group-hover:text-red-500 transition-colors" />}
                    />
                </SettingSection>

                {/* ── Save Button ── */}
                <Reveal delay={200}>
                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-smart-green-900/10 hover:shadow-smart-green-900/20 transition-all active:scale-95 text-lg">
                        <Save size={20} />
                        Save All Changes
                    </button>
                </Reveal>
            </div>

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default Settings;