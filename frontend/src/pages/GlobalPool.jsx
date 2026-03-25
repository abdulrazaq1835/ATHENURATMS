// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiUserPlus, FiUsers, FiMail, FiPhone, FiCheckCircle, FiLoader, FiArrowLeft, FiSearch, FiShield, FiAlertCircle, FiX, FiUpload, FiBriefcase, FiCalendar, FiHash } from 'react-icons/fi';
// import Papa from 'papaparse';
// import { api } from '../lib/api';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const GlobalPool = () => {
//     const navigate = useNavigate();
//     const { user: currentUser } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [bulkLoading, setBulkLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);
//     const [users, setUsers] = useState([]);
//     const [formData, setFormData] = useState({ name: '', email: '', phone: '', domain: '', joiningDate: '', internId: '' });
//     const [toast, setToast] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [activeAction, setActiveAction] = useState('single');

//     const showToast = (msg, type = 'success') => {
//         setToast({ msg, type });
//         setTimeout(() => setToast(null), 3500);
//     };

//     useEffect(() => {
//         if (!currentUser?.isSuperuser) {
//             navigate('/workspaces');
//             return;
//         }
//         fetchGlobalUsers();
//     }, [currentUser, navigate]);

//     const fetchGlobalUsers = async () => {
//         setFetching(true);
//         try {
//             const res = await api.get('/api/v1/tms/user/all');
//             setUsers(res.data?.data || []);
//         } catch (err) {
//             console.error("Failed to fetch users", err);
//             setUsers([]);
//         } finally {
//             setFetching(false);
//         }
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             await api.post('/api/v1/tms/user/bulk-upload', {
//                 users: [formData]
//             });
//             showToast('User added to Global Pool!', 'success');
//             setFormData({ name: '', email: '', phone: '', domain: '', joiningDate: '', internId: '' });
//             fetchGlobalUsers();
//         } catch (err) {
//             showToast(err.response?.data?.message || 'Failed to add user', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setBulkLoading(true);
//         Papa.parse(file, {
//             header: true,
//             skipEmptyLines: true,
//             complete: async (results) => {
//                 const csvData = results.data.map(row => ({
//                     name: row.name || row.Name || row.full_name,
//                     email: row.email || row.Email,
//                     phone: row.phone || row.Phone || "",
//                     domain: row.domain || row.Domain || "",
//                     joiningDate: row.joiningDate || row.JoiningDate || row['join_date'] || null,
//                     internId: row.internId || row.InternId || row['intern_id'] || ""
//                 })).filter(u => u.name && u.email);

//                 if (csvData.length === 0) {
//                     showToast('Invalid CSV format.', 'error');
//                     setBulkLoading(false);
//                     return;
//                 }

//                 try {
//                     const res = await api.post('/api/v1/tms/user/bulk-upload', { users: csvData });
//                     const { created, errors } = res.data.data;
//                     showToast(`Uploaded ${created} users!`, created > 0 ? 'success' : 'error');
//                     fetchGlobalUsers();
//                     setActiveAction('single');
//                 } catch (err) {
//                     showToast('Bulk upload failed', 'error');
//                 } finally {
//                     setBulkLoading(false);
//                     e.target.value = '';
//                 }
//             },
//             error: () => {
//                 showToast('Error parsing CSV', 'error');
//                 setBulkLoading(false);
//             }
//         });
//     };

//     const filteredUsers = users.filter(u =>
//         u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.internId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.domain?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col">
//             {/* Header - Compact */}
//             <header className="bg-white border-b border-slate-200 z-30 shrink-0">
//                 <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => navigate('/workspaces')}
//                             className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
//                         >
//                             <FiArrowLeft size={18} />
//                         </button>
//                         <div>
//                             <h1 className="text-lg font-black tracking-tight">Global Pool</h1>
//                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">System Admin</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
//                             <FiShield className="text-blue-600" size={12} />
//                             <span className="text-blue-700 text-[10px] font-black uppercase tracking-wider">Superuser</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto px-6 py-6 flex-1 flex gap-8 overflow-hidden w-full">
//                 {/* Left: Action Toggle & Forms - Compact */}
//                 <div className="w-80 lg:w-96 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
//                     <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex gap-1 shadow-sm sticky top-0 z-10">
//                         <button
//                             onClick={() => setActiveAction('single')}
//                             className={`flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
//                                 activeAction === 'single' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'
//                             }`}
//                         >
//                             <FiUserPlus size={14} /> Single
//                         </button>
//                         <button
//                             onClick={() => setActiveAction('bulk')}
//                             className={`flex-1 py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
//                                 activeAction === 'bulk' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'
//                             }`}
//                         >
//                             <FiUpload size={14} /> Bulk
//                         </button>
//                     </div>

//                     <AnimatePresence mode="wait">
//                         {activeAction === 'single' ? (
//                             <motion.div
//                                 key="single-form"
//                                 initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
//                                 className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
//                             >
//                                 <h2 className="text-lg font-black mb-1">Add Intern</h2>
//                                 <p className="text-slate-400 text-[11px] mb-5 font-medium">Quickly register a new member.</p>

//                                 <form onSubmit={handleAdd} className="space-y-3">
//                                     <div className="space-y-1">
//                                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
//                                         <div className="relative">
//                                             <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors" size={14} />
//                                             <input
//                                                 type="text" required placeholder="John Doe"
//                                                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
//                                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 font-medium"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-1">
//                                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
//                                         <div className="relative">
//                                             <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                                             <input
//                                                 type="email" required placeholder="john@company.com"
//                                                 value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
//                                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 font-medium"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-3">
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ID</label>
//                                             <input
//                                                 type="text" placeholder="INT001"
//                                                 value={formData.internId} onChange={e => setFormData({...formData, internId: e.target.value})}
//                                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 font-medium"
//                                             />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain</label>
//                                             <input
//                                                 type="text" placeholder="Frontend"
//                                                 value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})}
//                                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 font-medium"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-1">
//                                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date</label>
//                                         <input
//                                             type="date"
//                                             value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})}
//                                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-500 font-medium"
//                                         />
//                                     </div>

//                                     <button
//                                         type="submit" disabled={loading}
//                                         className="w-full bg-slate-900 hover:bg-black text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 text-xs"
//                                     >
//                                         {loading ? <FiLoader className="animate-spin" /> : 'Register Intern'}
//                                     </button>
//                                 </form>
//                             </motion.div>
//                         ) : (
//                             <motion.div
//                                 key="bulk-form"
//                                 initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
//                                 className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
//                             >
//                                 <h2 className="text-lg font-black mb-1 text-emerald-600">Bulk Upload</h2>
//                                 <p className="text-slate-400 text-[11px] mb-5 font-medium">Upload your CSV intern list.</p>

//                                 <div className="relative">
//                                     <input
//                                         type="file" accept=".csv"
//                                         onChange={handleFileUpload}
//                                         disabled={bulkLoading}
//                                         className="hidden" id="csv-upload-compact"
//                                     />
//                                     <label
//                                         htmlFor="csv-upload-compact"
//                                         className={`w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
//                                             bulkLoading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30'
//                                         }`}
//                                     >
//                                         {bulkLoading ? <FiLoader className="animate-spin text-emerald-600" /> : <FiUpload className="text-emerald-500" size={24} />}
//                                         <p className="text-xs font-black text-slate-800">Choose CSV File</p>
//                                     </label>
//                                 </div>

//                                 <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
//                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Example Headers</p>
//                                     <div className="flex flex-wrap gap-1.5 opacity-70">
//                                         {['name', 'email', 'domain'].map(h => (
//                                             <span key={h} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold">{h}</span>
//                                         ))}
//                                         <span className="text-[9px] font-bold text-slate-400">...and more</span>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 {/* Right: User List - Flexible & Scrollable */}
//                 <div className="flex-1 flex flex-col gap-4 overflow-hidden">
//                     <div className="shrink-0 relative">
//                         <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                         <input
//                             type="text"
//                             placeholder="Quick search by name, department, or ID..."
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                             className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
//                         />
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm flex flex-col flex-1">
//                         <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
//                             <div>
//                                 <h3 className="text-base font-black">Intern Directory</h3>
//                                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{filteredUsers.length} active records</p>
//                             </div>
//                         </div>

//                         <div className="overflow-y-auto flex-1 custom-scrollbar">
//                             {fetching ? (
//                                 <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
//                                     <FiLoader size={30} className="animate-spin" />
//                                     <p className="text-[10px] font-black uppercase tracking-widest">Loading Records</p>
//                                 </div>
//                             ) : (
//                                 <table className="w-full text-left border-collapse">
//                                     <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10">
//                                         <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
//                                             <th className="px-6 py-3">Member</th>
//                                             <th className="px-6 py-3">Reference</th>
//                                             <th className="px-6 py-3 text-center">Status</th>
//                                             <th className="px-6 py-3 text-right">Registered</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50">
//                                         {filteredUsers.map((u) => (
//                                             <tr key={u._id} className="group hover:bg-blue-50/20 transition-colors">
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-500 text-[10px] shrink-0">
//                                                             {u.name?.substring(0, 2).toUpperCase()}
//                                                         </div>
//                                                         <div className="min-w-0">
//                                                             <p className="font-bold text-slate-800 truncate text-[13px]">{u.name}</p>
//                                                             <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex flex-col">
//                                                         <span className="text-xs font-bold text-slate-700">#{u.internId || 'N/A'}</span>
//                                                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{u.domain || 'General'}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 text-center">
//                                                     <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${
//                                                         u.isSuperuser ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'
//                                                     }`}>
//                                                         {u.isSuperuser ? 'Admin' : 'Intern'}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 text-right font-bold text-[10px] text-slate-300">
//                                                     {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             <style dangerouslySetInnerHTML={{ __html: `
//                 .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//                 .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//                 .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//             `}} />

//             <AnimatePresence>
//                 {toast && (
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
//                         className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
//                             toast.type === 'success' ? 'bg-white border-emerald-100 text-slate-800' : 'bg-red-50 border-red-100 text-red-600'
//                         }`}
//                     >
//                         {toast.type === 'success' ? <FiCheckCircle className="text-emerald-500" /> : <FiAlertCircle />}
//                         {toast.msg}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default GlobalPool;
