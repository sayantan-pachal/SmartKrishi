/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { User, Tractor, Mail, MapPin, Calendar, Phone, ShieldCheck, Loader2, X, AlertCircle, Edit, Lock, LogOut } from 'lucide-react';
import { account } from "../../appwrite/config";
import { useNavigate } from 'react-router-dom';
import { PageBackground, Reveal } from "../DashTemp/DashboardComponents";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  
  const [editFormData, setEditFormData] = useState({ name: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');
  
  const [deletingWithPassword, setDeletingWithPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await account.get();
        setUser(data);
        const phone = data.prefs?.phone || data.phone || '';
        setEditFormData({ name: data.name || '', phone: phone });
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }
    setEditing(true);
    try {
      let updatedUser = await account.updateName(editFormData.name);
      if (editFormData.phone !== (user.prefs?.phone || user.phone || '')) {
        updatedUser = await account.updatePrefs({ ...user.prefs, phone: editFormData.phone });
      }
      const freshData = await account.get();
      setUser(freshData);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setEditModalOpen(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      console.error("Update Profile Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setEditing(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.currentPassword) return setMessage({ type: 'error', text: 'Current password is required' });
    if (!passwords.newPassword) return setMessage({ type: 'error', text: 'New password is required' });
    if (passwords.newPassword !== passwords.confirmPassword) return setMessage({ type: 'error', text: 'Passwords do not match' });
    if (passwords.newPassword.length < 8) return setMessage({ type: 'error', text: 'Password must be at least 8 characters' });

    setEditing(true);
    try {
      await account.updatePassword(passwords.newPassword, passwords.currentPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordModalOpen(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      console.error("Update Password Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return setMessage({ type: 'error', text: 'Password is required' });

    setDeletingWithPassword(true);
    try {
      const sessions = await account.listSessions();
      for (const session of sessions.sessions) {
        try {
          await account.deleteSession(session.$id);
        } catch (err) {
          console.log("Session already deleted:", err.message);
        }
      }
      setMessage({ type: 'success', text: 'Account logged out. Redirecting...' });
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDeletePassword('');
        setMessage({ type: '', text: '' });
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error("Delete Account Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to process request.' });
      setDeletingWithPassword(false);
    }
  };

  const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-smart-green-200 dark:hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center text-smart-green-600 dark:text-smart-green-400">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold mb-1">{label}</p>
        <p className="font-bold text-[#111] dark:text-gray-100 text-sm md:text-base">{value || "Not Provided"}</p>
      </div>
    </div>
  );

  const inputBase = "w-full px-4 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-smart-green-500 outline-none transition dark:text-white font-medium text-sm";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="inline-flex p-6 bg-smart-green-50 dark:bg-smart-green-900/20 rounded-full mb-5">
            <Loader2 className="w-10 h-10 text-smart-green-600 animate-spin" />
          </div>
          <p className="font-fraunces font-bold text-2xl text-[#111] dark:text-white mb-2">Loading Identity</p>
          <p className="text-sm text-gray-400">Retrieving profile data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0a0a0a] font-dm text-[#111] dark:text-gray-100 pt-24 pb-24 transition-colors duration-300">
      <PageBackground />
      
      <div className="relative max-w-4xl mx-auto px-6">
        
        {/* ── Page header ── */}
        <div className="mb-10" style={{ animation: "fadeSlideDown 0.8s ease both" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-smart-green-600 dark:text-smart-green-400 mb-3 block">
                Farmer Identity
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-4">
                <h1 className="font-fraunces font-black text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] flex items-center lg:gap-2 flex-wrap">
                    My <em className="not-italic bg-gradient-to-br from-[#3b6d11] to-[#6BBF2A] bg-clip-text text-transparent ml-2">Profile</em>
                    <User className="lg:w-12 lg:h-12 w-10 h-10 text-smart-green-600 ml-3 hidden sm:block" />
                </h1>
            </div>
        </div>

        {/* ── Hero Profile Card ── */}
        <Reveal>
            <div className="bg-white dark:bg-white/[0.03] border border-black/6 dark:border-white/6 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm relative overflow-hidden mb-8">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-smart-green-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-smart-green-500 p-1.5 bg-white dark:bg-[#0a0a0a] shadow-xl">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'Farmer'}&background=dcfce7&color=166534&bold=true&font-size=0.4`} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-smart-green-600 to-emerald-500 text-white p-2 rounded-full border-4 border-white dark:border-[#0a0a0a] shadow-lg">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                <div className="text-center md:text-left relative z-10 pt-2 flex-1">
                    <h2 className="font-fraunces font-black text-3xl md:text-4xl text-[#111] dark:text-white mb-2">
                        {user?.name || "Farmer"}
                    </h2>
                    <p className="text-smart-green-600 dark:text-smart-green-400 font-bold flex items-center justify-center md:justify-start gap-2 mb-6">
                        Verified SmartKrishi Farmer <Tractor size={18} />
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <button 
                            onClick={() => { setEditModalOpen(true); setMessage({ type: '', text: '' }); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/10 text-[#111] dark:text-white font-bold rounded-xl transition-colors text-sm"
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                        <button 
                            onClick={() => { setPasswordModalOpen(true); setMessage({ type: '', text: '' }); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/10 text-[#111] dark:text-white font-bold rounded-xl transition-colors text-sm"
                        >
                            <Lock size={16} /> Security
                        </button>
                    </div>
                </div>
            </div>
        </Reveal>

        {/* ── Info Grid ── */}
        <Reveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ProfileItem icon={User} label="Full Name" value={user?.name} />
                <ProfileItem icon={Mail} label="Email Address" value={user?.email} />
                <ProfileItem icon={Phone} label="Phone Number" value={user?.prefs?.phone || user?.phone} />
                <ProfileItem icon={MapPin} label="Location" value="West Bengal, India" />
                <ProfileItem icon={Calendar} label="Member Since" value={user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A"} />
                <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-[10px] text-green-100 uppercase font-bold tracking-[0.15em] mb-1">Account Status</p>
                        <p className="font-fraunces font-bold text-xl">{user?.status ? "Active & Secure" : "Verified"}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center relative z-10 backdrop-blur-sm">
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </div>
        </Reveal>

        {/* ── Danger Zone ── */}
        <Reveal delay={200}>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-fraunces font-bold text-xl text-red-700 dark:text-red-400 mb-2">Logout & Terminate Session</h3>
                    <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80">End your current session across all devices. You will need to log back in.</p>
                </div>
                <button 
                    onClick={() => { setDeleteModalOpen(true); setMessage({ type: '', text: '' }); }}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm"
                >
                    <LogOut size={18} /> End Session
                </button>
            </div>
        </Reveal>
      </div>

      {/* ── MODALS ── */}

      {/* 1. Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 font-dm">
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)]" />
              <button 
                onClick={() => { setEditModalOpen(false); setMessage({ type: '', text: '' }); }}
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
              <div className="mt-2 relative z-10">
                  <h2 className="font-fraunces text-3xl font-bold text-white">Edit Profile</h2>
                  <p className="text-green-100 text-xs font-bold uppercase tracking-[0.15em] mt-2">Update your identity</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {message.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className={inputBase}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => { setEditModalOpen(false); setMessage({ type: '', text: '' }); }}
                  disabled={editing}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/[0.03] text-[#111] dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={editing}
                  className="flex-1 py-4 bg-smart-green-600 text-white font-bold rounded-2xl hover:bg-smart-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {editing ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 font-dm">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent_70%)]" />
              <button 
                onClick={() => { setPasswordModalOpen(false); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage({ type: '', text: '' }); }}
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
              <div className="mt-2 relative z-10">
                  <h2 className="font-fraunces text-3xl font-bold text-white">Security</h2>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.15em] mt-2">Update your password</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {message.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className={inputBase.replace("focus:ring-smart-green-500", "focus:ring-blue-500")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className={inputBase.replace("focus:ring-smart-green-500", "focus:ring-blue-500")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className={inputBase.replace("focus:ring-smart-green-500", "focus:ring-blue-500")}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => { setPasswordModalOpen(false); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage({ type: '', text: '' }); }}
                  disabled={editing}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/[0.03] text-[#111] dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={editing}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {editing ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete/Logout Session Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 font-dm">
            <div className="p-8 text-center border-b border-black/5 dark:border-white/5">
                <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
                    <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <h3 className="font-fraunces text-2xl font-bold text-[#111] dark:text-white mb-2">End Session?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    This will terminate your active session and log you out.
                </p>
            </div>

            <div className="p-8 space-y-6">
              {message.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Enter Password to Confirm</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className={inputBase.replace("focus:ring-smart-green-500", "focus:ring-red-500")}
                  placeholder="Your password"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setDeleteModalOpen(false); setDeletePassword(''); setMessage({ type: '', text: '' }); }}
                  disabled={deletingWithPassword}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/[0.03] text-[#111] dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingWithPassword || !deletePassword}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {deletingWithPassword ? <><Loader2 size={16} className="animate-spin" /> Working...</> : 'Log Out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;