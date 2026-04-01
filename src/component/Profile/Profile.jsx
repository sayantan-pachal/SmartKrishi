/* eslint-disable react-hooks/static-components */
import React from 'react';
import { User, Mail, MapPin, Calendar, Phone, ShieldCheck } from 'lucide-react';

function Profile() {
  // 1. Fetch user session and database from localStorage
  const session = JSON.parse(localStorage.getItem("smartkrishi_session"));
  const users = JSON.parse(localStorage.getItem("smartkrishi_users")) || [];

  // 2. Find the full details of the current logged-in user
  const currentUser = users.find((u) => u.email === session?.email);

  // Helper to format labels
  // eslint-disable-next-line no-unused-vars
  const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-gray-900 dark:text-white font-medium">
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-28 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="relative mb-8 p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-xl shadow-green-900/5 border border-white dark:border-gray-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 p-1">
                <img 
                  src="https://i.pravatar.cc/150" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentUser?.name || "Farmer"}
              </h1>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Verified SmartKrishi Farmer 🌾
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileItem 
            icon={User} 
            label="Full Name" 
            value={currentUser?.name} 
          />
          <ProfileItem 
            icon={Mail} 
            label="Email Address" 
            value={currentUser?.email} 
          />
          <ProfileItem 
            icon={Phone} 
            label="Phone Number" 
            value={currentUser?.phone || "+91 XXXXX-XXXXX"} 
          />
          <ProfileItem 
            icon={MapPin} 
            label="Location" 
            value="West Bengal, India" 
          />
          <ProfileItem 
            icon={Calendar} 
            label="Member Since" 
            value={new Date(session?.loginTime).toLocaleDateString() || "2024"} 
          />
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg cursor-pointer hover:opacity-90 transition">
            <div className="p-2 rounded-lg bg-white/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-green-100 uppercase font-bold">Account Status</p>
              <p className="font-bold">Active & Secure</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 transition">
            Edit Profile
          </button>
          <button className="px-6 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-100 dark:border-red-900/30 font-semibold hover:bg-red-100 transition">
            Delete Account
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Profile;