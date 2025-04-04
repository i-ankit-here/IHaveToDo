import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content:{
        type : String,
    },
    parent:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Todo"
    }
    ,
    complete:{
        type : Boolean,
        default : false,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps:true})

export const subTodo = mongoose.model("SubTodo",subTodoSchema);