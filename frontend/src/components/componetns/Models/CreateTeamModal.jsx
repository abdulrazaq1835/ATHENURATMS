import React, { useState, useEffect } from 'react';
import { AiFillCrown } from 'react-icons/ai';
import { FiX, FiUsers, FiUserPlus, FiUserMinus, FiBriefcase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CreateTeamModal = ({
  show,
  onClose,
  onSubmit,
  projects,
  availableUsers,
  workspaceId,
  isEdit = false,
  editData = null
}) => {
  const [teamName, setTeamName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [teamLeaderId, setTeamLeaderId] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [errors, setErrors] = useState({});

  const getFilteredUsers = () => {
    if (!availableUsers) return [];
    return availableUsers.filter(user => {
      const role = user.role?.toUpperCase();
      const isSuperUser = user.isSuperUser === true;
      return role !== 'ADMIN' && role !== 'MANAGER' && !isSuperUser;
    });
  };

  useEffect(() => {
    if (show) {
      if (isEdit && editData) {
        setTeamName(editData.teamName || '');
        setProjectId(editData.projectId || '');
        setTeamLeaderId(editData.teamLeaderId || '');
        setTeamMembers(editData.team || []);
      } else {
        resetForm();
      }
    }
  }, [show, isEdit, editData]);

  const resetForm = () => {
    setTeamName('');
    setProjectId('');
    setTeamLeaderId('');
    setTeamMembers([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!projectId) newErrors.projectId = 'Project is required';
    if (!teamLeaderId) newErrors.teamLeaderId = 'Team leader is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedProject = projects?.find(p => p._id === projectId);
    const teamData = {
      teamName: teamName.trim(),
      projectId,
      projectName: selectedProject?.projectName || '',
      teamLeaderId,
      team: teamMembers,
      workSpaceId: workspaceId
    };

    onSubmit(teamData);
    if (!isEdit) resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const filteredUsers = getFilteredUsers();
  const getAvailableMembers = () => {
    return filteredUsers?.filter(user => user._id !== teamLeaderId) || [];
  };

  const getSelectedMemberDetails = () => {
    return teamMembers
      .map(memberId => {
        const user = filteredUsers?.find(u => u._id === memberId);
        return user ? { _id: user._id, name: user.name, email: user.email } : null;
      })
      .filter(Boolean);
  };

  const handleAddMember = (userId) => {
    if (!teamMembers.includes(userId)) {
      setTeamMembers([...teamMembers, userId]);
    }
  };

  const handleRemoveMember = (userId) => {
    setTeamMembers(teamMembers.filter(id => id !== userId));
  };

  const handleTeamLeaderChange = (userId) => {
    setTeamLeaderId(userId);
    if (teamMembers.includes(userId)) {
      setTeamMembers(teamMembers.filter(id => id !== userId));
    }
  };

  const selectedProject = projects?.find(p => p._id === projectId);
  const selectedLeader = filteredUsers?.find(u => u._id === teamLeaderId);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl sticky top-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEdit ? 'Edit Team' : 'Create New Team'}
                </h3>
                <p className="text-purple-100 text-sm">
                  {isEdit ? 'Update team details and members' : 'Assemble your perfect team'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Team Name Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                  errors.teamName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="e.g., Frontend Avengers"
              />
              {errors.teamName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.teamName}
                </p>
              )}
            </div>

            {/* Project Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiBriefcase className="inline mr-1" size={14} /> Project <span className="text-red-500">*</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                  errors.projectId ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select Project</option>
                {projects && projects.length > 0 ? (
                  projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.projectName || project.name || 'Unnamed Project'}
                    </option>
                  ))
                ) : (
                  <option disabled>No projects available</option>
                )}
              </select>
              {errors.projectId && (
                <p className="text-xs text-red-500 mt-1">{errors.projectId}</p>
              )}
            </div>

            {/* Team Leader Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <AiFillCrown className="inline mr-1 text-yellow-500" size={14} /> Team Leader <span className="text-red-500">*</span>
              </label>
              <select
                value={teamLeaderId}
                onChange={(e) => handleTeamLeaderChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                  errors.teamLeaderId ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select Team Leader</option>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} {user.email ? `(${user.email})` : ''}
                    </option>
                  ))
                ) : (
                  <option disabled>No users available</option>
                )}
              </select>
              {errors.teamLeaderId && (
                <p className="text-xs text-red-500 mt-1">{errors.teamLeaderId}</p>
              )}
            </div>

            {/* Team Members Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiUsers className="inline mr-1" size={14} /> Team Members
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Available Users */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                    Available Users ({getAvailableMembers().length})
                  </div>
                  <select
                    multiple
                    size="5"
                    className="w-full p-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-50"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue && !teamMembers.includes(selectedValue)) {
                        handleAddMember(selectedValue);
                      }
                    }}
                    value={[]}
                  >
                    {getAvailableMembers().map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} {user.email ? `(${user.email})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to select, then use "Add" button
                  </p>
                </div>

                {/* Selected Members */}
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 bg-purple-100 px-3 py-1.5 rounded-lg inline-block">
                    Selected Members ({teamMembers.length})
                  </div>
                  <div className="border-2 border-gray-200 rounded-xl h-32 overflow-y-auto bg-gray-50">
                    {teamMembers.length === 0 ? (
                      <div className="p-3 text-sm text-gray-400 text-center">
                        No members selected
                      </div>
                    ) : (
                      getSelectedMemberDetails().map(member => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-2 hover:bg-purple-50 border-b border-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove member"
                          >
                            <FiUserMinus size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const select = document.querySelector('select[multiple]');
                        const selectedOption = select?.options[select.selectedIndex];
                        if (selectedOption && selectedOption.value) {
                          handleAddMember(selectedOption.value);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      <FiUserPlus size={14} />
                      Add Selected
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamMembers([])}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-purple-600" size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Team Summary</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Workspace ID:</span>
                      <code className="font-mono text-purple-700">{workspaceId || 'Not provided'}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project:</span>
                      <span className="font-medium text-gray-800">{selectedProject?.projectName || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Leader:</span>
                      <span className="font-medium text-purple-700">{selectedLeader?.name || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium text-gray-800">{teamMembers.length + 1} members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {isEdit ? 'Update Team' : 'Create Team'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
