import React, { useEffect } from "react";
import {
    Zap,
    Microscope,
    ImagePlus,
    AlertCircle,
    Lightbulb,
    Clock,
} from "lucide-react";
import { PageBackground, Reveal } from "../DashTemp/DashboardComponents";

const ComingSoon = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: Microscope,
            title: "AI Disease Detection",
            description:
                "Upload crop leaf images for instant disease & pest identification powered by computer vision",
            details: ["Real-time analysis", "99%+ accuracy", "Multi-crop support"],
        },
        {
            icon: ImagePlus,
            title: "Image Upload System",
            description:
                "Seamless drag-and-drop interface for capturing and analyzing crop health photos",
            details: ["Mobile-friendly", "Batch processing", "History tracking"],
        },
        {
            icon: AlertCircle,
            title: "Pest & Disease Database",
            description:
                "Comprehensive catalog of common agricultural threats with regional variations",
            details: ["500+ diseases", "Treatment guides", "Prevention tips"],
        },
        {
            icon: Lightbulb,
            title: "Smart Treatment Plans",
            description:
                "Personalized remediation recommendations based on disease, crop type, and location",
            details: ["Organic solutions", "Chemical options", "Cost analysis"],
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-gray-900 dark:text-gray-50 pt-24 pb-24 transition-colors duration-300">
            <PageBackground />

            <div className="relative max-w-7xl mx-auto px-6">
                {/* ── Page header ── */}
                <div
                    className="mb-16 text-center"
                    style={{ animation: "fadeSlideDown 0.8s ease both" }}
                >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-300 mb-4 block">
                        Coming Very Soon
                    </span>
                    <h1 className="font-fraunces font-black text-5xl md:text-6xl tracking-[-0.02em] leading-[1.05] mb-6 text-gray-900 dark:text-white">
                        Disease Intelligence
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                        Harness the power of AI to identify crop diseases and pests in
                        seconds. Smart diagnosis for smarter farming.
                    </p>

                    {/* ── Status badge ── */}
                    <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-smart-green-50 dark:bg-smart-green-900/40 border border-smart-green-200 dark:border-smart-green-700/60 rounded-full">
                        <Clock className="w-4 h-4 text-smart-green-600 dark:text-smart-green-300 animate-pulse" />
                        <span className="text-sm font-semibold text-smart-green-700 dark:text-smart-green-200">
                            Beta testing launching Q4 2026
                        </span>
                    </div>
                </div>

                {/* ── Features Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <Reveal key={idx} delay={idx * 80}>
                                <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-8 hover:shadow-lg hover:border-smart-green-300 dark:hover:border-smart-green-600/50 transition-all duration-300">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-smart-green-50 dark:bg-smart-green-900/50 flex items-center justify-center border border-smart-green-100 dark:border-smart-green-700/60 flex-shrink-0">
                                            <Icon className="w-6 h-6 text-smart-green-600 dark:text-smart-green-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-fraunces font-bold text-xl text-gray-900 dark:text-gray-100">
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {feature.details.map((detail, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 text-xs font-medium text-gray-700 dark:text-gray-200"
                                            >
                                                {detail}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* ── Timeline Section ── */}
                <Reveal delay={320}>
                    <div className="bg-gradient-to-br from-smart-green-50 to-blue-50 dark:from-gray-900/50 dark:to-gray-800/40 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-12 mb-16">
                        <h2 className="font-fraunces font-bold text-3xl text-gray-900 dark:text-gray-100 mb-10 text-center">
                            Development Timeline
                        </h2>

                        <div className="max-w-3xl mx-auto space-y-6">
                            {[
                                {
                                    phase: "Phase 1",
                                    time: "August 2026",
                                    task: "Disease database compilation & AI model training",
                                },
                                {
                                    phase: "Phase 2",
                                    time: "September 2026",
                                    task: "Image upload interface & mobile optimization",
                                },
                                {
                                    phase: "Phase 3",
                                    time: "October 2026",
                                    task: "Beta testing with farming communities",
                                },
                                {
                                    phase: "Phase 4",
                                    time: "Q4 2026",
                                    task: "Public launch & continuous improvement",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-start">
                                    <div className="min-w-fit">
                                        <div className="w-10 h-10 rounded-full bg-smart-green-600 dark:bg-smart-green-500 flex items-center justify-center border-4 border-smart-green-50 dark:border-gray-900/50 flex-shrink-0">
                                            <span className="text-white font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                            <p className="font-fraunces font-bold text-lg text-gray-900 dark:text-gray-100">
                                                {item.phase}
                                            </p>
                                            <span className="text-sm font-semibold text-smart-green-600 dark:text-smart-green-300">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {item.task}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* ── How It Works ── */}
                <Reveal delay={360}>
                    <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-12 mb-16">
                        <h2 className="font-fraunces font-bold text-3xl text-gray-900 dark:text-gray-100 mb-10 text-center">
                            How It Will Work
                        </h2>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    {
                                        num: "1",
                                        title: "Capture",
                                        desc: "Take or upload a photo of affected crop",
                                    },
                                    {
                                        num: "2",
                                        title: "Analyze",
                                        desc: "AI identifies disease/pest in seconds",
                                    },
                                    {
                                        num: "3",
                                        title: "Diagnose",
                                        desc: "Get confidence score & detailed insights",
                                    },
                                    {
                                        num: "4",
                                        title: "Treat",
                                        desc: "Receive personalized treatment plans",
                                    },
                                ].map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="bg-smart-green-50 dark:bg-smart-green-600/30 border border-smart-green-200 dark:border-smart-green-700/50 rounded-xl p-6 text-center">
                                            <div className="w-12 h-12 rounded-full bg-smart-green-600 dark:bg-smart-green-500 text-white font-bold flex items-center justify-center mx-auto mb-4">
                                                {step.num}
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {step.desc}
                                            </p>
                                        </div>
                                        {idx < 3 && (
                                            <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-smart-green-400 dark:text-smart-green-600">
                                                <span className="text-4xl">→</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* ── CTA Section ── */}
                <Reveal delay={400}>
                    <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-12 text-center">
                        <Zap className="w-12 h-12 text-smart-green-600 dark:text-smart-green-400 mx-auto mb-6" />
                        <h2 className="font-fraunces font-bold text-3xl text-gray-900 dark:text-gray-100 mb-4">
                            Be Among The First
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                            Join our beta testing program and help shape the future of
                            agricultural AI. Early adopters get exclusive access and direct
                            input on feature development.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-smart-green-600 hover:bg-smart-green-700 dark:bg-smart-green-500 dark:hover:bg-smart-green-600 text-white dark:text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md">
                                Join the Beta
                            </button>
                            <button className="px-8 py-3 border border-gray-300 dark:border-gray-700/80 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </Reveal>
            </div>

            <style>{`@keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); }}`}</style>
        </div>
    );
};

export default ComingSoon;