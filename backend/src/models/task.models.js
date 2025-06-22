import mongoose from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";
 
const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,  
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: AvailableTaskStatus,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimeType: String,
            size: Number
        }],
        default: []
    }
},{timestamps})

export const Task = mongoose.model('Task', taskSchema)