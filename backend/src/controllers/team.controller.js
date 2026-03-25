import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Workspace from '../models/workspace.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// create team
const createTeam= asyncHandler(async(req,res)=>{

      const { projectId, teamName, team, teamLeaderId ,workSpaceId} = req.body
      console.log(req.body);


      const project = await Project.findById(projectId)

      const teamLeader = await User.findByIdAndUpdate(teamLeaderId, {
          $set : {
            role : "teamLeader"
          },
      },{new : true}).select("-refreshToken")


      const teamLead = await User.findById(teamLeader._id)


      const allMembers = await User.find({_id : {$in : team}})

      console.log("allMembers",allMembers);

        await Team.create({
            workspaceId : workSpaceId,
            teamName : teamName,
            projectId : project._id,
            team : allMembers,
            teamLeader : teamLead,
        })

  return res.status(200).json(new ApiResponse(200, {}, "new project create successfully"))
})

// get team
const getTeams = asyncHandler(async (req, res) => {
          const { workspaceId } = req.params;
          const userId = req.user._id;

          console.log("user",userId);


          const workspace = await Workspace.findById(workspaceId);

          if (!workspace) {
            throw new ApiError(404, "Workspace not found");
          }

          const teams = await Team.find({ workspaceId });

          console.log("teams",teams);


          const isUserInAnyTeam = await teams.map((team) =>
            team.team.map((memberId) =>
              memberId.toString() === userId.toString()
            )
          );


          if (!isUserInAnyTeam) {
            throw new ApiError(403, "User is not part of any team");
          }

          console.log("teams", teams);

          return res.status(200).json(
            new ApiResponse(200, teams, "fetch teams")
          );
});


// add new member
const addNewMember = asyncHandler(async(req,res)=>{

        const { teamId } = req.params

         const { newMemberId } = req.body

        const team = await Team.findById(teamId);
          if (!team) {
            return res.status(404).json({ error: "Team not found" });
          }


          const user = await User.findOne({ _id: newMemberId }).select("_id");
          if (!user) {
            return res.status(404).json({ error: "user not found" });
          }


          const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            { $addToSet: { team: user._id } },
            { new: true }
          );

          console.log("Updated team:", updatedTeam.team);


    return res.status(200).json(new ApiResponse(200, {}, "team update successfully"))
})

const removeTeamMember = asyncHandler(async(req,res)=>{

    const { teamId } = req.params
    const { userId } = req.body

    const team = await Team.findById(teamId)
    const user = await User.findById(userId).select("_id")

    await Team.findByIdAndUpdate(team._id, {
        $pull : {
          team : user._id
        }
    }, {save : true})

    return res.status(200).json(new ApiResponse(200, {}, "remove user from team successfully"))
})

//set new Team leader from team
const setNewTeamLeader = asyncHandler(async(req,res)=>{

        const { teamId } = req.params

         const { NewTeamLeaderId } = req.body

        const team = await Team.findById(teamId);
          if (!team) {
            return res.status(404).json({ error: "Team not found" });
          }


          const NewTeamLeader = await User.findOne({ _id: NewTeamLeaderId }).select("_id");
          if (!NewTeamLeader) {
            return res.status(404).json({ error: "teamLeader not found" });
          }


          const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            {
               $set: { teamLeader: NewTeamLeader._id },
               $pull : { team : NewTeamLeader._id }
          } ,
            { new: true }
          );

          console.log("Updated team:", updatedTeam.team);


    return res.status(200).json(new ApiResponse(200, {}, "add new team leader from team update successfully"))
})

// remove team leader and add to team
const removeTeamLeaderAndAddToTeam = asyncHandler(async(req,res)=>{

       const { teamId } = req.params

       const { teamLeaderId } = req.body

    const team = await Team.findById(teamId);
          if (!team) {
            throw new ApiError(400,"Team not found")
          }


          const teamLeader = await User.findOne({ _id: teamLeaderId }).select("_id");
          if (!teamLeader) {
              throw new ApiError(400,"teamLeader not found")
          }


           await Team.findByIdAndUpdate(
            team._id,
            {
              $push : { team : teamLeader._id },
              $set: { teamLeader:  null }
          } ,
            { new: true }
          );
  return res.status(200).json(new ApiResponse(200, {}, "remove team Leader from team and add to team successfully"))
})

// update team completely (name, leaders, members)
const updateTeam = asyncHandler(async(req,res)=>{
  const { teamId } = req.params;
  const { teamName, teamLeaderId, team } = req.body;

  const existingTeam = await Team.findById(teamId);
  if(!existingTeam) {
    throw new ApiError(404, "Team not found");
  }

  if(teamLeaderId && String(existingTeam.teamLeader) !== String(teamLeaderId)) {
    if(existingTeam.teamLeader) {
       await User.findByIdAndUpdate(existingTeam.teamLeader, { $set: { role: "intern" }});
    }
    await User.findByIdAndUpdate(teamLeaderId, { $set: { role: "teamLeader" }});
  }

  const updatedTeam = await Team.findByIdAndUpdate(teamId, {
    teamName: teamName || existingTeam.teamName,
    teamLeader: teamLeaderId || existingTeam.teamLeader,
    team: team || existingTeam.team
  }, { new: true });

  return res.status(200).json(new ApiResponse(200, updatedTeam, "Team updated successfully"));
})

export {
  addNewMember, createTeam,
  getTeams, removeTeamLeaderAndAddToTeam, removeTeamMember, setNewTeamLeader, updateTeam
};
