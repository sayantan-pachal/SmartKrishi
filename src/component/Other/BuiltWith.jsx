import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Code2, Zap, Database, Mail, ArrowLeft } from "lucide-react";
import Logo from "../../../public/Logo";

export default function BuiltWith() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const technologies = [
        {
            category: "Frontend",
            icon: Code2,
            color: "smart-green",
            items: [
                { name: "React", description: "UI library for building interactive interfaces" },
                { name: "JavaScript (ES6+)", description: "Modern JavaScript for dynamic functionality" },
                { name: "Tailwind CSS", description: "Utility-first CSS framework for responsive design" },
                { name: "Lucide React", description: "Beautiful, consistent icon library" }
            ]
        },
        {
            category: "Backend & Data",
            icon: Database,
            color: "blue",
            items: [
                { name: "Google Sheets API", description: "Data storage and retrieval for advisories" },
                { name: "REST APIs", description: "Backend integration for crop analysis" },
                { name: "Machine Learning Models", description: "AI-powered disease detection and predictions" },
                { name: "Weather APIs", description: "Real-time weather data for advisory generation" }
            ]
        },
        {
            category: "Tools & Infrastructure",
            icon: Zap,
            color: "orange",
            items: [
                { name: "React Router", description: "Client-side routing and navigation" },
                { name: "Git & GitHub", description: "Version control and collaboration" },
                { name: "Responsive Design", description: "Mobile-first approach for all devices" },
                { name: "Vercel", description: "Deployment and hosting platform for the web app" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] font-dm text-gray-900 dark:text-gray-100 selection:bg-smart-green-500 selection:text-white pt-24 pb-20">
            
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-4 shadow-sm" aria-label="Built With Page Navigation">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" aria-label="Back to Home" className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        Back to Home
                    </Link>
                    <Logo />
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 mt-12">
                
                {/* Page Header */}
                <header className="mb-12 text-center" aria-labelledby="built-heading">
                    <h1 id="built-heading" className="font-fraunces font-black text-4xl md:text-5xl tracking-tight mb-4 text-gray-900 dark:text-white">
                        Built With <img src="/src/assets/react.svg" alt="React Logo" className="inline-block w-10 h-10 ml-2 -mt-1" />
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        The technologies powering SmartKrishi
                    </p>
                </header>

                {/* Introduction Section */}
                <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-12" aria-labelledby="intro-heading">
                    <h2 id="intro-heading" className="font-fraunces font-bold text-3xl text-gray-900 dark:text-white mb-6">
                        Our Technology Stack
                    </h2>

                    <article className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
                        <p>
                            SmartKrishi is built with a modern, scalable technology stack designed to deliver reliable agricultural insights to farmers. We leverage React for responsive user interfaces, JavaScript for dynamic functionality, and Google Sheets for accessible data management.
                        </p>
                        <p>
                            Our choice of technologies reflects our commitment to creating an accessible, fast, and user-friendly platform that works seamlessly across desktop and mobile devices.
                        </p>
                    </article>
                </section>

                {/* Technology Categories */}
                {technologies.map((tech, idx) => {
                    const IconComponent = tech.icon;
                    const colorClass = tech.color === "smart-green" ? "smart-green" : tech.color === "blue" ? "blue" : "orange";
                    const bgColor = colorClass === "smart-green" ? "bg-smart-green-50 dark:bg-smart-green-900/20" : 
                                   colorClass === "blue" ? "bg-blue-50 dark:bg-blue-900/20" : 
                                   "bg-orange-50 dark:bg-orange-900/20";
                    const borderColor = colorClass === "smart-green" ? "border-smart-green-100 dark:border-smart-green-800/30" : 
                                       colorClass === "blue" ? "border-blue-100 dark:border-blue-800/30" : 
                                       "border-orange-100 dark:border-orange-800/30";
                    const iconColor = colorClass === "smart-green" ? "text-smart-green-600 dark:text-smart-green-400" : 
                                     colorClass === "blue" ? "text-blue-600 dark:text-blue-400" : 
                                     "text-orange-600 dark:text-orange-400";

                    return (
                        <section key={idx} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-12" aria-labelledby={`tech-${idx}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center border ${borderColor}`} aria-hidden="true">
                                    <IconComponent className={`w-6 h-6 ${iconColor}`} />
                                </div>
                                <h2 id={`tech-${idx}`} className="font-fraunces font-bold text-3xl text-gray-900 dark:text-white">
                                    {tech.category}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {tech.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* Architecture Principles Section */}
                <section className="bg-gradient-to-br from-smart-green-50 to-blue-50 dark:from-smart-green-900/10 dark:to-blue-900/10 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-12" aria-labelledby="principles-heading">
                    <h2 id="principles-heading" className="font-fraunces font-bold text-3xl text-gray-900 dark:text-white mb-6">
                        Design Principles
                    </h2>

                    <article className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Responsive Design:</strong> Seamless experience on desktop, tablet, and mobile devices</li>
                            <li><strong>Accessibility:</strong> Built with semantic HTML and ARIA labels for inclusive navigation</li>
                            <li><strong>Performance:</strong> Optimized components and efficient data retrieval from Google Sheets</li>
                            <li><strong>Scalability:</strong> Modular React components for easy feature expansion</li>
                            <li><strong>User-Centric:</strong> Intuitive interfaces designed for agricultural professionals</li>
                        </ul>
                    </article>
                </section>

                {/* Contact Section */}
                <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm" aria-labelledby="contact-heading">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-100 dark:border-orange-800/30" aria-hidden="true">
                            <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 id="contact-heading" className="font-fraunces font-bold text-3xl text-gray-900 dark:text-white">
                            Get in Touch
                        </h2>
                    </div>

                    <article className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
                        <p>
                            Have questions about SmartKrishi's technology, architecture, or anything else? We'd love to connect with you. Feel free to reach out through our contact page.
                        </p>

                        <Link 
                            to="https://sayantanpachal.vercel.app/contact" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-smart-green-600 hover:bg-smart-green-700 dark:bg-smart-green-500 dark:hover:bg-smart-green-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Us
                        </Link>
                    </article>
                </section>
                
            </main>
        </div>
    );
}