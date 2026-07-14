import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { account } from "../../appwrite/config";
import TextLogo from "./../../../public/text_logo";
import { useToast } from "../../component/Other/ToastContext";

function Login() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      showToast("Login successful! Welcome back 🌱", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      showToast(error.message || "Invalid email or password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        navigate("/dashboard", { replace: true });
        // eslint-disable-next-line no-empty
      } catch { }
    };
    checkSession();
  }, [navigate]);

  const inputBase = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-smart-green-500 focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat font-dm text-[#111] dark:text-gray-100">
      <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-500">
        <h1 className="font-fraunces font-black text-4xl text-center mb-2 tracking-tight">
          <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>Welcome to</span>
            <TextLogo />
          </span>
        </h1>

        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          Login to manage your crops & fields
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-smart-green-600 hover:text-smart-green-500 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 mt-4 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
          New farmer?{" "}
          <Link to="/signup" className="text-smart-green-600 hover:text-smart-green-500 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;