import { model, Schema } from "mongoose";

const teamSchema = new Schema(
  {
       projectId :  {
          type : Schema.Types.ObjectId,
          ref : "Project",
       },
       workspaceId : {
        type : Schema.Types.ObjectId,
        ref : "Workspace",
        required : true
      },
        teamName : {
          type : String,
          req : true
        },
        team : [
          {
              type : Schema.Types.ObjectId,
              ref : "User"
          }
        ],
        teamLeader :
              {
              type : Schema.Types.ObjectId,
              ref : "User"
          }

  }, { timestamps : true }
)


const Team = model("Team" , teamSchema)
export default Team
