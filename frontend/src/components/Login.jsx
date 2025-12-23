import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, Music, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || 'Invalid Credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] animate-float-delayed" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card p-8 md:p-12 w-full max-w-md relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20"
          >
            <Music className="w-8 h-8 text-black" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-2">Login to your account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-5 w-5 pointer-events-none" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Email Address"
                className="glass-input pl-12 py-3.5" /* Explicit padding to fix overlap */
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-5 w-5 pointer-events-none" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Password"
                className="glass-input pl-20 py-3.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-primary hover:text-green-400 font-semibold transition-colors relative group"
            >
              Register now
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;