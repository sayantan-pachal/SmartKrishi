import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { account } from "../../appwrite/config"; // Ensure this is imported
import { useToast } from "../Other/ToastContext";

function ForgetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showToast = useToast();

  // Appwrite sends 'userId' and 'secret' in the URL when the user clicks the email link
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // STEP 1: Send Recovery Email
  const handleSendRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace 'http://localhost:5173/forget-password' with your actual hosted reset URL
      await account.createRecovery(email, "http://localhost:5173/forget-password");
      setEmailSent(true);
      showToast("Recovery email sent! Please check your inbox 📧", "success");
    } catch (error) {
      console.error("Recovery Error:", error);
      showToast("Failed to send recovery email.", "error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Reset Password (Triggered when user arrives via email link)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters 🔑", "error");
      return;
    }

    setLoading(true);
    try {
      await account.updateRecovery(userId, secret, newPassword, newPassword);
      showToast("Password reset successful!🔐", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Reset Password Error:", error);
      showToast(error.message || "Invalid or expired recovery link.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative h-screen bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-lg border border-white/20 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {userId && secret ? "New Password 🔑" : "Reset Password 🔑"}
        </h1>

        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {userId && secret 
            ? "Create a strong password for your account" 
            : "We'll send a secure reset link to your email"}
        </p>

        {/* IF USER CLICKED LINK FROM EMAIL */}
        {userId && secret ? (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:ring-green-500 transition-all"
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
          </form>
        ) : emailSent ? (
          /* SUCCESS MESSAGE AFTER SENDING EMAIL */
          <div className="mt-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <p className="text-gray-700 dark:text-gray-300">
              Check your inbox! We've sent a recovery link to <b>{email}</b>.
            </p>
            <button 
              onClick={() => setEmailSent(false)}
              className="text-green-600 font-medium hover:underline"
            >
              Didn't get it? Try again
            </button>
          </div>
        ) : (
          /* INITIAL EMAIL FORM */
          <form onSubmit={handleSendRecovery} className="mt-8 space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Send Recovery Link <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;