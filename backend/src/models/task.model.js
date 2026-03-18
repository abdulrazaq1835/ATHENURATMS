import { model, Schema } from "mongoose";


const taskSchema = new Schema(
  {
    projectId : {
      type : Schema.Types.ObjectId,
      ref : "Project"
    },
    memberId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    date : {
      type : Date,
      required : true
    },
    description : {
      type : String
    },
    status : {
      type : String,
      default : "pending",
      enum : ["pending", "complete"]
    },
    remark : {
      type : String
    },
    submittedBy : {
      type : Schema.Types.ObjectId,
      ref : "User"
    }
  }, { timestamps : true }
)


const Task = model("Task", taskSchema)
export default Task;
