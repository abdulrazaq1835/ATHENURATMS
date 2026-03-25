import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader, FiLogOut } from 'react-icons/fi';
import {
  addNewMemberInTeam,
  addWorkspaceManager,
  bulkUploadUsers,
  createProject,
  createTeam,
  createWorkspace,
  deleteProject,
  deleteTeam,
  generateInviteToken,
  getAllUsers,
  getProjects,
  getTeams,
  getWorkspaceById,
  getWorkspaces,
  removeTeamLeaderAndAddToTeam,
  removeTeamMember,
  setNewTeamLeader,
  updateProject,
  updateProjectDeadline,
  updateTeam,
  updateUserRole,
  removeWorkspaceMember,
  inviteUserToWorkspace
} from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils/index';
import { Athenura_Nav_Image } from '../../assets';

// Lazy load components
const AnalyticsTab = lazy(() => import('./AnalyticsTab'));
const Dashboard = lazy(() => import('./Dashboard'));
const GlobalPoolTab = lazy(() => import('./GlobalPoolTab'));
const InvitesTab = lazy(() => import('./InvitesTab'));
const MembersTab = lazy(() => import('./MembersTab'));
const BulkUploadModal = lazy(() => import('./Models/BulkUploadModal'));
const CreateProjectModal = lazy(() => import('./Models/CreateProjectModal'));
const CreateTeamModal = lazy(() => import('./Models/CreateTeamModal'));
const CreateWorkplaceModal = lazy(() => import('./Models/CreateWorkplaceModal'));
const InviteLinkModal = lazy(() => import('./Models/InviteLinkModal'));
const InviteMemberModal = lazy(() => import('./Models/InviteMemberModal'));
const ProjectsTab = lazy(() => import('./ProjectsTab'));
const Sidebar = lazy(() => import('./Sidebar'));
const TeamsTab = lazy(() => import('./TeamsTab'));
const Profile = lazy(() => import('./Profile'));
const TaskComponent = lazy(() => import('./TaskComponent'));

// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mx-auto mb-3" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Modal loading fallback
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-3">
        <FiLoader className="animate-spin text-indigo-600 w-6 h-6" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <FiAlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Please refresh the page or try again later</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const WorkPlaceHome = () => {
  const { user, role, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { workspaceId: urlWorkspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // User Info
  const [currentUserRole, setCurrentUserRole] = useState('MEMBER');
  const [isSuperuser, setIsSuperuser] = useState(false);

  // Workplace States
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [workplaces, setWorkplaces] = useState([]);
  const [currentWorkplaceDetails, setCurrentWorkplaceDetails] = useState(null);

  // Loading States
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingWorkplaceDetails, setLoadingWorkplaceDetails] = useState(false);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [addingManager, setAddingManager] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Data States
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [interns, setInterns] = useState([]);
  const [loadingInterns, setLoadingInterns] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingGlobalUsers, setLoadingGlobalUsers] = useState(false);

  // Form States
  const [newWorkplace, setNewWorkplace] = useState({ name: '', description: '' });
  const [newGlobalUser, setNewGlobalUser] = useState({ name: '', email: '', phone: '' });
  const [inviteData, setInviteData] = useState({ email: '', role: 'MEMBER' });
  const [inviteLinkData, setInviteLinkData] = useState({ email: '', role: 'MEMBER' });

  // Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateWorkplaceModal, setShowCreateWorkplaceModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(null);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(null);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Additional States
  const [generatedToken, setGeneratedToken] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [addingGlobalUser, setAddingGlobalUser] = useState(false);

  // Task related states
  const [selectedProjectForTasks, setSelectedProjectForTasks] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Helper Functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get active tab from URL path
  const getActiveTabFromPath = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/teams')) return 'teams';
    if (path.includes('/members')) return 'members';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/global-pool')) return 'global-pool';
    if (path.includes('/invites')) return 'invites';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  }, [location.pathname]);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = getActiveTabFromPath();
    setActiveTab(tabFromUrl);
  }, [getActiveTabFromPath]);

  // Handle tab change with navigation
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedProjectForTasks(null);
    const basePath = `/workspace/${selectedWorkplace}`;
    switch(tabId) {
      case 'dashboard':
        navigate(basePath);
        break;
      case 'projects':
        navigate(`${basePath}/projects`);
        break;
      case 'teams':
        navigate(`${basePath}/teams`);
        break;
      case 'members':
        navigate(`${basePath}/members`);
        break;
      case 'tasks':
        navigate(`${basePath}/tasks`);
        break;
      case 'analytics':
        navigate(`${basePath}/analytics`);
        break;
      case 'global-pool':
        navigate(`${basePath}/global-pool`);
        break;
      case 'invites':
        navigate(`${basePath}/invites`);
        break;
      case 'profile':
        navigate(`${basePath}/profile`);
        break;
      default:
        navigate(basePath);
    }
  }, [selectedWorkplace, navigate]);

  // Handle workspace change with navigation
  const handleWorkspaceChange = useCallback((workspaceId) => {
    setSelectedWorkplace(workspaceId);
    setSelectedProjectForTasks(null);
    const currentPath = location.pathname;
    const pathWithoutWorkspace = currentPath.replace(/\/workspace\/[^/]+/, '');
    navigate(`/workspace/${workspaceId}${pathWithoutWorkspace || ''}`);
  }, [navigate, location.pathname]);

  // Get user's role in current workspace
  const getUserWorkspaceRole = useCallback(() => {
    if (!user || !members.length) return 'MEMBER';
    const currentMember = members.find(m => m.userId === user._id || m._id === user._id);
    return currentMember?.role?.toUpperCase() || 'MEMBER';
  }, [user, members]);

  // Role-based permission checks
  const isAdmin = useCallback(() => {
    return isSuperuser || currentUserRole === 'ADMIN';
  }, [isSuperuser, currentUserRole]);

  const isManager = useCallback(() => {
    return isSuperuser || currentUserRole === 'MANAGER' || currentUserRole === 'ADMIN';
  }, [isSuperuser, currentUserRole]);

  const isTeamLeader = useCallback(() => {
    return isSuperuser || currentUserRole === 'TEAM_LEADER' || isManager();
  }, [isSuperuser, currentUserRole, isManager]);

  const canCreateWorkplace = useCallback(() => {
    return isSuperuser;
  }, [isSuperuser]);

  const canCreateProject = useCallback(() => {
    return true;
  }, []);

  const canCreateTeam = useCallback(() => {
    return true;
  }, []);

  const canInviteMembers = useCallback(() => {
    return isAdmin() || isManager() || isSuperuser;
  }, [isAdmin, isManager, isSuperuser]);

  const canViewAllProjects = useCallback(() => {
    return true;
  }, []);

  const canViewAllTeams = useCallback(() => {
    return true;
  }, []);

  const canEditProject = useCallback(() => {
    return true;
  }, []);

  const canDeleteProject = useCallback(() => {
    return true;
  }, []);

  const canManageMembers = useCallback(() => {
    return isAdmin() || isSuperuser;
  }, [isAdmin, isSuperuser]);

  const canManageTeams = useCallback(() => {
    return true;
  }, []);

  const isMemberOnly = useCallback(() => {
    return currentUserRole === 'MEMBER' && !isSuperuser;
  }, [currentUserRole, isSuperuser]);

  // Format members from API
  const formatMembersData = useCallback((membersData) => {
    if (!membersData || !Array.isArray(membersData)) return [];
    return membersData.map(member => ({
      _id: member.user?._id || member._id,
      userId: member.user?._id || member._id,
      name: member.user?.name || member.name,
      email: member.user?.email || member.email,
      role: member.role?.toUpperCase() || 'MEMBER',
      joinedAt: member.joinedAt || member.createdAt || new Date().toISOString(),
    }));
  }, []);

  // Load Workspaces
  const loadWorkspaces = useCallback(() => {
    requestHandler(
      getWorkspaces,
      setLoadingWorkspaces,
      (response) => {
        const workspaceData = response?.data || response || [];
        setWorkplaces(workspaceData);

        if (workspaceData.length > 0) {
          if (urlWorkspaceId) {
            const workspace = workspaceData.find(w => w._id === urlWorkspaceId);
            if (workspace) {
              setSelectedWorkplace(urlWorkspaceId);
            } else {
              setSelectedWorkplace(workspaceData[0]._id);
              navigate(`/workspace/${workspaceData[0]._id}`, { replace: true });
            }
          } else {
            setSelectedWorkplace(workspaceData[0]._id);
            navigate(`/workspace/${workspaceData[0]._id}`, { replace: true });
          }
        }
      },
      (error) => {
        console.error("Failed to load workspaces:", error);
        showToast('Failed to load workspaces', 'error');
      }
    );
  }, [urlWorkspaceId, navigate]);

  // Load Workspace Details
  const loadWorkspaceDetails = useCallback((workspaceId) => {
    if (!workspaceId) return;

    requestHandler(
      () => getWorkspaceById({ workspaceId }),
      setLoadingWorkplaceDetails,
      (response) => {
        const data = response?.data || response;
        setCurrentWorkplaceDetails(data);

        const formattedMembers = formatMembersData(data?.members);
        setMembers(formattedMembers);

        const allUsers = formattedMembers.map(m => ({
          _id: m.userId || m._id,
          name: m.name,
          email: m.email,
          role: m.role
        }));
        setAvailableUsers(allUsers);

        if (data?.projects) {
          setProjects(data.projects);
        }
      },
      (error) => {
        console.error("Failed to load workspace details:", error);
        const foundWorkplace = workplaces?.find(w => w._id === workspaceId);
        setCurrentWorkplaceDetails(foundWorkplace);
      }
    );
  }, [workplaces, formatMembersData]);

  // Load Projects
  const loadProjects = useCallback(() => {
    if (!selectedWorkplace) return;

    requestHandler(
      () => getProjects({ workspaceId: selectedWorkplace }),
      setLoadingProjects,
      (response) => {
        const data = response?.data || response;
        setProjects(data || []);
      },
      (error) => {
        console.error("Failed to load projects:", error);
        setProjects([]);
      }
    );
  }, [selectedWorkplace]);

  // Load Teams
  const loadTeams = useCallback(() => {
    if (!selectedWorkplace) return;

    requestHandler(
      () => getTeams({ workspaceId: selectedWorkplace }),
      setLoadingTeams,
      (response) => {
        const data = response?.data || response;
        setTeams(data || []);
      },
      (error) => {
        console.error("Failed to load teams:", error);
        setTeams([]);
      }
    );
  }, [selectedWorkplace]);

  // Load Interns
  const loadInterns = useCallback(() => {
    requestHandler(
      getAllUsers,
      setLoadingInterns,
      (response) => {
        const data = response?.data || response;
        setInterns(data || []);
      },
      (error) => {
        console.error("Failed to load interns:", error);
        setInterns([]);
      }
    );
  }, []);

  // Load Global Users
  const loadGlobalUsers = useCallback(() => {
    requestHandler(
      getAllUsers,
      setLoadingGlobalUsers,
      (response) => {
        const data = response?.data || response;
        setGlobalUsers(data || []);
      },
      (error) => {
        console.error("Failed to load global users:", error);
        setGlobalUsers([]);
      }
    );
  }, []);

  // Update user role
  useEffect(() => {
    if (user && members.length > 0) {
      const role = getUserWorkspaceRole();
      setCurrentUserRole(role);
    }
  }, [user, members, getUserWorkspaceRole]);

  // Set superuser status
  useEffect(() => {
    if (user) {
      const isSuper = user.is_superuser || user.isSuperuser || role === 'Superuser' || user.userType === 'superuser';
      setIsSuperuser(isSuper);
    }
  }, [user, role]);

  // Load workspaces on auth
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadWorkspaces();
    }
  }, [isAuthenticated, authLoading, loadWorkspaces]);

  // Load workspace details when selected workspace changes
  useEffect(() => {
    if (selectedWorkplace && isAuthenticated) {
      loadWorkspaceDetails(selectedWorkplace);
      loadProjects();
      loadTeams();
      loadInterns();
    }
  }, [selectedWorkplace, isAuthenticated, loadWorkspaceDetails, loadProjects, loadTeams, loadInterns]);

  // Load global users for superuser
  useEffect(() => {
    if (isSuperuser && activeTab === 'global-pool' && isAuthenticated) {
      loadGlobalUsers();
    }
  }, [isSuperuser, activeTab, isAuthenticated, loadGlobalUsers]);

  // Member Utility Functions
  const getMembersByRole = useCallback((roleType) => {
    return members.filter(member => member.role === roleType);
  }, [members]);

  const getTeamMembers = useCallback((teamId) => {
    const team = teams.find(t => t._id === teamId);
    if (!team) return [];
    return members.filter(member => team.members?.includes(member.userId || member._id));
  }, [teams, members]);

  const getAvailableMembersForTeam = useCallback((teamId) => {
    const team = teams.find(t => t._id === teamId);
    if (!team) return members;
    const currentMemberIds = team.members || [];
    return members.filter(member => !currentMemberIds.includes(member.userId || member._id));
  }, [teams, members]);

  // Task handlers
  const handleViewProjectTasks = useCallback((project) => {
    setSelectedProjectForTasks(project);
  }, []);

  const handleCloseTasks = useCallback(() => {
    setSelectedProjectForTasks(null);
  }, []);

  // NEW: Workspace Member Management Handlers
  const handleInviteToWorkspace = useCallback(async (userId) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to invite users', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId,
        role: 'MEMBER'
      };

      await requestHandler(
        () => inviteUserToWorkspace(payload),
        setAddingManager,
        () => {
          showToast('User invited to workspace successfully!', 'success');
          loadWorkspaceDetails(selectedWorkplace);
          loadGlobalUsers(); // Refresh global users list
        },
        (error) => {
          console.error('Failed to invite user:', error);
          showToast(error?.message || 'Failed to invite user to workspace', 'error');
        }
      );
    } catch (error) {
      console.error('Failed to invite user:', error);
      showToast('Failed to invite user to workspace', 'error');
    }
  }, [selectedWorkplace, canInviteMembers, loadWorkspaceDetails, loadGlobalUsers]);

  const handleAssignRole = useCallback(async (userId, newRole) => {
    if (!canManageMembers()) {
      showToast('You do not have permission to assign roles', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId,
        role: newRole
      };

      await requestHandler(
        () => updateUserRole(payload),
        setUpdatingRole,
        () => {
          showToast(`User role updated to ${newRole} successfully!`, 'success');
          loadWorkspaceDetails(selectedWorkplace);
        },
        (error) => {
          console.error('Failed to assign role:', error);
          showToast(error?.message || 'Failed to assign user role', 'error');
        }
      );
    } catch (error) {
      console.error('Failed to assign role:', error);
      showToast('Failed to assign user role', 'error');
    }
  }, [selectedWorkplace, canManageMembers, loadWorkspaceDetails]);

  const handleRemoveFromWorkspace = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from the workspace?')) {
      return;
    }

    if (!canManageMembers()) {
      showToast('You do not have permission to remove users', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId
      };

      await requestHandler(
        () => removeWorkspaceMember(payload),
        setUpdatingRole,
        () => {
          showToast('User removed from workspace successfully!', 'success');
          loadWorkspaceDetails(selectedWorkplace);
        },
        (error) => {
          console.error('Failed to remove user:', error);
          showToast(error?.message || 'Failed to remove user from workspace', 'error');
        }
      );
    } catch (error) {
      console.error('Failed to remove user:', error);
      showToast('Failed to remove user from workspace', 'error');
    }
  }, [selectedWorkplace, canManageMembers, loadWorkspaceDetails]);

  // CRUD Operations (keeping existing ones)
  const handleCreateProject = useCallback((projectData) => {
    if (!projectData.projectName || !projectData.startDate || !projectData.deadline) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      workspaceId: selectedWorkplace,
      projectName: projectData.projectName,
      description: projectData.description,
      startDate: projectData.startDate,
      deadline: projectData.deadline,
      teamLeadId: projectData.teamLeadId,
      memberIds: projectData.memberIds || []
    };

    requestHandler(
      () => createProject(payload),
      setLoadingProjects,
      (response) => {
        const newProject = response?.data || response;
        setProjects(prev => [...prev, newProject]);
        setShowCreateProjectModal(false);
        showToast('Project created successfully! 🎉', 'success');
      },
      (error) => {
        console.error("Failed to create project:", error);
        showToast(error?.message || 'Failed to create project', 'error');
      }
    );
  }, [selectedWorkplace]);

  const handleUpdateProject = useCallback((projectId, formData) => {
    requestHandler(
      () => updateProject({ projectId, ...formData }),
      setLoadingProjects,
      () => {
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, ...formData } : p));
        setShowEditProjectModal(null);
        showToast('Project updated successfully! ✨', 'success');
      },
      (error) => {
        console.error("Failed to update project:", error);
        showToast('Failed to update project', 'error');
      }
    );
  }, []);

  const handleUpdateProjectDeadline = useCallback((projectId, deadline) => {
    requestHandler(
      () => updateProjectDeadline({ projectId, deadline }),
      setLoadingProjects,
      () => {
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, deadline } : p));
        setShowEditDeadlineModal(null);
        showToast('Project deadline updated successfully! 📅', 'success');
      },
      (error) => {
        console.error("Failed to update project deadline:", error);
        showToast('Failed to update deadline', 'error');
      }
    );
  }, []);

  const handleDeleteProject = useCallback((projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      requestHandler(
        () => deleteProject({ projectId }),
        setLoadingProjects,
        () => {
          setProjects(prev => prev.filter(p => p._id !== projectId));
          showToast('Project deleted successfully! 🗑️', 'success');
        },
        (error) => {
          console.error("Failed to delete project:", error);
          showToast('Failed to delete project', 'error');
        }
      );
    }
  }, []);

  const handleCreateTeam = useCallback((teamData) => {
    const payload = {
      workSpaceId: selectedWorkplace,
      projectId: teamData.projectId,
      teamName: teamData.teamName,
      team: teamData.team,
      teamLeaderId: teamData.teamLeaderId
    };

    requestHandler(
      () => createTeam(payload),
      setLoadingTeams,
      (response) => {
        const newTeam = response?.data || response;
        setTeams(prev => [...prev, newTeam]);
        setShowCreateTeamModal(false);
        showToast('Team created successfully! 👥', 'success');
      },
      (error) => {
        console.error("Failed to create team:", error);
        showToast('Failed to create team', 'error');
      }
    );
  }, [selectedWorkplace]);

  const handleUpdateTeam = useCallback((teamData) => {
    const payload = {
      teamId: showEditTeamModal?._id,
      teamName: teamData.teamName,
      projectId: teamData.projectId,
      team: teamData.team,
      teamLeaderId: teamData.teamLeaderId,
      workSpaceId: selectedWorkplace
    };

    requestHandler(
      () => updateTeam(payload),
      setLoadingTeams,
      (response) => {
        const updatedTeam = response?.data || response;
        setTeams(prev => prev.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        setShowEditTeamModal(null);
        showToast('Team updated successfully! ✨', 'success');
      },
      (error) => {
        console.error("Failed to update team:", error);
        showToast('Failed to update team', 'error');
      }
    );
  }, [showEditTeamModal, selectedWorkplace]);

  const handleAddMemberToTeam = useCallback((teamId, memberId) => {
    requestHandler(
      () => addNewMemberInTeam({ teamId, memberId }),
      setLoadingTeams,
      () => {
        showToast('Member added to team successfully! 👤', 'success');
        loadTeams();
      },
      (error) => {
        console.error("Failed to add member:", error);
        showToast('Failed to add member', 'error');
      }
    );
  }, [loadTeams]);

  const handleRemoveTeamMember = useCallback((teamId, memberId) => {
    if (window.confirm('Remove this member from the team?')) {
      requestHandler(
        () => removeTeamMember({ teamId, memberId }),
        setLoadingTeams,
        () => {
          showToast('Member removed from team!', 'success');
          loadTeams();
        },
        (error) => {
          console.error("Failed to remove member:", error);
          showToast('Failed to remove member', 'error');
        }
      );
    }
  }, [loadTeams]);

  const handleSetTeamLeader = useCallback((teamId, memberId) => {
    requestHandler(
      () => setNewTeamLeader({ teamId, memberId }),
      setLoadingTeams,
      () => {
        showToast('Team leader updated successfully! 👑', 'success');
        loadTeams();
      },
      (error) => {
        console.error("Failed to set team leader:", error);
        showToast('Failed to set team leader', 'error');
      }
    );
  }, [loadTeams]);

  const handleRemoveTeamLeaderAndAddToTeam = useCallback((teamId, memberId) => {
    requestHandler(
      () => removeTeamLeaderAndAddToTeam({ teamId, memberId }),
      setLoadingTeams,
      () => {
        showToast('Team leader removed and added as member!', 'success');
        loadTeams();
      },
      (error) => {
        console.error("Failed to remove team leader:", error);
        showToast('Failed to remove team leader', 'error');
      }
    );
  }, [loadTeams]);

  const handleDeleteTeam = useCallback((teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      requestHandler(
        () => deleteTeam({ teamId }),
        setLoadingTeams,
        () => {
          setTeams(prev => prev.filter(t => t._id !== teamId));
          showToast('Team deleted successfully! 🗑️', 'success');
        },
        (error) => {
          console.error("Failed to delete team:", error);
          showToast('Failed to delete team', 'error');
        }
      );
    }
  }, []);

  const handleBulkUploadInterns = useCallback((file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());

      const users = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(val => val.trim());
        const user = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            user[header] = values[index];
          }
        });

        if (user.name && user.email) {
          users.push({
            name: user.name,
            email: user.email,
            phone: user.phone || user.mobile || user.contact || '',
            domain: user.domain || user.role || user.department || '',
          });
        }
      }

      if (users.length === 0) {
        showToast('No valid users found in CSV file', 'error');
        setShowBulkUploadModal(false);
        setUploading(false);
        return;
      }

      requestHandler(
        () => bulkUploadUsers({ users }),
        setUploading,
        () => {
          setShowBulkUploadModal(false);
          showToast(`${users.length} users uploaded successfully! 📊`, 'success');
          loadGlobalUsers();
        },
        (error) => {
          console.error("Failed to upload users:", error);
          showToast('Bulk upload failed! Please check file format.', 'error');
          setUploading(false);
        }
      );
    };

    reader.onerror = () => {
      showToast('Error reading file', 'error');
      setUploading(false);
    };

    reader.readAsText(file);
  }, [loadGlobalUsers]);

  const handleAddToGlobalPool = useCallback((userData) => {
    if (!isSuperuser) {
      showToast('Only superusers can add users to global pool', 'error');
      return;
    }

    requestHandler(
      () => bulkUploadUsers({ users: [userData] }),
      setAddingGlobalUser,
      () => {
        const newUser = { _id: `user-${Date.now()}`, ...userData };
        setGlobalUsers(prev => [...prev, newUser]);
        setNewGlobalUser({ name: '', email: '', phone: '' });
        showToast('User added to Global Pool! Default pass: Welcome@123', 'success');
      },
      (error) => {
        console.error("Failed to add user:", error);
        showToast('Failed to add user', 'error');
        setAddingGlobalUser(false);
      }
    );
  }, [isSuperuser]);

  const handleGenerateInviteLink = useCallback((data) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to generate invite links', 'error');
      return;
    }

    const invitePayload = {
      workspaceId: selectedWorkplace,
      role: data.role,
      ...(data.email && { email: data.email })
    };

    requestHandler(
      () => generateInviteToken(invitePayload),
      setGeneratingLink,
      (response) => {
        const token = response?.data?.token || response?.token;
        setGeneratedToken(token);
        showToast('Invite link generated successfully! 🔗', 'success');
      },
      (error) => {
        console.error("Failed to generate invite link:", error);
        showToast('Failed to generate invite link', 'error');
      }
    );
  }, [selectedWorkplace, canInviteMembers]);

  const handleInviteSubmit = useCallback((invitePayload) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to send invitations', 'error');
      return;
    }

    const { role, email } = invitePayload;

    const payload = {
      workspaceId: selectedWorkplace,
      role: role,
      email: email
    };

    requestHandler(
      () => addWorkspaceManager(payload),
      setAddingManager,
      () => {
        setShowInviteLinkModal(false);
        showToast(`Invitation sent to ${email}!`, 'success');
        setInviteLinkData({ email: '', role: 'MEMBER' });
      },
      (error) => {
        console.error("Failed to send invite:", error);
        showToast('Failed to send invitation', 'error');
      }
    );
  }, [selectedWorkplace, canInviteMembers]);

  const handleCreateWorkplace = useCallback((e) => {
    e.preventDefault();
    if (!isSuperuser) {
      showToast('Only superusers can create workplaces', 'error');
      return;
    }

    const payload = { name: newWorkplace.name, description: newWorkplace.description };

    requestHandler(
      () => createWorkspace(payload),
      setCreatingWorkspace,
      (response) => {
        const newWorkplaceData = response?.data || response;
        setWorkplaces(prev => [...prev, newWorkplaceData]);
        setSelectedWorkplace(newWorkplaceData._id);
        setShowCreateWorkplaceModal(false);
        setNewWorkplace({ name: '', description: '' });
        showToast('Workplace created successfully! 🎉', 'success');
        navigate(`/workspace/${newWorkplaceData._id}`, { replace: true });
      },
      (error) => {
        console.error("Failed to create workplace:", error);
        showToast('Failed to create workplace', 'error');
      }
    );
  }, [newWorkplace, isSuperuser, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Render content based on active tab with Suspense
  const renderContent = useCallback(() => {
    const props = {
      selectedWorkplace,
      workplaces,
      loadingWorkspaces,
      projects,
      teams,
      members,
      availableUsers,
      globalUsers,
      loadingGlobalUsers,
      user,
      currentUserRole,
      isSuperuser,
      isAdmin: isAdmin(),
      isManager: isManager(),
      isTeamLeader: isTeamLeader(),
      isMemberOnly: isMemberOnly(),
      canCreateWorkplace: canCreateWorkplace(),
      canCreateProject: canCreateProject(),
      canCreateTeam: canCreateTeam(),
      canInviteMembers: canInviteMembers(),
      canViewAllProjects: canViewAllProjects(),
      canViewAllTeams: canViewAllTeams(),
      canManageMembers: canManageMembers(),
      canManageTeams: canManageTeams(),
      formatDate,
      daysLeft,
      canEditProject,
      canDeleteProject,
      setSelectedWorkplace: handleWorkspaceChange,
      setShowCreateWorkplaceModal,
      setShowInviteModal,
      setShowCreateProjectModal,
      setShowCreateTeamModal,
      setShowInviteLinkModal,
      setShowBulkUploadModal,
      handleDeleteProject,
      handleDeleteTeam,
      handleAddMemberToTeam,
      handleRemoveTeamMember,
      handleSetTeamLeader,
      handleRemoveTeamLeaderAndAddToTeam,
      handleAddToGlobalPool,
      handleBulkUploadInterns,
      handleUpdateProjectDeadline,
      handleCreateProject,
      handleCreateTeam,
      handleUpdateProject,
      handleUpdateTeam,
      showEditProjectModal,
      setShowEditProjectModal,
      showEditDeadlineModal,
      setShowEditDeadlineModal,
      showEditTeamModal,
      setShowEditTeamModal,
      showAddMemberModal,
      setShowAddMemberModal,
      newGlobalUser,
      setNewGlobalUser,
      csvFile,
      setCsvFile,
      addingGlobalUser,
      uploading,
      getMembersByRole,
      getTeamMembers,
      getAvailableMembersForTeam,
      onViewTasks: handleViewProjectTasks,
      // Workspace member management props
      onInviteToWorkspace: handleInviteToWorkspace,
      onAssignRole: handleAssignRole,
      onRemoveFromWorkspace: handleRemoveFromWorkspace
    };

    const contentMap = {
      dashboard: <Dashboard {...props} />,
      projects: <ProjectsTab {...props} />,
      teams: <TeamsTab {...props} />,
      members: <MembersTab {...props} />,
      tasks: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Tasks</h2>
            <p className="text-gray-600">View and manage tasks across all projects</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">{project.projectName}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Due: {formatDate(project.deadline)}
                    </span>
                    <button
                      onClick={() => handleViewProjectTasks(project)}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No projects available</p>
              </div>
            )}
          </div>
        </div>
      ),
      invites: (
        <InvitesTab
          setShowInviteModal={setShowInviteModal}
          setShowInviteLinkModal={setShowInviteLinkModal}
          canInviteMembers={canInviteMembers()}
        />
      ),
      analytics: <AnalyticsTab {...props} />,
      'global-pool': isSuperuser ? (
        <GlobalPoolTab
          {...props}
          selectedWorkplace={selectedWorkplace}
          members={members}
          currentUserRole={currentUserRole}
          isSuperuser={isSuperuser}
          isAdmin={isAdmin()}
          isManager={isManager()}
          user={user}
          canInviteMembers={canInviteMembers()}
          canManageMembers={canManageMembers()}
          onInviteToWorkspace={handleInviteToWorkspace}
          onAssignRole={handleAssignRole}
          onRemoveFromWorkspace={handleRemoveFromWorkspace}
        />
      ) : null,
      profile: <Profile {...props} />
    };

    const content = contentMap[activeTab] || contentMap.dashboard;

    return (
      <>
        <Suspense fallback={<LoadingFallback message={`Loading ${activeTab}...`} />}>
          {content}
        </Suspense>

        {/* Task Modal */}
        {selectedProjectForTasks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tasks for: {selectedProjectForTasks.projectName}</h2>
                  {selectedProjectForTasks.description && (
                    <p className="text-sm text-gray-600 mt-1">{selectedProjectForTasks.description}</p>
                  )}
                </div>
                <button
                  onClick={handleCloseTasks}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <Suspense fallback={<LoadingFallback message="Loading tasks..." />}>
                  <TaskComponent
                    projectId={selectedProjectForTasks._id}
                    members={availableUsers}
                    currentUserRole={currentUserRole}
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }, [
    activeTab, selectedWorkplace, workplaces, loadingWorkspaces, projects, teams,
    members, availableUsers, globalUsers, loadingGlobalUsers, user, currentUserRole,
    isSuperuser, newGlobalUser, addingGlobalUser, csvFile, showEditProjectModal,
    showEditDeadlineModal, showEditTeamModal, showAddMemberModal,
    uploading, getMembersByRole, getTeamMembers, getAvailableMembersForTeam,
    handleCreateProject, handleCreateTeam, handleUpdateTeam, handleDeleteProject, handleDeleteTeam,
    handleAddMemberToTeam, handleRemoveTeamMember, handleSetTeamLeader,
    handleRemoveTeamLeaderAndAddToTeam, handleAddToGlobalPool, handleBulkUploadInterns,
    handleUpdateProject, handleUpdateProjectDeadline, handleWorkspaceChange,
    handleViewProjectTasks, handleCloseTasks, selectedProjectForTasks,
    isAdmin, isManager, isTeamLeader, isMemberOnly, canCreateWorkplace, canCreateProject,
    canCreateTeam, canInviteMembers, canViewAllProjects, canViewAllTeams, canManageMembers,
    canManageTeams, canEditProject, canDeleteProject, formatDate,
    handleInviteToWorkspace, handleAssignRole, handleRemoveFromWorkspace
  ]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mx-auto mb-3" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Unauthorized</h2>
          <p className="text-gray-600 mt-2">Please login to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Toast Notifications */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-green-500 text-white' :
                toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                    <img
                  src={Athenura_Nav_Image}
                  alt="Logo"
                  className="h-12 w-auto"
                  style={{ borderRadius: "50%" }}
                />
              </div>

              <div className="flex items-center gap-6">
                {isSuperuser && (
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium shadow-sm">
                    Superuser
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUserRole === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  currentUserRole === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                  currentUserRole === 'TEAM_LEADER' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentUserRole === 'ADMIN' ? 'Administrator' :
                   currentUserRole === 'MANAGER' ? 'Manager' :
                   currentUserRole === 'TEAM_LEADER' ? 'Team Leader' : 'Member'}
                </span>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex pt-16">
          <Suspense fallback={<LoadingFallback message="Loading sidebar..." />}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              sidebarCollapsed={sidebarCollapsed}
              isSuperuser={isSuperuser}
              currentUserRole={currentUserRole}
              selectedWorkplace={selectedWorkplace}
              workplaces={workplaces}
              isMemberOnly={isMemberOnly()}
              canCreateProject={canCreateProject()}
              canCreateTeam={canCreateTeam()}
              canInviteMembers={canInviteMembers()}
            />
          </Suspense>
          <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6 transition-all duration-300`}>
            {renderContent()}
          </main>
        </div>

        {/* Modals with lazy loading */}
        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateWorkplaceModal && (
            <CreateWorkplaceModal
              show={showCreateWorkplaceModal}
              onClose={() => setShowCreateWorkplaceModal(false)}
              onSubmit={handleCreateWorkplace}
              newWorkplace={newWorkplace}
              setNewWorkplace={setNewWorkplace}
              creatingWorkspace={creatingWorkspace}
              canCreate={isSuperuser}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateProjectModal && (
            <CreateProjectModal
              show={showCreateProjectModal}
              onClose={() => setShowCreateProjectModal(false)}
              onSubmit={handleCreateProject}
              workspaceId={selectedWorkplace}
              availableUsers={availableUsers}
              canCreate={canCreateProject()}
              isMemberOnly={isMemberOnly()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateTeamModal && (
            <CreateTeamModal
              show={showCreateTeamModal}
              onClose={() => setShowCreateTeamModal(false)}
              onSubmit={handleCreateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={false}
              editData={null}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditTeamModal && (
            <CreateTeamModal
              show={!!showEditTeamModal}
              onClose={() => setShowEditTeamModal(null)}
              onSubmit={handleUpdateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={true}
              editData={showEditTeamModal}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteModal && (
            <InviteMemberModal
              show={showInviteModal}
              onClose={() => {
                setShowInviteModal(false);
                setInviteData({ email: '', role: 'MEMBER' });
                setGeneratedToken(null);
              }}
              onSubmit={handleGenerateInviteLink}
              inviteData={inviteData}
              setInviteData={setInviteData}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              loading={generatingLink}
              generatedLink={generatedToken}
              setGeneratedLink={setGeneratedToken}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteLinkModal && (
            <InviteLinkModal
              show={showInviteLinkModal}
              onClose={() => {
                setShowInviteLinkModal(false);
                setInviteLinkData({ email: '', role: 'MEMBER' });
              }}
              onSubmit={handleInviteSubmit}
              inviteLinkData={inviteLinkData}
              setInviteLinkData={setInviteLinkData}
              generatingLink={addingManager}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showBulkUploadModal && (
            <BulkUploadModal
              show={showBulkUploadModal}
              onClose={() => setShowBulkUploadModal(false)}
              onSubmit={handleBulkUploadInterns}
              uploading={uploading}
            />
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default WorkPlaceHome;
