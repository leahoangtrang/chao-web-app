import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Adjust import path
import { useLanguage } from '../context/LanguageContext'; // For i18n support

export default function UserPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  // 1. Unauthenticated View (Not logged in)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-canvas-dark-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-md w-full shadow-md space-y-6">
          
          <div className="w-16 h-16 bg-tree-100 dark:bg-tree-950 text-tree-600 dark:text-tree-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-tree-200 dark:border-tree-800">
            🌱
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome to TreeLearn
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Sign in or create an account to save your learning progress, unlock lessons, and track your vocabulary growth.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-xl bg-tree-500 hover:bg-tree-600 active:bg-tree-700 text-white font-bold transition-all shadow-md shadow-tree-500/20 text-center text-sm"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-slate-200 font-semibold transition-colors text-center text-sm"
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
      <div className="bg-white dark:bg-canvas-dark-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-tree-500 text-white rounded-full flex items-center justify-center text-xl font-extrabold uppercase">
            {user.username ? user.username.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.username || 'Learner'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email || 'Registered User'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

    </div>
  );
}