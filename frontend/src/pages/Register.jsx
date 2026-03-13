import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaKey, FaArrowRight, FaEye, FaEyeSlash, FaCheckCircle, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const [role, setRole] = useState('manager');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    adminSecretKey: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      // Backend expects: name, email, password, role, phone
      await axios.post("/api/v1/tms/auth/user/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "0000000000",
        role: role
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset success after UI animates, then redirect
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/login');
      }, 1500);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.message || "Registration failed. Please check inputs.");
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
      className="flex bg-white overflow-hidden" style={{ minHeight: "calc(100vh - 80px)", marginTop: "80px" }}
    >
      <motion.div 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-shrink-0"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-600/90 to-indigo-900/90" />
        <motion.img
          initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Productivity" className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 text-white">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl font-black mb-4">Master Your Workflow</h1>
            <p className="text-xl text-blue-100 max-w-md">Join thousands of professionals who manage their tasks seamlessly.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-4 group">
              <motion.div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <FaArrowRight className="text-blue-300" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Smart Organization</h3>
                <p className="text-blue-200">Keep all your tasks in one place.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 overflow-y-auto bg-gray-50/30 relative">
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
            >
              <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className="text-green-500 text-7xl mb-4">
                <FaCheckCircle />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900">Account Created!</h2>
              <p className="text-gray-500 mt-2">Welcome to the team. Redirecting...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="text-left mb-6">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join us and start managing your tasks efficiently</p>
            {errorMsg && <p className="text-red-500 mt-2 font-bold">{errorMsg}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="flex space-x-4 mb-6">
            <button
              type="button" onClick={() => setRole('manager')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'manager' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border-2 border-gray-100'}`}
            >
              Manager
            </button>
            <button
              type="button" onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border-2 border-gray-100'}`}
            >
              Admin
            </button>
          </motion.div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaUser />
              </div>
              <input name="fullName" type="text" required className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 bg-white" placeholder="Full Name" onChange={handleChange} />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope />
              </div>
              <input name="email" type="email" required className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 bg-white" placeholder="Email address" onChange={handleChange} />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaPhone />
              </div>
              <input name="phone" type="text" required className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 bg-white" placeholder="Phone Number" onChange={handleChange} />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaLock />
              </div>
              <input name="password" type={showPassword ? 'text' : 'password'} required className="block w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 bg-white" placeholder="Password" onChange={handleChange} />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>

            <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" className={`w-full flex justify-center py-4 px-4 text-sm font-black rounded-2xl text-white transition-all shadow-xl ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="font-black text-blue-600 hover:text-blue-700">Login here</Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;