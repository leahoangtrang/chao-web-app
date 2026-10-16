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
      // Calls your backend endpoint
      await AuthService.forgotPassword( {email} );
      setSubmitted(true);
    } catch (err : any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl mt-12">
      <h2 className="text-xl font-bold mb-2">Reset Your Password</h2>
      <p className="text-sm text-slate-500 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

      {submitted ? (
        <div className="space-y-4">
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm border border-emerald-200">
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
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white p-2 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center mt-4">
            <Link to="/chao/login" className="text-sm text-slate-600 hover:underline">
              Remembered your password? Log in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}