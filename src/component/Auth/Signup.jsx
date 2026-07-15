/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { account, ID } from "../../appwrite/config";
import TextLogo from "./../../../public/text_logo";
import { useToast } from "../../component/Other/ToastContext";

function Signup() {
    const navigate = useNavigate();
    const showToast = useToast();

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // OTP Verification States
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [userOtp, setUserOtp] = useState("");

    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get();
                navigate("/dashboard", { replace: true });
            } catch {}
        };
        checkSession();
    }, [navigate]);

    // Step 1: Validate, Check Duplicates, and Send OTP
    const handleRequestSignup = async (e) => {
        e.preventDefault();
        
        // 1️⃣ Validation Checks
        if (!name || !email || !phone || !password) {
            showToast("All fields are required ⚠️", "error");
            return;
        }
        
        if (password.length < 8) {
            showToast("Password must be at least 8 characters long ⚠️", "error");
            return;
        }
        
        setLoading(true);
        try {
            // 2️⃣ PRE-FLIGHT CHECK: Fetch existing users to check for duplicates
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            const res = await fetch(`${SCRIPT_URL}?sheet=users`);
            const users = await res.json();

            if (!users.error && Array.isArray(users)) {
                const emailExists = users.some(u => String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase());
                const phoneExists = users.some(u => String(u.phone).trim() === String(phone).trim());

                if (emailExists) {
                    showToast("This email is already registered. Please login instead. ⚠️", "error");
                    setLoading(false);
                    return;
                }

                if (phoneExists) {
                    showToast("This phone number is already registered. ⚠️", "error");
                    setLoading(false);
                    return;
                }
            }

            // 3️⃣ Generate a 6-digit OTP
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);

            // 4️⃣ Send Email via Google Apps Script
            await account.sendVerificationEmail(email, newOtp);
            
            showToast("Verification code sent to your email! 📩", "success");
            setIsOtpStep(true); // Switch to OTP Screen
            
        } catch (error) {
            console.error("Signup Request Error:", error);
            showToast("Failed to verify credentials. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP & Create Account
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (userOtp !== generatedOtp) {
            showToast("Incorrect verification code. Try again. ❌", "error");
            return;
        }

        setLoading(true);
        try {
            // Create the user in Google Sheets
            const generatedId = ID.unique();
            const newUser = await account.create(generatedId, email, password, name, phone);
            localStorage.setItem("smartkrishi_user", JSON.stringify(newUser));
            
            showToast(`Account verified! Welcome to the farm, ${name}! 🌾`, "success");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            showToast("Failed to create account.", "error");
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

                {!isOtpStep ? (
                    <>
                        {/* ─── INITIAL SIGNUP FORM ─── */}
                        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
                            Create your farmer account to manage crops & fields
                        </p>

                        <form className="space-y-4" onSubmit={handleRequestSignup}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" required placeholder="Farmer name" value={name} onChange={(e) => setName(e.target.value)} className={inputBase} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="email" required placeholder="farmer@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBase} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="tel" required placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBase} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputBase} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1.5 ml-2 font-medium">Must be at least 8 characters long.</p>
                            </div>

                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 mt-6 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base">
                                {loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                            Already registered?{" "}
                            <Link to="/login" className="text-smart-green-600 hover:text-smart-green-500 transition-colors">
                                Login
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        {/* ─── OTP VERIFICATION SCREEN ─── */}
                        <div className="text-center mb-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-smart-green-50 dark:bg-smart-green-900/20 text-smart-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} />
                            </div>
                            <h2 className="font-bold text-xl mb-2">Check your email</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                We sent a 6-digit code to <br/><span className="text-gray-900 dark:text-white font-bold">{email}</span>
                            </p>
                        </div>

                        <form className="space-y-4 animate-in slide-in-from-right-4 duration-300" onSubmit={handleVerifyOtp}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest text-center">Enter 6-Digit Code</label>
                                <div className="relative max-w-[200px] mx-auto">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        maxLength="6" 
                                        required 
                                        placeholder="123456" 
                                        value={userOtp} 
                                        onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))} // only allows numbers
                                        className={`${inputBase} text-center font-bold tracking-widest text-lg`} 
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 mt-6 rounded-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-smart-green-900/20 active:scale-95 transition-all disabled:opacity-70 text-base">
                                {loading ? <Loader2 className="animate-spin" /> : <>Verify & Create Account <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                            Wrong email?{" "}
                            <button type="button" onClick={() => setIsOtpStep(false)} className="text-smart-green-600 hover:text-smart-green-500 transition-colors">
                                Go back
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Signup;