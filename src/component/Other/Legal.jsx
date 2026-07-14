import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, ArrowLeft } from "lucide-react";
import Logo from "../../../public/Logo";

export default function Legal() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] font-dm text-gray-900 dark:text-gray-100 selection:bg-smart-green-500 selection:text-white pt-24 pb-20">
            
            {/* ─── Top Navigation Bar (Simplified for Legal Page) ─── */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-4 shadow-sm" aria-label="Legal Page Navigation">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" aria-label="Back to Home" className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        Back to Home
                    </Link>
                    <Logo />
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 mt-12">
                
                {/* ─── Page Header ─── */}
                <header className="mb-12 text-center" aria-labelledby="legal-heading">
                    <h1 id="legal-heading" className="font-fraunces font-black text-4xl md:text-5xl tracking-tight mb-4 text-gray-900 dark:text-white">
                        Legal Information
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </header>

                {/* ─── Privacy Policy Section ─── */}
                <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-12" aria-labelledby="privacy-heading">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-smart-green-50 dark:bg-smart-green-900/20 flex items-center justify-center border border-smart-green-100 dark:border-smart-green-800/30" aria-hidden="true">
                            <Shield className="w-6 h-6 text-smart-green-600 dark:text-smart-green-400" />
                        </div>
                        <h2 id="privacy-heading" className="font-fraunces font-bold text-3xl text-gray-900 dark:text-white">
                            Privacy Policy
                        </h2>
                    </div>

                    <article className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
                        <p>
                            Welcome to SmartKrishi. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our web application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
                        <p>
                            We may collect information about you in a variety of ways. The information we may collect via the Application includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Application.</li>
                            <li><strong>Agricultural Data:</strong> Information regarding your fields, crop types, planting dates, and disease images uploaded for analysis to provide you with tailored advisories.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, and your operating system.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Use of Your Information</h3>
                        <p>
                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Create and manage your account.</li>
                            <li>Generate localized weather advisories and predictive crop intelligence.</li>
                            <li>Analyze crop images for disease and pest detection.</li>
                            <li>Improve the machine learning models that power SmartKrishi's advisory tools.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Security of Your Information</h3>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </article>
                </section>

                {/* ─── Terms & Conditions Section ─── */}
                <section className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm" aria-labelledby="terms-heading">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30" aria-hidden="true">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 id="terms-heading" className="terms-heading font-fraunces font-bold text-3xl text-gray-900 dark:text-white">
                            Terms & Conditions
                        </h2>
                    </div>

                    <article className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
                        <p>
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and SmartKrishi, operated by Sayantan Pachal ("we," "us" or "our"), concerning your access to and use of the SmartKrishi web application.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Agreement to Terms</h3>
                        <p>
                            By accessing the Application, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Application and you must discontinue use immediately.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Nature of the Service</h3>
                        <p>
                            SmartKrishi provides digital tools for farm management, weather advisories, and AI-assisted crop disease detection. <strong>Disclaimer:</strong> The advisories and disease detection results provided by SmartKrishi are generated using algorithms and machine learning models. They are intended for informational and guidance purposes only and should not entirely replace the consultation of professional agronomists or local agricultural extension officers.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. User Representations</h3>
                        <p>
                            By using the Application, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You will not access the Application through automated or non-human means, whether through a bot, script, or otherwise.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Modifications and Interruptions</h3>
                        <p>
                            We reserve the right to change, modify, or remove the contents of the Application at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Application.
                        </p>
                    </article>
                </section>
                
            </main>
        </div>
    );
}