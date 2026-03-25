import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const AnalyticsTab = ({ projects, members, teams, daysLeft }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Overview</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Projects</span>
                <span className="font-medium">{projects?.length || 0}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Projects</span>
                <span className="font-medium">{projects?.filter(p => daysLeft(p.deadline) > 0).length || 0}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${((projects?.filter(p => daysLeft(p.deadline) > 0).length || 0) / (projects?.length || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Overview</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Teams</span>
                <span className="font-medium">{teams?.length || 0}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Members</span>
                <span className="font-medium">{members?.length || 0}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
