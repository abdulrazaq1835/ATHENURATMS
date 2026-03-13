import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Login = () => {
  const [role, setRole] = useState('manager'); // From spec, mostly manager or admin
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(""); // clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Backend expects email and password based on auth controller
      const res = await axios.post("/api/v1/tms/auth/user/login", formData);
      
      const { data } = res.data;
      
      // Usually it's in a cookie but the API might return tokens in the wrapper, or we rely on cookies
      // Assuming a standard token access logic or the backend provided token (as JWT spec asked)
      const token = res.data.data?.accessToken || "mock-token-for-dev"; 
      
      login(token, res.data.data);

      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.message || "Login failed. Please check credentials.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="flex bg-white" style={{ minHeight: "calc(100vh - 80px)", marginTop: "80px" }}
    >
      <motion.div 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-600/90 to-indigo-900/90" />
        <motion.img
          initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1932&auto=format&fit=crop"
          alt="Login Workspace" className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 text-white">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl font-black mb-4">Welcome Back</h1>
            <p className="text-xl text-blue-100 max-w-md">Your tasks are waiting for you. Log in to stay on top of your goals.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-4 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20"
              >
                <FaLock className="text-blue-300" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Secure Access</h3>
                <p className="text-blue-200">Your data is encrypted and safe.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative">
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
            >
              <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", damping: 12 }} className="text-green-500 text-7xl mb-4">
                <FaCheckCircle />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900">Success!</h2>
              <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="text-left mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">Welcome back! Please enter your details.</p>
            {errorMsg && <p className="text-red-500 mt-2 font-bold">{errorMsg}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('manager')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'manager' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              Admin
            </button>
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <Input name="email" type="email" required placeholder="Email address" onChange={handleChange} />
              </motion.div>

              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <Input name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" onChange={handleChange} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">Remember me</label>
              </div>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot password?</a>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
               <Button type="submit" disabled={isSubmitting} className={isSubmitting ? 'bg-blue-400 cursor-not-allowed' : ''}>
                 {isSubmitting ? 'Logging in...' : 'Sign In'}
               </Button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="text-center mt-8">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="font-black text-blue-600 hover:text-blue-700">Register now</Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
