import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo"
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "in-progress", "completed"]
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    deadline: {
        type: Date,
    },
    notes: [{
        content: {
            type: String,
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        lastUpdatedAt:{
            type:Date
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const subTodo = mongoose.model("SubTodo", subTodoSchema);