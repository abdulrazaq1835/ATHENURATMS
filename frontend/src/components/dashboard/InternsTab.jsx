import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiX, FiCheckCircle, FiAlertCircle, FiLoader, FiPlus, FiLink, FiMail } from 'react-icons/fi';
import { api, formatDate } from '../../lib/api';

export const InternsTab = ({ showToast }) => {
  const [members, setMembers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const workspaceId = localStorage.getItem('activeWorkspaceId');

  const fetchMembers = async () => {
    if (!workspaceId) return;
    try {
      const res = await api.get(`/api/v1/tms/workspace/${workspaceId}`);
      setMembers(res.data?.data?.members || []);
    } catch {
      showToast('Could not load workspace members.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Workspace Members</h2>
          <p className="text-slate-500 text-[13px]">
            {fetching ? 'Loading...' : `${members.length} people in this workspace`}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {fetching ? (
          <div className="p-8 text-center text-slate-500">
            <FiLoader className="animate-spin mx-auto mb-2" />
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-800 font-semibold">No members yet</p>
            <p className="text-slate-500 text-sm mt-1">Invite people to this workspace to collaborate.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
                <tr>
                  <th className="px-5 py-4 font-medium text-slate-600">Name</th>
                  <th className="px-5 py-4 font-medium text-slate-600">Email</th>
                  <th className="px-5 py-4 font-medium text-slate-600">Role</th>
                  <th className="px-5 py-4 font-medium text-slate-600">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(member => (
                  <tr key={member.user?._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {member.user?.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {member.user?.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${
                        member.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                        member.role === 'MANAGER' ? 'bg-blue-50 text-blue-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(member.joinedAt || new Date())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
