import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaLink, FaCheckCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import { exceptToken } from '../api/index'
import { useAuth } from '../context/AuthContext';
import {requestHandler} from '../utils/index'

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setErrorMsg('Invalid or missing invite token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        await requestHandler(
            async () => {
                // Prepare the data for the API call
                const requestData = {
                    token,
                    email: formData.email,
                    password: formData.password
                };

                // Call the exceptToken API function
                return await exceptToken(requestData);
            },
            setIsSubmitting, // Loading state setter
            (data) => {
                // Success handler
                const { accessToken, user } = data.data;
                login(accessToken, user);

                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setIsSuccess(true);
                setTimeout(() => navigate('/dashboard'), 2000);
            },
            (error) => {
                // Error handler
                setErrorMsg(error.message || 'Failed to accept invite. Check credentials or link expiry.');
            }
        );
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 shadow-sm">
                        <FaCheckCircle />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">Invite Accepted!</h1>
                    <p className="text-slate-500 mt-2">Welcome to the workspace. One moment...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 items-center justify-center p-6">
            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-100 border border-blue-50"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg shadow-blue-200 mb-6 rotate-3">
                        <FaLink />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Accept Invite</h1>
                    <p className="text-slate-500 mt-2">Login to join your team workspace.</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="email" required placeholder="Email Address"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all text-slate-800"
                        />
                    </div>

                    <div className="relative group">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="password" required placeholder="Password"
                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all text-slate-800"
                        />
                    </div>

                    <button
                        type="submit" disabled={isSubmitting || !token}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all mt-4 disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'Accept & Join'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AcceptInvite;
