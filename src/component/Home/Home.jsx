import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoveRight, CheckCircle2, LeafyGreen, Cannabis, Leaf, Sprout } from "lucide-react";
import Logo from "./../../../public/Logo";
import { HOME_CONTENT } from "./../../data/HomeData";

const Home = () => {
  // Destructure with fallbacks to prevent "undefined" errors
  const { 
    hero = {}, 
    features = [], 
    stats = [], 
    about = {}, 
    ctaSection = {} 
  } = HOME_CONTENT || {};

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-black font-dm text-[#1a1a1a] dark:text-gray-100 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className={`sticky top-0 z-[100] px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-300 ${
        isScrolled ? "bg-[#f8f7f4]/85 dark:bg-black/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10" : "bg-transparent"
      }`}>
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-gray-500 hover:text-smart-green-600 transition">Features</a>
          <a href="#about" className="text-gray-500 hover:text-smart-green-600 transition">About</a>
          <Link to="/login" className="hover:text-smart-green-600 transition">Sign In</Link>
          <Link to="/signup" className="bg-smart-green-600 flex text-white px-6 py-2 rounded-full font-bold hover:bg-smart-green-700 transition transform hover:-translate-y-px">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,109,17,0.08),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-smart-green-50 dark:bg-smart-green-800/20 text-smart-green-700 dark:text-smart-green-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-smart-green-100 dark:border-smart-green-700/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-smart-green-600 animate-pulse" />
              Now Live · AI-Powered Agriculture
          </div>
          <h1 className="font-fraunces font-black text-5xl md:text-8xl tracking-tighter leading-[1.05] mb-6">
            {hero.title} <br />
            <em className="not-italic bg-gradient-to-br from-smart-green-600 to-[#6BBF2A] bg-clip-text text-transparent">
              {hero.highlight}
            </em>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed font-normal">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="group bg-[#1a2e0a] dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition transform hover:-translate-y-0.5 shadow-xl shadow-black/5">
              {hero.primaryCTA}
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#about" className="px-8 py-4 rounded-xl border border-black/10 dark:border-white/10 font-medium hover:bg-smart-green-50 dark:hover:bg-gray-900 transition">
              {hero.secondaryCTA}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-white dark:bg-black border-y border-black/5 dark:border-white/10 flex flex-wrap justify-center overflow-hidden">
        {stats?.map((stat, i) => (
          <div key={i} className="flex-1 min-w-[180px] max-w-[220px] py-8 px-4 text-center border-r border-black/5 last:border-none">
            <div className="font-fraunces font-bold text-3xl text-smart-green-600 mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-smart-green-600 mb-4 block">Platform Features</span>
        <h2 className="font-fraunces font-bold text-4xl md:text-5xl tracking-tight mb-16 max-w-lg">Everything your farm needs, in one place</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden">
          {features?.map((feature, i) => (
            <div key={i} className="bg-white dark:bg-black p-10 hover:bg-smart-green-50 dark:hover:bg-smart-green-900/10 transition-colors duration-500 group">
              <div className={`w-12 h-12 ${feature.bgColor} ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.Icon className="w-6 h-6" />
              </div>
              <h3 className="font-fraunces font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-smart-green-600/5 dark:bg-smart-green-600/10 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,109,17,0.1)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
               <Sprout className="w-64 h-64 text-smart-green-600 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-smart-green-600 mb-4 block">Our Mission</span>
            <h2 className="font-fraunces font-bold text-4xl md:text-6xl tracking-tight mb-8 leading-tight">{about.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">{about.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {about.items?.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-smart-green-50 dark:bg-smart-green-900/30 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-smart-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="bg-[#1a2e0a] rounded-[2.5rem] py-20 px-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-fraunces font-black text-4xl md:text-6xl mb-4 tracking-tighter">{ctaSection.title}</h2>
            <p className="text-gray-400 mb-10">{ctaSection.subtitle}</p>
            <Link to="/signup" className="bg-white text-[#1a2e0a] px-12 py-4 rounded-xl font-bold text-lg hover:scale-105 transition transform shadow-xl shadow-black/20">
              {ctaSection.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black/5 dark:border-white/10 flex flex-wrap justify-between items-center gap-8">
        <Logo />
        <div className="flex gap-8 text-xs font-bold text-gray-400">
          <a href="#" className="hover:text-smart-green-600 transition uppercase tracking-widest">Privacy</a>
          <a href="#" className="hover:text-smart-green-600 transition uppercase tracking-widest">Terms</a>
          <a href="#" className="hover:text-smart-green-600 transition uppercase tracking-widest">Contact</a>
        </div>
        <div className="flex gap-3">
          {[Leaf, Cannabis, LeafyGreen].map((Icon, i) => (
            <button key={i} className="w-9 h-9 flex items-center justify-center border border-black/10 dark:border-white/10 rounded-lg text-gray-400 hover:text-smart-green-600 transition-all">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <p className="w-full text-center text-[10px] font-bold text-gray-400 tracking-widest mt-4">
          © {new Date().getFullYear()} SMARTKRISHI INC. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default Home;