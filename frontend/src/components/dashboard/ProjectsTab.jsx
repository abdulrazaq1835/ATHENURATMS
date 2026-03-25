import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, formatDate, daysLeft } from '../../lib/api';
import { FiPlus, FiFolder, FiClock, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiX, FiLoader, FiEdit2 } from 'react-icons/fi';

const ProjectCard = ({ project, index, onEdit, workspaceRole, user }) => {
  const isManagerOrAdmin = user?.isSuperuser || workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER';
  const days = daysLeft(project.deadline);
  const overdue = days !== null && days < 0;
  const urgent = days !== null && days >= 0 && days <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-default"
    >
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-blue-100 blur-2xl group-hover:bg-blue-200 transition-all duration-500" />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <FiFolder className="text-blue-500" size={17} />
          </div>
          <h3 className="font-semibold text-slate-800 text-[15px] leading-tight line-clamp-1">{project.projectName}</h3>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            overdue ? 'bg-red-50 border-red-200 text-red-600' :
            urgent ? 'bg-amber-50 border-amber-200 text-amber-600' :
            'bg-emerald-50 border-emerald-200 text-emerald-600'
          }`}>
            {overdue ? 'Overdue' : urgent ? `${days}d left` : 'On Track'}
          </span>
          {isManagerOrAdmin && (
            <button onClick={() => onEdit(project)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer hover:scale-110">
              <FiEdit2 size={13} />
            </button>
          )}
        </div>
      </div>
      {project.description && <p className="text-slate-500 text-[13px] leading-relaxed mb-4 line-clamp-2">{project.description}</p>}
      <div className="flex flex-wrap gap-3 text-[12px] text-slate-500">
        {project.startDate && <span className="flex items-center gap-1.5"><FiCalendar size={12} className="text-blue-500" />{formatDate(project.startDate)}</span>}
        {project.deadline && <span className="flex items-center gap-1.5"><FiClock size={12} className={overdue ? 'text-red-500' : 'text-blue-500'} />Due {formatDate(project.deadline)}</span>}
        {project.createdBy?.name && <span className="flex items-center gap-1.5 ml-auto"><FiUser size={12} className="text-blue-500" />{project.createdBy.name}</span>}
      </div>
    </motion.div>
  );
};

const EditProjectModal = ({ project, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    projectName: project.projectName || '',
    description: project.description || '',
    startDate: project.startDate ? project.startDate.split('T')[0] : '',
    deadline: project.deadline ? project.deadline.split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectName || !form.startDate || !form.deadline) return setError('Project name, start date and deadline are required.');
    setLoading(true);
    try {
      await api.patch(`/api/v1/tms/project/update/${project._id}`, form);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-7 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-slate-800">Edit Project</h2><p className="text-slate-500 text-sm">Update project details</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"><FiX size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-slate-600 text-[13px] mb-1.5 font-medium">Project Name *</label><input name="projectName" value={form.projectName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-slate-600 text-[13px] mb-1.5 font-medium">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-slate-600 text-[13px] mb-1.5 font-medium">Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-slate-600 text-[13px] mb-1.5 font-medium">Deadline *</label><input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
          </div>
          {error && <p className="text-red-500 text-[13px] flex items-center gap-2"><FiAlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              {loading ? <FiLoader className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CreateProjectModal = ({ onClose, onCreated, showToast }) => {
  const [form, setForm] = useState({ projectName: '', description: '', startDate: '', deadline: '', teamLeadId: '', memberIds: [] });
  const [globalUsers, setGlobalUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/v1/tms/user/all')
      .then(res => setGlobalUsers(res.data?.data || []))
      .catch(() => showToast('Failed to load global user list.', 'error'));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleMember = (id) => {
    setForm(p => ({
      ...p,
      memberIds: p.memberIds.includes(id)
        ? p.memberIds.filter(mId => mId !== id)
        : [...p.memberIds, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectName || !form.startDate || !form.deadline) return setError('Project name, start date and deadline are required.');
    setLoading(true);
    const workspaceId = localStorage.getItem('activeWorkspaceId');
    try {
      await api.post('/api/v1/tms/project/add/project', { ...form, workspaceId });
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = globalUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-7 shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-slate-800">New Project</h2><p className="text-slate-500 text-sm">Assign team and set timeline</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"><FiX size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><label className="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5 ml-1">Project Name *</label><input name="projectName" value={form.projectName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-blue-500 outline-none transition-all" /></div>
              <div><label className="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5 ml-1">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-blue-500 outline-none resize-none transition-all" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5 ml-1">Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-slate-600 text-[11px] font-black uppercase tracking-wider mb-1.5 ml-1">Deadline *</label><input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm focus:border-blue-500 outline-none" /></div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col h-full overflow-hidden">
               <label className="block text-slate-600 text-[11px] font-black uppercase tracking-wider ml-1">Assign Team (Global Pool)</label>
               <div className="relative mb-2">
                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                 <input
                    type="text" placeholder="Search interns..."
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs outline-none"
                 />
               </div>

               <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50 p-2 space-y-2 max-h-[300px] custom-scrollbar">
                  {filteredUsers.map(u => (
                    <div key={u._id} className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 group">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black uppercase">{u.name.substring(0,2)}</div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium truncate">{u.domain || 'Intern'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setForm({...form, teamLeadId: u._id})}
                            className={`p-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                              form.teamLeadId === u._id
                                ? 'bg-amber-100 text-amber-600 border border-amber-200'
                                : 'bg-slate-50 text-slate-400 hover:text-amber-500 border border-transparent'
                            }`}
                          >
                            Lead
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleMember(u._id)}
                            className={`p-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                              form.memberIds.includes(u._id)
                                ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                : 'bg-slate-50 text-slate-400 hover:text-blue-500 border border-transparent'
                            }`}
                          >
                            Member
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-[13px] flex items-center gap-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100"><FiAlertCircle size={14} />{error}</p>}

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200">
              {loading ? <FiLoader className="animate-spin" /> : 'Launch Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
    <div><p className="text-2xl font-bold text-slate-800">{value}</p><p className="text-slate-500 text-xs">{label}</p></div>
  </motion.div>
);

export const ProjectsTab = ({ user, workspaceRole, showToast }) => {
  const isManagerOrAdmin = user?.isSuperuser || workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER';
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    const wsId = localStorage.getItem('activeWorkspaceId');
    if (!wsId) return;
    try {
      const res = await api.get(`/api/v1/tms/project/workspace/${wsId}`);
      setProjects(res.data?.data || []);
    } catch {
      showToast('Could not load projects scoped to this workspace.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const total = projects.length;
  const overdue = projects.filter((p) => daysLeft(p.deadline) < 0).length;
  const onTrack = total - overdue;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Projects" value={total} icon={FiFolder} color="bg-blue-50 text-blue-600" />
        <StatCard label="On Track" value={onTrack} icon={FiCheckCircle} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Overdue" value={overdue} icon={FiAlertCircle} color="bg-red-50 text-red-600" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-slate-800">Projects</h2><p className="text-slate-500 text-[13px]">{fetching ? 'Loading…' : `${total} projects`}</p></div>
        {isManagerOrAdmin && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"><FiPlus size={16} />New Project</button>
        )}
      </div>

      {fetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-white border border-slate-200 rounded-2xl h-40 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-slate-200 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5"><FiFolder size={28} className="text-blue-500" /></div>
          <h3 className="text-slate-800 text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-6">Create your first project and start managing work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} onEdit={setEditingProject} workspaceRole={workspaceRole} user={user} />)}
        </div>
      )}

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreated={() => { showToast('Project created! 🎉'); fetchProjects(); }} showToast={showToast} />}
      {editingProject && <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onUpdated={() => { showToast('Project updated! ✨'); fetchProjects(); }} />}
    </div>
  );
};
