import apiClient from "../utils";

// ------------------------------ X ------------------------------------
// auth apis

export const registerAdmin = (data) => {
   return apiClient.post("/auth/user/register", data);
}

export const commonLogin = (data) => {
    console.log("data",data);
    return apiClient.post("/auth/user/login", data);
}

export const currentUser = () => {
    return apiClient.get("/auth/user/fetch");
}

export const loggedOutUser = () => {
    return apiClient.post("/auth/user/logout");
}

export const changeCurrentPassword = (data) => {
    return apiClient.post("/auth/user/change-password", data);
}

export const updateUserProfile = (data) => {
    return apiClient.put("/auth/user/update-profile", data);
}

export const updateUserAvatar = (data) => {
  return apiClient.put("/auth/user/update-avatar", data);
}



// ------------------------------ X ------------------------------------
// add interns

export const bulkUploadUsers = (data) => {
  return apiClient.post("/user/bulk-upload", data);
}

export const getAllUsers = () => {
  return apiClient.get("/user/all");
}


// ------------------------------ X ------------------------------------
// workplace apis

export const createWorkspace = (data) => {
  return apiClient.post("/workspace/create", data); // Added return
}

export const addWorkspaceManager = (data) => {
  return apiClient.post(`/workspace/add-manager/${data.workspaceId}`, data); // Added return
}

export const inviteUserToWorkspace = (data) => {
  return apiClient.post(`/workspace/invite-user/${data.workspaceId}`, data); // Added return
}

export const removeWorkspaceMember = (data) => {
  return apiClient.delete(`/workspace/remove-member/${data.workspaceId}`, data); // Added return
}

export const getWorkspaces = () => {
  return apiClient.get("/workspace/all"); // Added return
}

export const getWorkspaceById = (data) => {
  return apiClient.get(`/workspace/${data.workspaceId}`); // Added return
}

// ------------------------------ X ------------------------------------
// project

export const createProject = (data) => {
  return apiClient.post("/project/add/project", data); // Added return
}

export const getProjects = (data) => {
  console.log("data",data);
  return apiClient.get(`/project/workspace/${data.workspaceId}`); // Added return
}

export const updateProject = (data) => {
  return apiClient.put(`/project/update/${data.projectId}`, data); // Added return
}

export const updateProjectDeadline = (data) => {
  return apiClient.put(`/project/update/deadline/${data.projectId}`, data); // Added return
}

export const deleteProject = (data) => {
  return apiClient.delete(`/project/${data.projectId}`); // Added return
}

// signle user project

export const getprojectOfUser = () => {
  return apiClient.get(`/project/Workspace/project`); // Added return
}

// ------------------------------ X ------------------------------------
// team

export const createTeam = (data) => {
  console.log("data 3",data);
  return apiClient.post("/team/add/team", data); // Added return
}

export const getTeams = (data) => {
  return apiClient.get(`/team/fetch/team/${data.workspaceId}`); // Added return
}

export const updateTeam = (data) => {
  return apiClient.put(`/team/update/${data.teamId}`, data); // Added return
}

export const addNewMemberInTeam = (data) => {
  return apiClient.patch(`/team/add-memeber/team/${data.teamId}`, data); // Added return
}

export const setNewTeamLeader = (data) => {
  return apiClient.patch(`/team/set/new/team-leader/${data.teamId}`, data); // Added return
}

export const removeTeamMember = (data) => {
  return apiClient.patch(`/team/remove-intern/team/${data.teamId}`, data); // Added return
}

export const removeTeamLeaderAndAddToTeam = (data) => {
  return apiClient.patch(`/team/remove-lead/add-team/${data.teamId}`, data); // Added return
}

export const updateUserRole = (data) => {
  return apiClient.patch(`/team/update-role/${data.teamId}`, data); // Added return
}

export const deleteTeam = (data) => {
  return apiClient.delete(`/team/${data.teamId}`); // Added return
}


// ------------------------------ X ------------------------------------
//

export const createProjectTask = (data) => {
  return apiClient.post("/task/new-task", data);
}

export const getProjectTask = (data) => {
  return apiClient.get(`/task/get/all-task/${data.projectId}`);
}



// ------------------------------ X ------------------------------------
// workplace invait token

export const generateInviteToken = (data) => {
    console.log("data",data);
    return apiClient.post("/invite/generate", data);
}

export const acceptInviteToken = (data) => {
    return apiClient.post("/invite/accept", data);
}
