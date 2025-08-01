import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Todo Type is required"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    team:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    color: String,
    textCol: String,
    total: Number,
    completed: Number,
}, { timestamps: true })

export const Todo = mongoose.model("Todo",todoSchema);