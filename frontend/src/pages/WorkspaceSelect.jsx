import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaPlus, FaArrowRight, FaSpinner, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WorkspaceSelect = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get('/api/v1/tms/workspace/all');
      setWorkspaces(data.data || []);
    } catch (error) {
      setErrorMsg('Failed to load workspaces. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsCreating(true);
    try {
      await api.post('/api/v1/tms/workspace/create', { name: newWorkspaceName });
      setShowCreateModal(false);
      setNewWorkspaceName('');
      fetchWorkspaces(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating workspace');
    } finally {
      setIsCreating(false);
    }
  };

  const selectWorkspace = (workspaceId) => {
    localStorage.setItem('activeWorkspaceId', workspaceId);
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <motion.div 
        initial="hidden" animate="visible" variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Select Workspace</h1>
            <p className="text-gray-500 mt-2 text-lg">Choose an organization to continue</p>
          </motion.div>
          
          {user?.isSuperuser && (
            <div className="flex gap-4 mt-6 md:mt-0">
               <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/global-pool')}
                className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
              >
                <FaUsers /> Manage Users
              </motion.button>

              <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-200"
              >
                <FaPlus /> New Workspace
              </motion.button>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {workspaces.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              <FaBuilding />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Workspaces Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
               You are not part of any workspace yet. Contact your administrator if you believe this is an error.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <motion.div 
                key={workspace._id}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => selectWorkspace(workspace._id)}
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    <FaBuilding />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{workspace.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {workspace.description || 'Welcome to the workspace command center.'}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="text-xs font-semibold text-gray-400">
                    {workspace.members.length} Member{workspace.members.length !== 1 ? 's' : ''}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative"
            >
              <h2 className="text-2xl font-black mb-2 text-gray-900">Create Workspace</h2>
              <p className="text-gray-500 mb-6 text-sm">Set up a new isolated organization environment.</p>
              
              <form onSubmit={handleCreateWorkspace}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Workspace Name</label>
                  <input 
                    type="text" 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    required
                    placeholder="e.g. Acme Corporation"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isCreating}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-lg shadow-blue-200"
                  >
                    {isCreating ? 'Creating...' : 'Create Workspace'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceSelect;
