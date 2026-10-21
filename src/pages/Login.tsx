// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { useEffect, useState, type SubmitEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
  }
  }, [searchParams])

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password, rememberMe);
    if (!result.success) {
      setError(result.message ?? '');
    } else {
      // alert('Login successful!');
      navigate('/chao/me');
    }
  };

  return (
    <form className='flex flex-col items-center gap-4 w-full max-w-md mx-auto' onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label className='inputFieldLabel'>Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='inputField'
        />
      </label>
      <label className='inputFieldLabel'>Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='inputField'
        />
      </label>

      {/* Remember Me Checkbox */}
      <div className="w-5/6 max-w-md flex items-center justify-between space-x-2">
        <div>
          <input 
            type="checkbox" 
            id="rememberMe" 
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} 
            className="border-neutral-200 dark:border-neutral-900 mr-1"
          />
          <label htmlFor="rememberMe" className="text-sm text-slate-900 dark:text-zinc-200 cursor-pointer">Remember me for 30 days</label>
        </div>
        <Link to='/chao/forgot-password' className="text-sm text-slate-900 dark:text-zinc-200 hover:underline">Forgot Password?</Link>
      </div>

      {/* Forgot Password */}
      
      {error && <p className="text-red-600 w-5/6 text-sm">{error}</p>}
      <button type="submit" className='actionButton'>Log In</button>
    </form>
  );
};