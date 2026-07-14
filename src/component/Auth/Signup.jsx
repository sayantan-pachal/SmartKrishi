/* eslint-disable no-empty */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { account, ID } from "../../appwrite/config";
import TextLogo from "./../../../public/text_logo";
import { useToast } from "../../component/Other/ToastContext";

function Signup() {
    const navigate = useNavigate();
    const showToast = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get();
                navigate("/dashboard", { replace: true });
            } catch {}
        };
        checkSession();
    }, [navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !password) {
            showToast("All fields are required ⚠️", "error");
            return;
        }
        
        setLoading(true);
        try {
            // 1️⃣ PRE-FLIGHT CHECK: Fetch existing users to check for duplicates
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            const res = await fetch(`${SCRIPT_URL}?sheet=users`);
            const users = await res.json();

            if (!users.error && Array.isArray(users)) {
                // Check if email or phone already exists
                const emailExists = users.some(u => String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase());
                const phoneExists = users.some(u => String(u.phone).trim() === String(phone).trim());

                if (emailExists) {
                    showToast("This email is already registered. Please login instead. ⚠️", "error");
                    setLoading(false);
                    return; // Stop the signup process
                }

                if (phoneExists) {
                    showToast("This phone number is already registered. ⚠️", "error");
                    setLoading(false);
                    return; // Stop the signup process
                }
            }

            // 2️⃣ PROCEED WITH CREATION if no duplicates found
            const generatedId = ID.unique();
            const newUser = await account.create(generatedId, email, password, name, phone);
            localStorage.setItem("smartkrishi_user", JSON.stringify(newUser));
            
            showToast(`Welcome to the farm, ${name}!`, "success");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Signup Error:", error);
            showToast(error.message || "Signup failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-smart-green-500 focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative bg-auth-bg1 dark:bg-auth-bg2 bg-cover bg-center bg-no-repeat font-dm text-[#111] dark:text-gray-100 py-12">
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-500">
                <h1 className="font-fraunces font-black text-4xl text-center mb-2 tracking-tight flex items-center justify-center gap-2">
                    Join <TextLogo />
                </h1>

                <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
                    Create your farmer account to manage crops & fields
                </p>

                <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="Farmer name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputBase}
                            />
                        </div>
                    </div>

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
                                placeholder="+91 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Password</label>
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
                        className="w-full flex items-center justify-center gap-2 py-4 mt-6 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                    Already registered?{" "}
                    <Link to="/login" className="text-smart-green-600 hover:text-smart-green-500 transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;