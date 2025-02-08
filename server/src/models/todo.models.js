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
    color: String,
    total: Number,
    completed: Number,
}, { timestamps: true })