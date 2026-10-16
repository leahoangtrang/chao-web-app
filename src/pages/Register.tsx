import { useState } from 'react';
import type { SubmitEvent } from 'react';
// import { AuthService } from '../api/auth.service';
import type { RegisterRequest } from '../types/api';
// import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const { register } = useAuth();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    // try {
    //   const response = await AuthService.register(formData);
    //   localStorage.setItem('token', response.token);
    //   alert('Registration successful!');
    // } catch (err) {
    //   const axiosError = err as AxiosError<{ message?: string }>;
    //   setError(
    //     axiosError.response?.data?.message || 'Registration failed'
    //   );
    // }
  const result = await register(formData.username, formData.email, formData.password);
    if (!result.success) {
      setError(result.message ?? '');
    } else {
      // alert('Registration successful!');
      window.location.href = '/chao/me'; // Redirect to login
    }   

  };

  return (
    <form className='flex flex-col items-center gap-4 w-full max-w-md mx-auto' onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      <label className='inputFieldLabel'>
        Username
        <input
          type="text"
          // placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          className='inputField'
        />
      </label>
      
      <label className='inputFieldLabel'>
        Email
        <input
          type="email"
          // placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          // className='focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/30 transition-all w-full px-4 py-2 border rounded border-neutral-400 bg-white'
          required
          className='inputField'
        />
      </label>

      <label className='inputFieldLabel'>
        Password
        <input
          type="password"
          // placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className='inputField'
        />
      </label>
      {error && <p className="text-red-600 w-5/6 text-sm">{error}</p>}
      <button type="submit" className='actionButton cursor-pointer'>Register</button>
    </form>
  );
};