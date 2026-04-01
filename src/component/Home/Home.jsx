import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-green-600">
          🌾 SmartKrishi
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Smart Farming for a <span className="text-green-600">Better Tomorrow</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          SmartKrishi helps farmers monitor crops, detect diseases from leaf images,
          get weather insights, and manage multiple fields — all in one place.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 rounded-xl border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Crop Disease Detection",
            desc: "Upload crop leaf images to identify diseases and get pesticide recommendations.",
            icon: "📸",
          },
          {
            title: "Weather Insights",
            desc: "Get real-time weather forecasts using open-source weather APIs.",
            icon: "🌦️",
          },
          {
            title: "Multi-Field Management",
            desc: "Manage different crops across multiple farming lands easily.",
            icon: "🌱",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition"
          >
            <div className="text-4xl">{feature.icon}</div>
            <h3 className="mt-4 text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 px-6 bg-green-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold">
          Empowering Farmers with Technology
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Start your smart farming journey today with SmartKrishi.
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 px-8 py-3 rounded-xl bg-white text-green-600 font-semibold hover:bg-gray-100 transition"
        >
          Join Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} SmartKrishi. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;