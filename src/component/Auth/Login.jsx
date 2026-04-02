import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { account } from "../../appwrite/config"; // Ensure this path is correct

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      // ✅ Appwrite Authentication
      await account.createEmailPasswordSession(email, password);
      
      // Redirect to dashboard/home on success
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in via Appwrite
    const checkSession = async () => {
      try {
        await account.get();
        navigate("/dashboard", { replace: true });
      } catch {
        // No active session, stay on login page
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(180deg,#f0fdf4,#dcfce7)] dark:bg-[linear-gradient(0deg,#111827,#000000)]">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-lg border border-white/20 dark:border-gray-800">
        
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to SmartKrishi 🌾
        </h1>

        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Login to manage your crops & fields
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none dark:text-gray-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Login <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm dark:text-gray-400">
          New farmer?{" "}
          <Link to="/signup" className="text-green-600 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;