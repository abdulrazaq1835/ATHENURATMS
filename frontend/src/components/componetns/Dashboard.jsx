import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiUsers,
  FiFolder,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiEye,
  FiBarChart2,
  FiList
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

const Dashboard = ({
  selectedWorkplace,
  workplaces,
  projects,
  teams,
  members,
  user,
  userRole,
  currentUserRole,
  isSuperuser,
  canCreateWorkplace,
  canInviteMembers,
  canCreateProject,
  canCreateTeam,
  formatDate,
  daysLeft,
  setSelectedWorkplace,
  setShowCreateWorkplaceModal,
  setShowCreateProjectModal,
  setShowCreateTeamModal,
  setShowInviteModal,
  handleDeleteProject,
  handleUpdateProjectDeadline,
  ...props
}) => {
  const [showWorkplaceDropdown, setShowWorkplaceDropdown] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTeams: 0,
    totalMembers: 0,
    pendingTasks: 0,
    upcomingDeadlines: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  // Check if user has admin/manager permissions (using correct spelling)
  const hasManagementAccess = currentUserRole === "MANAGER" || currentUserRole === "ADMIN" || isSuperuser;

  // Check if user can create workplace (admin/manager or has explicit permission)
  const canCreateWorkplaceAccess = hasManagementAccess || canCreateWorkplace;

  // Check if user can create/edit/delete (management actions)
  const canManage = hasManagementAccess;

  // Check if user can view but not modify (member view)
  const isMemberOnly = !hasManagementAccess && !isSuperuser;

  // UPDATED: Check if user can invite members - ONLY hide for MANAGER role
  // Show for ADMIN, SUPERUSER, or if explicitly allowed, but NOT for MANAGER
  const canInviteMembersAccess = (currentUserRole === "ADMIN" || isSuperuser || canInviteMembers) && currentUserRole !== "MANAGER";

  // Calculate statistics
  useEffect(() => {
    if (projects && projects.length > 0) {
      const total = projects.length;
      const active = projects.filter(p => new Date(p.deadline) > new Date()).length;
      const completed = projects.filter(p => p.status === 'completed' || new Date(p.deadline) < new Date()).length;

      setStats(prev => ({
        ...prev,
        totalProjects: total,
        activeProjects: active,
        completedProjects: completed,
        totalTeams: teams?.length || 0,
        totalMembers: members?.length || 0
      }));

      // Get recent projects (last 5)
      const recent = [...projects]
        .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))
        .slice(0, 5);
      setRecentProjects(recent);

      // Get upcoming deadlines (next 7 days)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = projects
        .filter(p => {
          const deadline = new Date(p.deadline);
          return deadline > today && deadline <= nextWeek;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setUpcomingDeadlines(upcoming);
    }
  }, [projects, teams, members]);

  // Get current workplace name
  const currentWorkplace = workplaces?.find(w => w._id === selectedWorkplace);
  const workplaceName = currentWorkplace?.name || 'Select a Workplace';
  const workplaceCount = workplaces?.length || 0;

  // Handle workplace switch
  const handleWorkplaceSwitch = (workplaceId) => {
    setSelectedWorkplace(workplaceId);
    setShowWorkplaceDropdown(false);
  };

  // Stat cards data
  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FiFolder,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/projects',
      viewOnly: true
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/projects?status=active',
      viewOnly: true
    },
    {
      title: 'Teams',
      value: stats.totalTeams,
      icon: FiUsers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/teams',
      viewOnly: true
    },
    {
      title: 'Team Members',
      value: stats.totalMembers,
      icon: FiUsers,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/members',
      viewOnly: true
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      icon: FiCheckCircle,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      link: '/projects?status=completed',
      viewOnly: true
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.length,
      icon: FiCalendar,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      link: '/deadlines',
      viewOnly: true
    }
  ];

  // Quick action buttons - only show for managers/admins
  const quickActions = [
    {
      label: 'Create Project',
      icon: FiPlus,
      onClick: () => setShowCreateProjectModal(true),
      visible: canManage && canCreateProject,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Invite Members',
      icon: FiUsers,
      onClick: () => setShowInviteModal(true),
      visible: canManage && canInviteMembersAccess, // UPDATED: Use the new access control
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Create Workplace',
      icon: FiPlus,
      onClick: () => setShowCreateWorkplaceModal(true),
      visible: canManage && canCreateWorkplaceAccess,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      label: 'Create Team',
      icon: FiUsers,
      onClick: () => setShowCreateTeamModal(true),
      visible: canManage && canCreateTeam,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ].filter(action => action.visible);

  // Member view actions (view-only buttons)
  const memberActions = [
    {
      label: 'View Projects',
      icon: FiFolder,
      link: '/projects',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'View Teams',
      icon: FiUsers,
      link: '/teams',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'View Tasks',
      icon: FiList,
      link: '/tasks',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'My Profile',
      icon: FiEye,
      link: '/profile',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  // Get deadline status color
  const getDeadlineStatus = (deadline) => {
    const days = daysLeft(deadline);
    if (days === null) return 'text-gray-500';
    if (days < 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDeadlineIcon = (deadline) => {
    const days = daysLeft(deadline);
    if (days === null) return FiClock;
    if (days < 0) return FiAlertCircle;
    if (days <= 3) return FiAlertCircle;
    return FiClock;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Workplace Switcher */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {(() => {
                const hour = new Date().getHours();
                let greeting = '';
                if (hour < 12) greeting = 'Good morning';
                else if (hour < 18) greeting = 'Good afternoon';
                else greeting = 'Good evening';

                return `${greeting}, ${user?.name || user?.email?.split('@')[0] || 'User'}!`;
              })()}
            </h1>
            <p className="text-gray-500">
              {isSuperuser
                ? 'You have superuser access to manage all workplaces.'
                : canManage
                ? `You are logged in as ${currentUserRole?.toUpperCase() || "MANAGER"}. You can manage projects, teams, and members.`
                : `You are logged in as a Team Member. You can view projects, teams, and your tasks.`}
            </p>
          </div>

          {/* Workplace Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowWorkplaceDropdown(!showWorkplaceDropdown)}
              className="flex items-center gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 transition-all"
            >
              <FiBriefcase className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700">{workplaceName}</span>
              {showWorkplaceDropdown ? (
                <FiChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showWorkplaceDropdown && workplaces && workplaces.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 px-3 py-1">Switch Workplace</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {workplaces.map((workplace) => (
                      <button
                        key={workplace._id}
                        onClick={() => handleWorkplaceSwitch(workplace._id)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                          selectedWorkplace === workplace._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FiBriefcase className={`w-4 h-4 ${
                              selectedWorkplace === workplace._id ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              selectedWorkplace === workplace._id ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                              {workplace.name}
                            </span>
                          </div>
                          {workplace.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {workplace.description}
                            </p>
                          )}
                        </div>
                        {selectedWorkplace === workplace._id && (
                          <FiCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                  {canManage && canCreateWorkplaceAccess && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={() => {
                          setShowWorkplaceDropdown(false);
                          setShowCreateWorkplaceModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        Create New Workplace
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Quick Actions - Different for Managers/Admins vs Members */}
      {canManage && quickActions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all ${action.color} shadow-sm hover:shadow-md`}
              >
                <action.icon size={18} />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Member View - Quick Navigation */}
      {isMemberOnly && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-3">
            {memberActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all ${action.color} shadow-sm hover:shadow-md`}
                >
                  <action.icon size={18} />
                  <span>{action.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Grid - Clickable for both roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const StatContent = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`${stat.textColor} w-5 h-5`} />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          );

          return stat.link ? (
            <Link key={index} to={stat.link}>
              {StatContent}
            </Link>
          ) : (
            <div key={index}>{StatContent}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
            {canManage && canCreateProject ? (
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + New Project
              </button>
            ) : (
              <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            )}
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{project.projectName}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Start: {formatDate(project.startDate)}</span>
                          <span>Deadline: {formatDate(project.deadline)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          new Date(project.deadline) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {new Date(project.deadline) > new Date() ? 'Active' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiFolder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No projects yet</p>
              {canManage && canCreateProject && (
                <button
                  onClick={() => setShowCreateProjectModal(true)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  Create your first project
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h2>

          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((project, index) => {
                const DeadlineIcon = getDeadlineIcon(project.deadline);
                const daysRemaining = daysLeft(project.deadline);
                return (
                  <Link key={project._id} to={`/projects/${project._id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{project.projectName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <DeadlineIcon className={`w-4 h-4 ${getDeadlineStatus(project.deadline)}`} />
                            <span className={`text-sm font-medium ${getDeadlineStatus(project.deadline)}`}>
                              {daysRemaining !== null && (
                                daysRemaining < 0
                                  ? `Overdue by ${Math.abs(daysRemaining)} days`
                                  : `${daysRemaining} days remaining`
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Deadline: {formatDate(project.deadline)}
                          </p>
                        </div>
                        {canManage && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              props.setShowEditDeadlineModal?.(project);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No upcoming deadlines</p>
              <p className="text-sm text-gray-400 mt-1">All caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Teams Overview */}
      {teams && teams.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Teams Overview</h2>
            {canManage && canCreateTeam ? (
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + New Team
              </button>
            ) : (
              <Link to="/teams" className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.slice(0, 6).map((team, index) => (
              <Link key={team._id} to={`/teams/${team._id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{team.teamName}</h3>
                    <FiUsers className="text-gray-400 w-4 h-4" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {team.members?.length || 0} members
                  </p>
                  {team.teamLeader && (
                    <p className="text-xs text-gray-400 mt-2">
                      Lead: {team.teamLeader.name || 'Not assigned'}
                    </p>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {teams.length > 6 && (
            <div className="text-center mt-4">
              <Link to="/teams" className="text-sm text-blue-600 hover:text-blue-700">
                View all {teams.length} teams →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Members */}
      {members && members.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Members</h2>

          <div className="flex flex-wrap gap-3">
            {members.slice(0, 8).map((member, index) => (
              <Link key={member._id} to={`/members/${member._id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {member.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {members.length > 8 && (
            <div className="text-center mt-4">
              <Link to="/members" className="text-sm text-blue-600 hover:text-blue-700">
                View all {members.length} members →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State for No Workplace Selected */}
      {!selectedWorkplace && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Workplace Selected</h3>
          <p className="text-gray-500 mb-4">Select a workplace from the dropdown above or create a new one to get started.</p>
          {canManage && canCreateWorkplaceAccess && (
            <button
              onClick={() => setShowCreateWorkplaceModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Workplace
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
