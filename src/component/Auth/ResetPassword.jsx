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

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
      } catch (error) {
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
      await account.updatePassword(newPassword, oldPassword);
      showToast("Password updated successfully 🔐", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Password Update Error:", error);
      showToast("Failed to update password. Check your old password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full pl-12 pr-12 py-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-smart-green-500 focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat font-dm text-[#111] dark:text-gray-100">
      <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-500">
        <h1 className="font-fraunces font-black text-4xl text-center mb-2 tracking-tight">
          Reset Password <span className="text-smart-green-500">🔐</span>
        </h1>

        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          Secure your account with a new password
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Old Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter old password"
                value={oldPassword}
                required
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Update Password <ArrowRight size={20} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;