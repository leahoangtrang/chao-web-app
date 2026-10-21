// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { useState } from 'react';
import { Link } from 'react-router';
import { AuthService } from '../api/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ( e : any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.forgotPassword( {email} );
      setSubmitted(true);
    } catch (err : any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-5/6 max-w-md mx-auto p-6 text-slate-900 dark:text-zinc-200 bg-white dark:bg-zinc-800 rounded mt-12">
      <h3 className="text-xl font-bold mb-2">Reset Your Password</h3>
      <p className="text-sm mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

      {submitted ? (
        <div className="space-y-4">
          <div className="text-emerald-800 bg-emerald-50 p-4 rounded text-sm border border-neutral-400">
            If an account with that email exists, we have sent a password reset link. Please check your inbox.
          </div>
          <Link 
            to="/login" 
            className="block text-center text-emerald-600 font-medium hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="actionButton w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center mt-4">
            <Link to="/chao/login" className="text-sm hover:underline">
              Remembered your password? Log in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}