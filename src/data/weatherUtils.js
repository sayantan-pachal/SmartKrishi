// src/data/weatherUtils.js

// ─────────────────────────────────────────────
// ET Index thresholds as a config array —
// easy to extend without touching the logic
// ─────────────────────────────────────────────
const ET_LEVELS = [
    {
        min: 1.5,
        level: "Very High",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-400 dark:border-red-600",
        advice: "Critical irrigation needed. Water loss is very high.",
    },
    {
        min: 1,
        level: "High",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-orange-400 dark:border-orange-600",
        advice: "Increase irrigation frequency. Significant water loss expected.",
    },
    {
        min: 0.5,
        level: "Moderate",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-400 dark:border-yellow-600",
        advice: "Regular irrigation recommended. Normal water loss.",
    },
    {
        min: -Infinity,
        level: "Low",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-400 dark:border-green-600",
        advice: "Minimal irrigation needed. Low water loss due to cool & humid conditions.",
    },
];

/**
 * Calculate Evapotranspiration (ET) Index
 * Formula: ET = (temp / 30) × ((100 - humidity) / 50)
 * Returns level metadata for UI rendering.
 */
export const calculateETIndex = (temp, humidity) => {
    const etIndex = (temp / 30) * ((100 - humidity) / 50);
    return ET_LEVELS.find((l) => etIndex > l.min);
};

// ─────────────────────────────────────────────
// Advisory rules as data — add/remove rules
// without touching getFarmingAdvice()
// ─────────────────────────────────────────────
const ADVISORY_RULES = [
    {
        type: "warning",
        icon: "🔥",
        text: "Heat Alert: Increase irrigation to prevent crop wilting.",
        test: ({ temp }) => temp > 35,
    },
    {
        type: "warning",
        icon: "❄️",
        text: "Cold Alert: Protect sensitive crops from frost.",
        test: ({ temp }) => temp < 5,
    },
    {
        type: "caution",
        icon: "💧",
        text: "High Humidity: Risk of fungal diseases. Ensure air circulation.",
        test: ({ humidity }) => humidity > 85,
    },
    {
        type: "caution",
        icon: "🌵",
        text: "Low Humidity: Risk of drought stress.",
        test: ({ humidity }) => humidity < 30,
    },
    {
        type: "caution",
        icon: "💨",
        text: "Strong Winds: Stake tall plants to prevent damage.",
        test: ({ windSpeed }) => windSpeed > 20,
    },
    {
        type: "info",
        icon: "☁️",
        text: "Overcast: Reduced sunlight may slow photosynthesis.",
        test: ({ clouds }) => clouds > 70,
    },
    {
        type: "info",
        icon: "🌧️",
        text: "Rain Detected: Postpone planned irrigation and fertilizing.",
        test: ({ rain }) => rain > 0,
    },
];

const FALLBACK_ADVICE = {
    type: "success",
    icon: "✅",
    text: "Optimal conditions. Proceed with regular maintenance.",
};

/**
 * Generate farming advisories based on current weather metrics.
 * @param {number} temp       – °C
 * @param {number} humidity   – %
 * @param {number} windSpeed  – km/h
 * @param {number} clouds     – % coverage
 * @param {number} rain       – mm in last hour
 * @returns {{ type: string, icon: string, text: string }[]}
 */
export const getFarmingAdvice = (temp, humidity, windSpeed, clouds, rain) => {
    const ctx = { temp, humidity, windSpeed, clouds, rain };
    const matched = ADVISORY_RULES.filter((rule) => rule.test(ctx));
    return matched.length > 0 ? matched : [FALLBACK_ADVICE];
};

// ─────────────────────────────────────────────
// Temperature → gradient mapping
// ─────────────────────────────────────────────
const GRADIENT_LEVELS = [
    { min: 35, gradient: "from-red-500 to-orange-500" },
    { min: 25, gradient: "from-orange-500 to-yellow-500" },
    { min: 15, gradient: "from-yellow-500 to-green-500" },
    { min: 5,  gradient: "from-green-500 to-blue-500" },
    { min: -Infinity, gradient: "from-blue-500 to-cyan-500" },
];

/**
 * Returns Tailwind gradient classes based on temperature.
 * @param {number} temp – °C
 * @returns {string}
 */
export const getWeatherGradient = (temp) =>
    GRADIENT_LEVELS.find((l) => temp > l.min)?.gradient ?? "from-blue-500 to-cyan-500";

// ─────────────────────────────────────────────
// Static farming tips
// ─────────────────────────────────────────────
export const farmingTips = [
    "Monitor soil moisture regularly to optimize irrigation.",
    "Check for pests during high humidity periods.",
    "Protect crops from strong winds using windbreaks.",
    "Adjust fertilizer application based on rain forecast.",
    "Higher ET Index values mean more frequent irrigation is needed.",
];