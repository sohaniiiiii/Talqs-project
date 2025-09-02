
//working
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        loginSchema.parse(formData);

        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        // ✅ Save token & user info in localStorage
        localStorage.setItem('token', data.token);
        // localStorage.setItem('user', JSON.stringify({ email: formData.email }));
        localStorage.setItem('user', JSON.stringify({
          userId: data.user._id,     // 🔑 You need this
          email: data.user.email     // ✅ Optional but good to keep
        }));


        toast.success('Login successful!');
        // navigate('/');
        //updated this
        window.location.href = '/'; 
      } else {
        signupSchema.parse(formData);

        const res = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');

        toast.success('Signup successful! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-800">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 dark:text-gray-900" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-400 dark:text-black"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 dark:text-black" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-400 dark:text-black"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 dark:text-black" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-400 dark:text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 "
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 dark:text-black" /> : <Eye className="h-5 w-5 text-gray-400 dark:text-black" />}
            </button>
          </div>
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 dark:text-black" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-400 dark:text-black"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white dark:text-black font-semibold rounded-md transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-green-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
