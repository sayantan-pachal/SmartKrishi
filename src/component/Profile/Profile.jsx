/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, Calendar, Phone, ShieldCheck, Loader2, X } from 'lucide-react';
import { account } from "../../appwrite/config";
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingWithPassword, setDeletingWithPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await account.get();
        setUser(data);
        // Get phone from prefs or userData
        const phone = data.prefs?.phone || data.phone || '';
        setEditFormData({
          name: data.name || '',
          phone: phone
        });
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleEditProfileClick = () => {
    setEditModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setEditing(true);
    try {
      // Update name
      let updatedUser = await account.updateName(editFormData.name);

      // Update phone in preferences (custom data storage)
      if (editFormData.phone !== (user.prefs?.phone || user.phone || '')) {
        updatedUser = await account.updatePrefs({
          ...user.prefs,
          phone: editFormData.phone
        });
      }

      // Refresh user data
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
    if (!passwords.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (!passwords.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

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
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Password is required to delete account' });
      return;
    }

    setDeletingWithPassword(true);
    try {
      console.log("Starting account deletion...");
      
      // Delete all active sessions first
      const sessions = await account.listSessions();
      console.log("Sessions found:", sessions.sessions.length);
      
      for (const session of sessions.sessions) {
        try {
          await account.deleteSession(session.$id);
          console.log("Deleted session:", session.$id);
        } catch (err) {
          console.log("Session already deleted or error:", err.message);
        }
      }

      // After all sessions are deleted, the user will be logged out
      setMessage({ type: 'success', text: 'Account logged out. Redirecting to login...' });
      
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDeletePassword('');
        setMessage({ type: '', text: '' });
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error("Delete Account Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete account. Please try again.' });
      setDeletingWithPassword(false);
    }
  };

  const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-gray-900 dark:text-white font-medium">
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-black pt-28 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="relative mb-8 p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-xl shadow-green-900/5 border border-white dark:border-gray-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 p-1">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'Farmer'}&background=dcfce7&color=166534&bold=true&font-size=0.5&length=2`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-900">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || "Farmer"}
              </h1>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Verified SmartKrishi Farmer 🌾
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileItem 
            icon={User} 
            label="Full Name" 
            value={user?.name} 
          />
          <ProfileItem 
            icon={Mail} 
            label="Email Address" 
            value={user?.email} 
          />
          <ProfileItem 
            icon={Phone} 
            label="Phone Number" 
            value={user?.prefs?.phone || user?.phone || 'Not Provided'}
          />
          <ProfileItem 
            icon={MapPin} 
            label="Location" 
            value="West Bengal, India" 
          />
          <ProfileItem 
            icon={Calendar} 
            label="Member Since" 
            value={user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A"} 
          />
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg cursor-pointer hover:opacity-90 transition">
            <div className="p-2 rounded-lg bg-white/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-green-100 uppercase font-bold">Account Status</p>
              <p className="font-bold">{user?.status ? "Active & Secure" : "Verified"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={handleEditProfileClick}
            className="px-6 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => {
              setDeleteModalOpen(true);
              setMessage({ type: '', text: '' });
            }}
            className="px-6 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-semibold hover:bg-red-100 dark:hover:bg-red-900/20 transition"
          >
            Delete Account
          </button>
        </div>
        
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button 
                onClick={() => {
                  setEditModalOpen(false);
                  setMessage({ type: '', text: '' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setMessage({ type: '', text: '' });
                }}
                disabled={editing}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editing}
                className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {editing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Want to change your password?
              </p>
              <button
                onClick={() => {
                  setPasswordModalOpen(true);
                  setEditModalOpen(false);
                  setMessage({ type: '', text: '' });
                }}
                className="w-full px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/30 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>
              <button 
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setMessage({ type: '', text: '' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setMessage({ type: '', text: '' });
                }}
                disabled={editing}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                disabled={editing}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {editing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Delete Account</h2>
              <button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletePassword('');
                  setMessage({ type: '', text: '' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold">
                ⚠️ Warning: This action logs you out!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Your account session will be terminated. You will be logged out and unable to access SmartKrishi.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>All your active sessions will be ended</li>
                <li>You'll need to log in again to regain access</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Enter your password to confirm:
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletePassword('');
                  setMessage({ type: '', text: '' });
                }}
                disabled={deletingWithPassword}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingWithPassword || !deletePassword}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingWithPassword ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Logging out...
                  </>
                ) : (
                  'Log Out & Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;