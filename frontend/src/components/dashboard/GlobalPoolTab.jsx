import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUsers, FiMail, FiPhone, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { api } from '../../lib/api';

export const GlobalPoolTab = ({ showToast }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/v1/tms/user/bulk-upload', {
                users: [formData]
            });
            showToast('User added to Global Pool! Default pass: Welcome@123', 'success');
            setFormData({ name: '', email: '', phone: '' });
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to add user', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Global User Pool</h2>
                <p className="text-slate-500 text-sm mt-1">Add users to the system so they can be invited to workspaces.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors" />
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                           <FiUserPlus className="text-blue-600" /> Pre-Create User
                        </h3>

                        <form onSubmit={handleAdd} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                                <div className="relative">
                                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text" required placeholder="John Doe"
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="email" required placeholder="john@example.com"
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Phone (Optional)</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text" placeholder="+91..."
                                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : 'Add to Global Pool'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <h3 className="text-2xl font-black mb-4">Phase C Test Instructions</h3>
                        <div className="space-y-4 opacity-90 text-sm font-medium">
                            <p>1. Enter a name and email on the left to add a "Testing User" to the database.</p>
                            <p>2. Go to the <b>Invites</b> tab and generate a link.</p>
                            <p>3. Open an <b>Incognito/Private Browser</b> window.</p>
                            <p>4. Paste the link and login with the email you just added and password: <b>Welcome@123</b></p>
                            <div className="pt-2 flex items-center gap-2 text-blue-200 font-black italic">
                               <FiCheckCircle /> Verification Complete
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 text-2xl">
                            <FiUsers />
                         </div>
                         <h4 className="font-bold text-slate-800">Security Note</h4>
                         <p className="text-slate-400 text-sm max-w-xs mt-1">
                             Users added here do not have workspace access by default. They must be invited via a secure link to join any tenant.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
