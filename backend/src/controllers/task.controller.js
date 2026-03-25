import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Task from '../models/task.model.js';
import ApiError from '../utils/ApiError.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';


const createNewTask = asyncHandler(async(req,res)=>{

    const { projectId, memberId, date, description, status, remark } = req.body

    const user = req.user;

    if([projectId, memberId, date, description, status].some((field)=>  String(field).trim() === "")) {
      throw new ApiError(400, "Required fields are missing")
    }

    const project = await Project.findById(projectId)
    if (!project) throw new ApiError(404, "Project not found")

    const member = await User.findById(memberId)
    if (!member) throw new ApiError(404, "User not found")

    await Task.create({
        projectId: project._id,
        memberId: member._id,
        date: new Date(date),
        remark: remark || "",
        status,
        description,
        submittedBy: user._id
    })

    return res.status(200).json(new ApiResponse(200, {}, "Create New Task Successfully"))
})


const getAllTask = asyncHandler(async(req,res)=>{
    const { projectId } = req.params;

    let query = {};
    if (projectId) {
        query.projectId = projectId;
    }

    const allTask = await Task.find(query)
        .populate("projectId", "projectName description startDate deadline")
        .populate("memberId", "name email phone role")
        .populate("submittedBy", "name email")
        .lean();

    return res.status(200).json(new ApiResponse(200 , allTask, "fetch all task Successfully"))
})

export {
  createNewTask,
  getAllTask
}
