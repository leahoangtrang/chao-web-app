import { useEffect, useState, type SubmitEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
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
      window.location.href = '/chao/me';
    }
  };

  return (
    <form className='flex flex-col items-center gap-4 w-full max-w-md mx-auto' onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label className='inputFieldLabel'>Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='inputField'
        />
        </label>
      </div>
      <div>
        <label className='inputFieldLabel'>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='inputField'
        />
      </div>

      {/* Remember Me Checkbox */}
      <div className="w-5/6 flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="rememberMe" 
          checked={rememberMe} 
          onChange={(e) => setRememberMe(e.target.checked)} 
          className="border-slate-200"
        />
        <label htmlFor="rememberMe" className="text-sm text-slate-900">Remember me for 30 days</label>
      </div>

      {/* Forgot Password */}
      <Link to='/chao/forgot-password'>Forgot Password</Link>
      {error && <p className="text-red-600 w-5/6 text-sm">{error}</p>}
      <button type="submit" className='actionButton'>Log In</button>
    </form>
  );
};