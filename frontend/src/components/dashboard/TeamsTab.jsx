import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiLink, FiX, FiCheckCircle, FiCopy, FiLoader, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { api } from '../../lib/api';

export const TeamsTab = ({ user, workspaceRole, showToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [inviteData, setInviteData] = useState({
    projectId: '',
    role: 'TEAM_MEMBER'
  });
  const [generatedToken, setGeneratedToken] = useState('');

  const workspaceId = localStorage.getItem('activeWorkspaceId');

  useEffect(() => {
    if (showModal && workspaceId) {
      api.get(`/api/v1/tms/project/workspace/${workspaceId}`)
        .then(res => setProjects(res.data?.data || []))
        .catch(() => showToast('Failed to load projects.', 'error'));
    }
  }, [showModal, workspaceId]);

  const generateInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/v1/tms/invite/generate', {
        workspaceId,
        projectId: inviteData.projectId || undefined,
        role: inviteData.role
      });
      setGeneratedToken(res.data.data.token);
      showToast('Invite link generated! 🔗');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/accept-invite?token=${generatedToken}`;
    navigator.clipboard.writeText(link);
    showToast('Copied to clipboard! 📋');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access & Invites</h2>
          <p className="text-slate-500 text-sm mt-1">Generate secure links to onboard team members.</p>
        </div>
        <button
          onClick={() => { setGeneratedToken(''); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-100"
        >
          <FiLink /> Create Invite Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <h3 className="text-xl font-bold mb-4">How it works</h3>
          <ul className="space-y-4 text-sm text-blue-100 font-medium">
            <li className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg shrink-0 mt-0.5"><FiCheckCircle /></div>
              <span>Generate a secure, single-use token valid for 24 hours.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg shrink-0 mt-0.5"><FiCheckCircle /></div>
              <span>Send the link to a user pre-loaded in the global pool.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg shrink-0 mt-0.5"><FiCheckCircle /></div>
              <span>Once they login, they are instantly added to this workspace.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 italic font-serif">"</div>
             <p className="text-slate-500 text-sm leading-relaxed max-w-xs italic">
               "Security is a priority. Invite links are cryptographically signed and expire automatically to protect your workspace boundaries."
             </p>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800">Generate Link</h2>
                <button onClick={() => setShowModal(false)} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors text-slate-400">
                  <FiX />
                </button>
              </div>

              {!generatedToken ? (
                <form onSubmit={generateInvite} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Project (Optional)</label>
                    <select
                      value={inviteData.projectId}
                      onChange={e => setInviteData({...inviteData, projectId: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-blue-600 transition-all font-medium"
                    >
                      <option value="">-- No Specific Project --</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(workspaceRole === 'ADMIN' || user?.isSuperuser) && (
                        <>
                          <button
                            type="button"
                            onClick={() => setInviteData({...inviteData, role: 'ADMIN'})}
                            className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                              inviteData.role === 'ADMIN'
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                            }`}
                          >
                            WORKSPACE ADMIN
                          </button>
                          <button
                            type="button"
                            onClick={() => setInviteData({...inviteData, role: 'MANAGER'})}
                            className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                              inviteData.role === 'MANAGER'
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            MANAGER
                          </button>
                        </>
                      )}
                      {['TEAM_MEMBER'].map(r => (
                        <button
                          key={r} type="button"
                          onClick={() => setInviteData({...inviteData, role: r})}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                            inviteData.role === r
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                          }`}
                        >
                          {r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <><FiLink /> Create Secure Link</>}
                  </button>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                      <FiCheckCircle />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-800">Link Ready!</h3>
                      <p className="text-slate-500 text-sm mt-1">Copy and send this to your team member.</p>
                   </div>

                   <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 overflow-hidden">
                      <code className="text-[11px] text-blue-600 font-bold truncate">
                        {window.location.origin}/accept-invite?token={generatedToken}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="bg-white hover:bg-blue-50 p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 transition-all shadow-sm"
                      >
                        <FiCopy />
                      </button>
                   </div>

                   <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all"
                   >
                     Done
                   </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
