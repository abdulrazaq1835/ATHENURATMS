import Project from '../models/project.model.js';
import Workspace from '../models/workspace.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// create a project
const createProject = asyncHandler(async (req, res) => {
    const { workspaceId, projectName, description, startDate, deadline, teamLeadId, memberIds } = req.body;
    const user = req.user;

    if (!workspaceId || !projectName || !startDate || !deadline) {
        throw new ApiError(400, "workspaceId, projectName, startDate, and deadline are required");
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Verify Authorization: Must be SUPERUSER or a MANAGER/ADMIN in that workspace
    let isAuthorized = user.isSuperuser;
    if (!isAuthorized) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === user._id.toString()
        );
        if (memberRecord && (memberRecord.role === "MANAGER" || memberRecord.role === "ADMIN")) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to create a project in this workspace");
    }

    // Prepare project members
    const projectMembers = [];
    
    // If teamLeadId provided, add it. Otherwise, creator becomes TEAM_LEAD.
    if (teamLeadId) {
        projectMembers.push({ user: teamLeadId, role: "TEAM_LEAD" });
    } else {
        projectMembers.push({ user: user._id, role: "TEAM_LEAD" });
    }

    // Add other members
    if (memberIds && Array.isArray(memberIds)) {
        memberIds.forEach(mId => {
            if (mId !== teamLeadId) {
                projectMembers.push({ user: mId, role: "TEAM_MEMBER" });
            }
        });
    }

    const newProject = await Project.create({
        workspaceId,
        projectName,
        description,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        createdBy: req.user._id,
        members: projectMembers
    });

    // Ensure all project members are added to Workspace members as well
    let workspaceModified = false;
    for (const pm of projectMembers) {
        const existsInWS = workspace.members.some(m => m.user.toString() === pm.user.toString());
        if (!existsInWS) {
            workspace.members.push({ user: pm.user, role: "MEMBER" });
            workspaceModified = true;
        }
    }

    if (workspaceModified) {
        await workspace.save();
    }

    return res.status(201).json(new ApiResponse(201, newProject, "Project created successfully"));
});

// get all projects for a given workspace
const getAllProjectsByWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const user = req.user;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Verify Authorization: either superuser or belongs to workspace
    let isAuthorized = user.isSuperuser;
    if (!isAuthorized) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === user._id.toString()
        );
        if (memberRecord) isAuthorized = true;
    }

    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to view projects for this workspace");
    }

    // A standard user (MEMBER) theoretically only sees projects they are a part of, 
    // unless the design means they can see all projects in the workspace.
    // Assuming they can see projects they belong to, or if they are MANAGER/ADMIN/SUPERUSER they see all.
    let projectQuery = { workspaceId };
    
    if (!user.isSuperuser) {
        const memberRecord = workspace.members.find(m => m.user.toString() === user._id.toString());
        if (memberRecord && memberRecord.role === "MEMBER") {
            // They can only see projects where they are in the members array
            projectQuery["members.user"] = user._id;
        }
    }

    const projects = await Project.find(projectQuery)
        .populate("createdBy", "name email")
        .populate("members.user", "name email");

    return res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// update project deadline
const updateDeadline = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { newDeadline } = req.body;

    const [day, month, year] = newDeadline.split("-");
    const postponedDate = new Date(year, month - 1, day);

    if (isNaN(postponedDate)) {
        throw new ApiError(400, "Invalid date format");
    }

    const project = await Project.findByIdAndUpdate(projectId, {
        $set: {
            deadline: postponedDate
        }
    }, { new: true });

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(new ApiResponse(200, project, "Project deadline postponed successfully"));
});

// update full project
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { projectName, description, startDate, deadline } = req.body;

    const project = await Project.findByIdAndUpdate(projectId, {
        projectName,
        description,
        startDate: new Date(startDate),
        deadline: new Date(deadline)
    }, { new: true });

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

export {
    createProject,
    getAllProjectsByWorkspace,
    updateDeadline,
    updateProject
};
