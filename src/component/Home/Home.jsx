import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoveRight, CheckCircle2, LeafyGreen, Cannabis, Leaf, Sprout, ChevronRight } from "lucide-react";
import Logo from "./../../../public/Logo";
import { HOME_CONTENT } from "./../../data/HomeData";
import ThemeToggle from "../Header/ThemeToggle";

const Home = () => {
  const { 
    hero = {}, 
    features = [], 
    stats = [], 
    about = {}, 
    ctaSection = {} 
  } = HOME_CONTENT || {};

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] font-dm text-gray-900 dark:text-gray-100 selection:bg-smart-green-500 selection:text-white">
      
      {/* ─── Sticky Navigation ─── */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-4 shadow-sm" 
          : "bg-transparent py-6"
      }`} aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-8 text-sm font-semibold">
            <ThemeToggle />
            <a href="#features" className="hidden md:flex text-gray-500 hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">Features</a>
            <a href="#about" className="hidden md:flex text-gray-500 hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">About</a>
            <Link to="/login" className="hidden md:flex text-gray-900 dark:text-white hover:text-smart-green-600 hover:opacity-70 transition-opacity">Sign In</Link>
            <Link to="/signup" className="hidden md:flex group relative px-6 py-2.5 hover:dark:text-white bg-gray-900 dark:bg-white text-white dark:text-black rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="absolute inset-0 w-full h-full bg-smart-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Landmark */}
      <main>
        {/* ─── Hero Section with UI Teaser ─── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6" aria-labelledby="hero-heading">
          {/* Abstract Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-smart-green-500/20 dark:bg-smart-green-500/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-sm font-semibold px-5 py-2 rounded-full mb-8 hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-smart-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-smart-green-600"></span>
              </span>
              Next-Gen Agriculture is Here
            </div>
            
            <h1 id="hero-heading" className="font-fraunces font-black text-6xl md:text-8xl tracking-tight leading-[1.1] mb-6 text-gray-900 dark:text-white">
              {hero.title} <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-smart-green-600 to-emerald-400 bg-clip-text text-transparent">
                  {hero.highlight}
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-smart-green-500/20 dark:bg-smart-green-500/30 -z-10 -rotate-1" aria-hidden="true" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup" className="w-full sm:w-auto bg-smart-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-smart-green-700 hover:shadow-xl hover:shadow-smart-green-600/20 transition-all transform hover:-translate-y-1">
                {hero.primaryCTA || "Start Farming Smarter"}
                <MoveRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 font-bold hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-center">
                {hero.secondaryCTA || "Explore Platform"}
              </a>
            </div>
          </div>

          {/* Floating UI Teaser Box */}
          <div className="relative max-w-5xl mx-auto mt-20 perspective-[2000px]" aria-hidden="true">
            <div className="w-full h-64 md:h-96 bg-white dark:bg-[#0a0a0a] rounded-t-[2.5rem] border-x border-t border-gray-200 dark:border-gray-800 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_50px_-15px_rgba(255,255,255,0.02)] overflow-hidden flex flex-col transform rotate-x-[5deg] origin-bottom translate-y-8">
              <div className="h-12 border-b border-gray-100 dark:border-gray-900 flex items-center px-6 gap-2 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-smart-green-400" />
              </div>
              <div className="flex-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] flex items-center justify-center">
                <Sprout className="w-16 h-16 text-gray-200 dark:text-gray-800" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Floating Stats Bar ─── */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-12 md:-mt-16 mb-24">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-wrap justify-between p-8 md:px-16 gap-8">
            {stats?.map((stat, i) => (
              <div key={i} className="flex-1 min-w-[120px] text-center">
                <div className="font-fraunces font-black text-4xl md:text-5xl text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-xs font-bold text-smart-green-600 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bento Grid Features ─── */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24" aria-labelledby="features-heading">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest text-smart-green-600 mb-4 block">The Ecosystem</span>
            <h2 id="features-heading" className="font-fraunces font-black text-4xl md:text-5xl tracking-tight max-w-2xl mx-auto">Everything your farm needs, beautifully integrated.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {features?.map((feature, i) => (
              <div 
                key={i} 
                className={`relative bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-8 border border-gray-200 dark:border-gray-800 overflow-hidden group hover:border-smart-green-500/50 transition-colors ${
                  i === 0 || i === 3 ? "md:col-span-1" : "md:col-span-1"
                }`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500" aria-hidden="true">
                  <feature.Icon className="w-32 h-32 text-smart-green-600" />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${feature.bgColor || 'bg-gray-100 dark:bg-gray-800'} ${feature.color || 'text-gray-900 dark:text-white'}`} aria-hidden="true">
                    <feature.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-fraunces font-bold text-2xl mb-3">{feature.title}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── About/Mission Section ─── */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-32 border-t border-gray-200 dark:border-gray-800" aria-labelledby="about-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-[3rem] bg-gray-100 dark:bg-gray-900 overflow-hidden group" aria-hidden="true">
               <div className="absolute inset-0 bg-smart-green-600/10 group-hover:bg-smart-green-600/20 transition-colors duration-500" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-4 border-dashed border-smart-green-600/30 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                    <div className="absolute inset-4 bg-smart-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-smart-green-600/40">
                      <LeafyGreen className="w-20 h-20 text-white" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-sm font-bold uppercase tracking-widest text-smart-green-600 mb-4 block">Our Mission</span>
              <h2 id="about-heading" className="font-fraunces font-black text-4xl md:text-5xl tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                {about.title}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
                {about.description}
              </p>
              
              <div className="space-y-8">
                {about.items?.map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm group-hover:bg-smart-green-600 group-hover:border-smart-green-600 transition-colors" aria-hidden="true">
                      <item.icon className="w-6 h-6 text-smart-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="pt-1">
                      {/* Fixed heading jump from h2 straight to h4. Replaced with h3. */}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.label}</h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="px-6 py-24 max-w-7xl mx-auto" aria-labelledby="cta-heading">
          <div className="relative bg-gray-900 dark:bg-white rounded-[3rem] py-24 px-8 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,109,17,0.3),transparent_60%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNykiLz48L3N2Zz4=')] opacity-50" aria-hidden="true" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 id="cta-heading" className="font-fraunces font-black text-5xl md:text-7xl mb-6 tracking-tighter text-white dark:text-gray-900">
                {ctaSection.title}
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-600 mb-12 font-medium">
                {ctaSection.subtitle}
              </p>
              <Link to="/signup" className="inline-flex items-center gap-3 bg-smart-green-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-smart-green-500 transition-colors shadow-xl shadow-smart-green-600/30 hover:shadow-smart-green-600/50">
                {ctaSection.buttonText || "Get Started Now"}
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="max-w-7xl mx-auto px-6 pb-12 pt-20 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <Logo />
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400">
            <a href="built-with" className="hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">Platform</a>
            <a href="legal" className="hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">Privacy Policy</a>
            <a href="legal" className="hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">Terms of Service</a>
            <a href="built-with" className="hover:text-smart-green-600 dark:hover:text-smart-green-400 transition-colors">Contact Support</a>
          </div>
          <div className="flex gap-4">
            {[Leaf, Cannabis, LeafyGreen].map((Icon, i) => {
              const socialLabels = ["Facebook Profile", "Twitter Profile", "Instagram Profile"];
              return (
                <button 
                  key={i} 
                  type="button" 
                  aria-label={socialLabels[i]} 
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 hover:text-smart-green-600 hover:border-smart-green-600 dark:hover:text-smart-green-400 dark:hover:border-smart-green-400 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} SMARTKRISHI INC. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default Home;