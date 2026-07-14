/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldQuestion, RefreshCw } from "lucide-react";
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

  // CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
      } catch (error) {
        navigate("/login", { replace: true });
      }
    };
    checkSession();
    generateCaptcha(); // Initialize CAPTCHA on mount
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

    // Verify CAPTCHA
    if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
      showToast("Incorrect CAPTCHA answer. Please try again.", "error");
      generateCaptcha();
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
      generateCaptcha(); // Refresh CAPTCHA on failure
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

          {/* CAPTCHA Section */}
          <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest flex items-center justify-between">
                  <span>Security Check</span>
                  <button type="button" onClick={generateCaptcha} className="hover:text-smart-green-500 transition-colors">
                      <RefreshCw size={12} />
                  </button>
              </label>
              <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 dark:bg-white/[0.05] border border-black/5 dark:border-white/5 text-lg font-black tracking-widest">
                      <span>{captchaNum1}</span>
                      <span className="text-smart-green-500">+</span>
                      <span>{captchaNum2}</span>
                      <span className="text-gray-400">=</span>
                  </div>
                  <div className="relative flex-1">
                    <ShieldQuestion className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      placeholder="Answer"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      // Remove pr-12 here because we don't have an eye icon in this input
                      className={`${inputBase} pr-4`} 
                    />
                  </div>
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