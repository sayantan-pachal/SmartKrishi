/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { account } from "../../appwrite/config";
import { useToast } from "../../component/Other/ToastContext";

function ResetPassword() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔒 Protect route using Appwrite Session
  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
      } catch (error) {
        // Not logged in, redirect to login
        navigate("/login", { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      showToast("All fields are required ⚠️", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters long ⚠️", "error");
      return;
    }

    setLoading(true);

    try {
      // ✅ Appwrite handles the comparison of oldPassword 
      // and the hashing of newPassword automatically.
      await account.updatePassword(newPassword, oldPassword);

      showToast("Password updated successfully 🔐", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Password Update Error:", error);
      // Appwrite will throw an error if the old password doesn't match
      showToast("Failed to update password. Check your old password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative h-screen bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Reset Password 🔐
        </h1>

        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Secure your account with a new password
        </p>

        <form onSubmit={handleReset} className="mt-8 space-y-5">
          {/* Old Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showOld ? "text" : "password"}
              placeholder="Old password"
              value={oldPassword}
              required
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg disabled:opacity-70 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Update Password <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;