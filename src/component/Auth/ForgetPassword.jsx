import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Phone, ShieldQuestion, RefreshCw } from "lucide-react";
import { account } from "../../appwrite/config";
import { useToast } from "../../component/Other/ToastContext";

function ForgetPassword() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!email || !phone) {
      showToast("Please enter both email and phone number", "error");
      return;
    }
    
    // Verify CAPTCHA
    if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
      showToast("Incorrect CAPTCHA answer. Please try again.", "error");
      generateCaptcha();
      return;
    }

    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters 🔑", "error");
      return;
    }
    
    // Verify Passwords Match
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match! Please check again.", "error");
      return;
    }

    setLoading(true);
    try {
      await account.recoverPassword(email, phone, newPassword);
      showToast("Password reset successful! 🔐 You can now log in.", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Reset Error:", error);
      showToast(error.message || "Failed to reset password. Please check your details.", "error");
      setStep(1); 
      generateCaptcha(); // Reset captcha if sent back
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-smart-green-500 focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat font-dm text-[#111] dark:text-gray-100">
      <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-500">
        <h1 className="font-fraunces font-black text-4xl text-center mb-2 tracking-tight">
          Recover Account <span className="text-smart-green-500">🔑</span>
        </h1>

        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          {step === 1
            ? "Verify your registered email and phone number."
            : "Create a strong new password for your account."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase}
                  />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Registered Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputBase}
                  />
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
                        className={inputBase}
                      />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all text-base"
            >
              Verify Identity <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm font-bold mt-6">
              <Link to="/login" className="text-gray-500 hover:text-smart-green-600 transition-colors">Back to Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputBase}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Type password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputBase}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    generateCaptcha();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-white/[0.05] text-[#111] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all text-base"
                >
                  Cancel
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;