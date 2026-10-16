import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Adjust import path
import { useLanguage } from '../context/LanguageContext'; // For i18n support
import { useEffect, useState } from 'react';
import { UserService } from '../api/user.service';
import type { UserResponse } from '../types/api';

export default function UserPage() {
//   const { user, isAuthenticated, logout } = useAuth();
  const { isAuthenticated, logout } = useAuth();
//   console.log(isAuthenticated);
  const { t } = useLanguage();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  // Form states initialized with current user data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
      try {
        const response = await UserService.getUser();

        if (!response) {
          throw new Error('Failed to fetch user profile data.');
        }

        const data = response;
        setUser(data);
        setUsername(data.username);
        setEmail(data.email)
      } catch (error : any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  // Feedback states
  const [message, setMessage] = useState<String | null>(null);

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e : any) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // 1. Build a dynamic payload object checking each field against the original user state
    const payload: {[key: string]: string} = {};
    if (username !== user?.username) payload.username = username;
    if (email !== user?.email) payload.email = email;

    // 2. If the payload object is empty, nothing was changed!
    if (Object.keys(payload).length === 0) {
        setMessage("No changes detected.");
        return;
    }
    try {
        const response = await UserService.updateUser(payload);
        setMessage('Profile updated successfully!');
    //   if (onUserUpdated) onUserUpdated(response); // Refresh parent state
        localStorage.setItem('token', response.token);
        setUser((newUser) => ({
            ...newUser,
            username: response.username,
            email: response.email, 
        }));
    } catch (err : any) {
        setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  // 2. Handle Password Change
  const handleChangePassword = async (e : any) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await UserService.changePassword({ currentPassword, newPassword, confirmationPassword });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmationPassword('');
    } catch (err : any) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  // 3. Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your Chao account? This action cannot be undone.')) {
      return;
    }
    try {
      await UserService.deleteUser();
      localStorage.removeItem('token'); // Clear token
      window.location.href = '/chao/register';
    } catch (err) {
      setError('Failed to delete account.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 1. Unauthenticated View (Not logged in)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-900 rounded p-8 max-w-md w-full space-y-6">
          
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl border">
            🌱
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-600">
              Welcome to Chao
            </h1>
            <p className="text-sm text-slate-900 dark:text-zinc-200 mt-2">
              Sign in or create an account to save your learning progress.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/chao/login"
              className="w-full py-3 px-4 rounded bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 text-center text-sm"
            >
              Sign In
            </Link>

            <Link
              to="/chao/register"
              className="w-full py-3 px-4 rounded border border-neutral-200 dark:border-neutral-900 text-slate-900 dark:text-zinc-200 font-semibold text-center text-sm"
            >
              Create Account
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 2. Authenticated Profile View (Logged in)
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      
      {/* Profile Card Header */}
      <div className="card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-800 dark:bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-extrabold uppercase">
            {user.username ? user.username.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-200">
              {user.username || 'Learner'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email || 'Registered User'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card p-6 sm:p-8">
        <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-200 mb-4">Edit Profile</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-zinc-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-200 dark:border-neutral-900 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-zinc-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-200 dark:border-neutral-900 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              
            />
          </div>
          <button type="submit" className="bg-emerald-800 dark:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-500">
            Save Changes
          </button>
        </form>
      </div>

      {/* Notifications */}
      {message && <div className="bg-emerald-100 text-emerald-800 p-3 rounded text-sm">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded text-sm">{error}</div>}
      
      {/* Change Password Form */}
      <div className="card p-6 sm:p-8">
        <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-200 mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-zinc-200">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-200 dark:border-neutral-900 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-zinc-200">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-200 dark:border-neutral-900 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-zinc-200">Confirm New Password</label>
            <input
              type="password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-200 dark:border-neutral-900 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>
          <button type="submit" className="bg-emerald-800 dark:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-500">
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded p-6 sm:p-8">
        <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>


        {/* Stats Summary */}
        {/* <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-canvas-dark-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed Lessons
            </p>
            <p className="text-2xl font-black text-tree-600 dark:text-tree-400 mt-1">
                {user.completedLessonsCount || 0}
            </p>
            </div>

            <div className="bg-white dark:bg-canvas-dark-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Learned Words
            </p>
            <p className="text-2xl font-black text-tree-600 dark:text-tree-400 mt-1">
                {user.learnedVocabCount || 0}
            </p>
            </div>
        </div> */}
        <button
            onClick={logout}
            className="w-full px-4 py-2 text-xs font-semibold rounded text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900 transition-colors"
        >
            Sign Out
        </button>
    </div>
  );
}