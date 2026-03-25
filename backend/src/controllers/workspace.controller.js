import Workspace from '../models/workspace.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Superuser: Create a new workspace
const createWorkspace = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Workspace name is required");
    }

    const workspace = await Workspace.create({
        name,
        description: description || "",
        createdBy: req.user._id,
        members: [{
            user: req.user._id,
            role: "ADMIN"
        }]
    });

    return res.status(201).json(new ApiResponse(201, workspace, "Workspace created successfully"));
});

// Any User: Get workspaces
// Superusers see all workspaces. Normal users see only workspaces they are a member of.
const getWorkspaces = asyncHandler(async (req, res) => {
    let workspaces;

    if (req.user.isSuperuser) {
        // Superuser can see all workspaces
        workspaces = await Workspace.find().populate('createdBy', 'name email').populate('members.user', 'name email');
    } else {
        // Regular users can only see workspaces where they are in the members array
        workspaces = await Workspace.find({
            "members.user": req.user._id
        }).populate('createdBy', 'name email').populate('members.user', 'name email');
    }

    return res.status(200).json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

// Any User: Get a single workspace by ID (if they have access)
const getWorkspaceById = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    // console.log("workpalceId" , workspaceId);


    const workspace = await Workspace.findById(workspaceId)
        .populate('createdBy', 'name email')
        .populate('members.user', 'name email');

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Access control: Superuser, or user must be a member
    if (!req.user.isSuperuser) {
        const isMember = workspace.members.some(
            (member) => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            throw new ApiError(403, "Forbidden! You do not have access to this workspace.");
        }
    }

    return res.status(200).json(new ApiResponse(200, workspace, "Workspace fetched successfully"));
});


// const addMemmberonWorkplace = asyncHandler(async(req,res)=>{

//       console.log(req.body);


// })



// Superuser: Add a Manager to a Workspace
const addWorkspaceManager = asyncHandler(async (req, res) => {

  console.log(req.body);


    const { workspaceId } = req.params;
    const { userId } = req.body; // Internal User ID from the global pool

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found in the global pool");
    }

    // Check if user is already a member
    const existingMemberIndex = workspace.members.findIndex(
        (member) => member.user.toString() === userId.toString()
    );

    if (existingMemberIndex !== -1) {
        // If they exist, upgrade/change their role to MANAGER
        workspace.members[existingMemberIndex].role = "MANAGER";
    } else {
        // If they don't exist, add them as MANAGER
        workspace.members.push({
            user: userId,
            role: "MANAGER"
        });
    }

    await workspace.save();

    return res.status(200).json(new ApiResponse(200, workspace, "User added as Workspace Manager successfully"));
});

export { createWorkspace, getWorkspaces, getWorkspaceById, addWorkspaceManager };
