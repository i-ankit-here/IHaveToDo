import {Todo} from "../models/todo.models.js"
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"


const getTodos = asyncHandler(async(req,res,next)=>{
    const user = req.user;
    if(!user){
        throw new apiError(401,"Invalid request");
    }

    const todos = await Todo.find({createdBy:user._id});
    res.status(200).json(new apiResponse(200,{
        todos:todos
    },"todos sent successfully"));
})

const addTodo = asyncHandler(async(req,res,next)=>{
    const user = req.user;
    if(!user){
        throw new apiError(401,"Invalid request");
    }
    const {id,title,color,total,completed} = req.body;
    if(id){
        const todo = await Todo.findById(id);
        if(!todo){
            throw new apiError(401,"Invalid todo Id");
        }
        todo.title = title?title:todo.title;
        todo.color = color?color:todo.color;
        todo.total = total?total:todo.total;
        todo.completed = completed?completed:todo.completed;
        const updatedTodo = await todo.save();
        res.status(200).json(new apiResponse(200,{
            updatedTodo:updatedTodo
        },"Todo updated Successfully"));
    }else{
        const createdTodo = await Todo.create({
            title:title,
            color: color,
            createdBy:user._id,
            total: total||0,
            completed:completed||0
        })
        res.status(200).json(new apiResponse(200,{
            createdTodo:createdTodo
        },"Todo updated Successfully"));
    }
})

const deleteTodo = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        throw new apiError(401,"Please provide the Todo Id");
    }
    const deletedTodo = await Todo.deleteOne({_id:id});
    res.status(200).json(new apiResponse(200,{
        deletedTodo:deletedTodo
    },"Todo deleted successfully"));
})

export {getTodos,addTodo,deleteTodo};