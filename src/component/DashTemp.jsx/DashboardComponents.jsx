/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useWeather } from "../../hooks/useWeather";

// useReveal — intersection-observer scroll hook
export const useReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
};

// Reveal — fade-up wrapper driven by useReveal
export const Reveal = ({ children, delay = 0, className = "" }) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

//    StatCard — single KPI tile in the stats grid
//    Props: label, value, sub, icon, iconColor, accent (bool), health (0-100 | undefined)
export const StatCard = ({
    label,
    value,
    sub,
    icon: Icon,
    iconColor = "text-smart-green-600",
    accent = false,
    health,
}) => {
    const healthGrad =
        health !== undefined
            ? health >= 80
                ? "from-smart-green-500 to-emerald-500"
                : health >= 60
                    ? "from-yellow-500 to-orange-400"
                    : "from-red-500 to-rose-500"
            : null;

    const valueColor =
        health !== undefined
            ? health >= 80
                ? "text-smart-green-600 dark:text-smart-green-400"
                : health >= 60
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
            : "text-[#111] dark:text-white";

    return (
        <div className="group relative bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-2xl p-6 hover:border-smart-green-200 dark:hover:border-smart-green-800 hover:shadow-lg hover:shadow-smart-green-900/5 transition-all duration-300 overflow-hidden">
            {accent && (
                <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${healthGrad ?? "from-smart-green-500 to-transparent"}`}
                />
            )}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                    {label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-smart-green-50 dark:bg-smart-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
            </div>
            <p
                className={`text-4xl font-fraunces font-bold tracking-tight mb-1 ${valueColor}`}
            >
                {value}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                {sub}
            </p>
        </div>
    );
};

// PanelCard — white rounded panel with an icon-badge + title + subtitle header
// Props: icon, iconBg, iconColor, title, subtitle, children
export const PanelCard = ({
    icon: Icon,
    iconBg = "bg-smart-green-50 dark:bg-smart-green-900/20",
    iconColor = "text-smart-green-600",
    title,
    subtitle,
    children,
    className = "",
}) => (
    <div
        className={`bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-2xl p-6 h-full ${className}`}
    >
        <div className="flex items-center gap-2.5 mb-5">
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}
            >
                <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div>
                <p className="font-bold text-[#111] dark:text-white text-sm">{title}</p>
                {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
            </div>
        </div>
        {children}
    </div>
);

// EmptyState — centred icon + message || Props: icon, message
export const EmptyState = ({ icon: Icon, message }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <Icon className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-3" />
        <p className="text-sm text-gray-400">{message}</p>
    </div>
);

// HarvestItem — single row inside a harvest list
// Props: name, daysLeft, date (Date), accentBg, accentBorder, accentHover, badgeBg, formatDate
export const HarvestItem = ({
    name,
    daysLeft,
    date,
    accentBg = "bg-orange-50 dark:bg-orange-900/10",
    accentBorder = "border-orange-100 dark:border-orange-900/30",
    accentHover = "hover:border-orange-300 dark:hover:border-orange-700",
    badgeBg = "bg-orange-500",
    formatDate,
}) => (
    <div
        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${accentBg} ${accentBorder} ${accentHover}`}
    >
        <div>
            <p className="font-semibold text-sm text-[#111] dark:text-white capitalize">
                {name}
            </p>
            <p className="text-[11px] text-gray-400">
                in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </p>
        </div>
        <span
            className={`px-3 py-1 text-white text-[11px] rounded-full font-bold ${badgeBg}`}
        >
            {formatDate(date)}
        </span>
    </div>
);

// SeasonChip — coloured season pill
// Props: season, seasonMeta (object with bg/border/color/emoji)
export const SeasonChip = ({ season, meta }) => {
    const Icon = meta?.icon;
    return (
        <div className={`p-3.5 rounded-xl border ${meta?.bg ?? "bg-gray-50 dark:bg-gray-900/20"} ${meta?.border ?? "border-gray-200 dark:border-gray-700"}`}>
            <p className={`font-semibold text-sm flex items-center gap-2 ${meta?.color ?? "text-gray-600"}`}>
                {Icon && <Icon size={16} />}
                {season} Season
            </p>
        </div>
    );
};

// SectionHeader — eyebrow label + large heading
// Props: eyebrow, heading
export const SectionHeader = ({ eyebrow, heading }) => (
    <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 block mb-1">
            {eyebrow}
        </span>
        <h2 className="font-fraunces font-bold text-3xl md:text-4xl tracking-[-0.02em]">
            {heading}
        </h2>
    </div>
);

// QuickAccessGrid — tiled card grid from config
// Props: cards — array of { title, desc, icon, link, color }
export const QuickAccessGrid = ({ cards }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/6 dark:bg-white/6 rounded-[2.5rem] overflow-hidden border border-black/6 dark:border-white/6">
        {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
                <Link
                    to={card.link}
                    className="group relative h-full bg-[#f5f4f0] dark:bg-[#0a0a0a] p-8 hover:bg-white dark:hover:bg-[#111] transition-colors duration-500 block"
                >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-smart-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                        <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-300 dark:text-gray-600 mb-2.5 group-hover:text-smart-green-500 transition-colors duration-300">
                        0{i + 1}
                    </p>
                    <h3 className="font-fraunces font-bold text-lg tracking-tight mb-2">
                        {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {card.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-smart-green-600 dark:text-smart-green-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                        Open <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </Link>
            </Reveal>
        ))}
    </div>
);

// FooterBanner — full-width dark CTA strip
// Props: heading (node), body (string)
export const FooterBanner = ({ heading, body }) => (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0e1f06] py-14 px-8 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(90,180,20,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative z-10">
            <p className="font-fraunces font-black text-2xl md:text-3xl tracking-tight mb-3">
                {heading}
            </p>
            <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                {body}
            </p>
        </div>
    </div>
);

// HealthBar — full-width health progress strip
// Props: percent (0-100), message ({ icon, text })
export const HealthBar = ({ percent, message }) => {
    const grad =
        percent >= 80
            ? "from-smart-green-500 to-emerald-500"
            : percent >= 60
                ? "from-yellow-500 to-orange-400"
                : "from-red-500 to-rose-500";

    const valueColor =
        percent >= 80
            ? "text-smart-green-600 dark:text-smart-green-400"
            : percent >= 60
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400";

    return (
        <div className="bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                        Overall Farm Health
                    </p>
                    <h3 className="font-fraunces font-bold text-2xl tracking-tight text-[#111] dark:text-white">
                        {message.icon} {message.text}
                    </h3>
                </div>
                <span
                    className={`font-fraunces font-black text-4xl tracking-tight ${valueColor}`}
                >
                    {percent}%
                </span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/6 dark:bg-white/8 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

// PageBackground — fixed dot-grid + radial glow
export const PageBackground = () => (
    <div>
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(59,109,17,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="fixed top-0 left-0 right-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,109,17,0.07),transparent_70%)] pointer-events-none" />
    </div>
);

import { CloudSun, History, Zap } from "lucide-react";

// 1. Weather Insights Section
export const WeatherSection = () => {
    const { weather, loading } = useWeather();

    if (loading || !weather) {
        return (
            <PanelCard
                icon={CloudSun}
                title="Weather Insights"
                subtitle="Loading weather data..."
            >
                <p className="text-sm text-gray-400">Fetching latest conditions…</p>
            </PanelCard>
        );
    }

    return (
        <PanelCard
            icon={CloudSun}
            iconBg="bg-amber-50 dark:bg-amber-900/20"
            iconColor="text-amber-500"
            title="Weather Insights"
            subtitle={weather.name}
        >
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/5 dark:to-orange-900/5 rounded-2xl border">
                <div>
                    <p className="text-3xl font-fraunces font-bold">
                        {Math.round(weather.main.temp)}°C
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        {weather.weather[0].description}
                    </p>
                </div>

                <div className="text-right text-sm font-medium">
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind: {Math.round(weather.wind.speed * 3.6)} km/h</p>
                </div>
            </div>
        </PanelCard>
    );
};

// 2. Recent Activity Section
export const ActivitySection = () => {
    const activities = [
        { text: "Tomato health updated", time: "2 hrs ago", type: "update" },
        { text: "New Wheat crop added", time: "Yesterday", type: "addition" },
        { text: "Soil moisture alert", time: "2 days ago", type: "alert" },
    ];

    return (
        <PanelCard
            icon={History}
            iconBg="bg-gray-100 dark:bg-white/5"
            iconColor="text-gray-500"
            title="Recent Activity"
            subtitle="Latest logs from your farm"
        >
            <div className="space-y-4">
                {activities.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-smart-green-500" />
                        <div>
                            <p className="text-sm font-medium text-[#111] dark:text-gray-200">{act.text}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{act.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
};