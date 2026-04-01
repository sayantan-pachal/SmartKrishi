import React, { useEffect } from "react";
import {
  Leaf,
  CloudRain,
  Bug,
  Map,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // 1. Get the ACTIVE session using the CORRECT key
  const session = JSON.parse(localStorage.getItem("smartkrishi_session")); 
  
  // 2. Get the DATABASE of all users to find the name
  const users = JSON.parse(localStorage.getItem("smartkrishi_users")) || [];

  // 🔒 Protect dashboard: Redirect if no session or not logged in
  useEffect(() => {
    if (!session || !session.isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate, session]);

  // Find the specific user object from the database to display their name
  const currentUser = users.find(
    (u) => u.email === session?.email
  );


  const formatName = (name = "") =>
    name
      .toLowerCase()
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  const cards = [
    {
      title: "My Fields",
      desc: "Manage and monitor all your farm fields",
      icon: Map,
      link: "/fields",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Crop Advisory",
      desc: "Smart farming suggestions & tips",
      icon: Leaf,
      link: "/advisory",
      color: "from-lime-500 to-green-600",
    },
    {
      title: "Weather Insights",
      desc: "Real-time weather updates for your area",
      icon: CloudRain,
      link: "/weather",
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Disease Detection",
      desc: "Identify crop diseases using AI",
      icon: Bug,
      link: "/disease-detection",
      color: "from-rose-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Welcome to SmartKrishi
            {currentUser?.name
              ? `, ${formatName(currentUser.name)}`
              : ""} 🌾
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Logged in as{" "}
            <span className="font-medium">
              {session?.email}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* <button
            onClick={() => navigate("/reset-password")}
            className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition"
          >
            Reset Password
          </button> */}
        </div>
      </div>

      <div className="mt-12 max-w-6xl mx-auto p-6 rounded-xl bg-white/80 dark:bg-gray-900/70 backdrop-blur shadow">
        <p className="text-sm text-gray-600 dark:text-gray-400">Farm Health Overview</p>
        <div className="mt-3 w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">65% crops healthy — keep monitoring 🌱</p>
      </div>

      <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="p-6 rounded-xl bg-white/80 dark:bg-gray-900/70 backdrop-blur shadow hover:scale-[1.04] transition"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-24 max-w-4xl mx-auto text-center">
        <p className="text-xl font-medium text-gray-800 dark:text-gray-200">Smart farming leads to better harvests 🌾</p>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Monitor regularly. Act early. Grow smarter.</p>
      </div>
    </div>
  );
}

export default Dashboard;