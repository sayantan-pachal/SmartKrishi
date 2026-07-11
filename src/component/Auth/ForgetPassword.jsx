import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Phone } from "lucide-react";
import { account } from "../../appwrite/config";
import { useToast } from "../../component/Other/ToastContext";

function ForgetPassword() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [step, setStep] = useState(1); // Step 1: Verify, Step 2: Reset
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // STEP 1: Verify User Data locally before showing password reset
  const handleVerify = (e) => {
    e.preventDefault();
    if (!email || !phone) {
      showToast("Please enter both email and phone number", "error");
      return;
    }
    // If they filled it out, let them proceed to type a new password
    setStep(2);
  };

  // STEP 2: Execute the password reset via our new config.js function
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters 🔑", "error");
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
      setStep(1); // Send them back to fix their details
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative h-screen bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-lg border border-white/20 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Recover Account 🔑
        </h1>

        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {step === 1
            ? "Verify your registered email and phone number."
            : "Create a strong new password for your account."}
        </p>

        {step === 1 ? (
          /* STEP 1: VERIFICATION FORM */
          <form onSubmit={handleVerify} className="mt-8 space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:ring-green-500 transition-all dark:text-gray-200"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                placeholder="Registered Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:ring-green-500 transition-all dark:text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all"
            >
              Verify Identity <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-md mt-4">
              <Link to="/login" className="text-green-600 hover:underline">Back to Login</Link>
            </p>
          </form>
        ) : (
          /* STEP 2: NEW PASSWORD FORM */
          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:ring-green-500 transition-all dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-gradient-to-r bg-gray-600 text-white hover:shadow-lg disabled:opacity-70"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;