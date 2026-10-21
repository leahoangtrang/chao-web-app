// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { AuthService } from '../api/auth.service';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? ''; // Grabs ?token=xyz from URL
  
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<String>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e : any) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await AuthService.resetPassword({ token, newPassword });
      setMessage(response);
      setTimeout(() => navigate('/chao/login'), 3000); // Redirect to login after 3s
    } catch (err : any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="w-5/6 max-w-md mx-auto p-6 text-slate-900 dark:text-zinc-200 bg-white dark:bg-zinc-800 rounded mt-12">
      <h3 className="text-xl font-bold mb-4">Set New Password</h3>
      
      {message && <div className="bg-emerald-100 text-emerald-800 p-3 rounded mb-4 text-sm">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="inputField"
            required
          />
        </div>
        <button type="submit" className="actionButton w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
}