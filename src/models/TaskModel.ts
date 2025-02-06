import { Schema,model } from "mongoose";


// Define intreface for Task
export interface Task {
    title: string;
    description: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    user: string;
}


const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    priority:{
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    },{timestamps: true});

const TaskModel = model("TaskModel", TaskSchema);
export default TaskModel;