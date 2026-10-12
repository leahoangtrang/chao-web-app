import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const { login } = useAuth();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message ?? '');
    } else {
      alert('Login successful!');
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
      {error && <p className="text-red-600 w-5/6 text-sm">{error}</p>}
      <button type="submit" className='actionButton'>Log In</button>
    </form>
  );
};