import { subTodo } from "../models/subTodo.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getSubTodos = asyncHandler(async(req,res,next)=>{
    try {
        const{majorTodoId} = req.params;
        if(!majorTodoId)throw new apiError("provide majortodo Id")
        console.log(majorTodoId);
        const subTodos = await subTodo.find({parent:majorTodoId});
        res.status(200).json(new apiResponse(200,{
            data:subTodos
        },"Data sent successfully")); 
    } catch (error) {
        throw new apiError(500,"Error while fetching data from server");
    }
});
const addSubTodo = asyncHandler(async(req,res,next)=>{
    try {
        const {subtodo,majorTodoId} = req.body;
        if(!subtodo || !majorTodoId)throw new apiError(401,"provide subtodo content and majorTodoId to create a new todo");
        const createdSubTodo = await subTodo.create({
            content:subtodo,
            parent:majorTodoId,
            complete:false,
            createdBy:req.user?._id
        })
        if(!createdSubTodo)throw new apiError(500,"Error occured while saving the todo into database");
        res.status(200).json(new apiResponse(200,{
            data:createdSubTodo
        },"Todo saved successfully"))
    } catch (error) {
        throw new apiError(500,"Error occured while saving the todo into database");
    }
});
const deleteSubTodo = asyncHandler(async(req,res,next)=>{
    try {
        const {id} = req.body;
        if(!id)throw new apiError(401,"Provide Id of the todo to be deleted")
        const deletedSubTodo = await subTodo.deleteOne({_id:id});
        if(!deletedSubTodo)throw new apiError(500,"Error occured while deleting the todo from the database"); 
        res.status(200).json(new apiResponse(200,{
            data:deletedSubTodo
        },"Todo deleted successfully"));       
    } catch (error) {
        throw new apiError(500,"Error occured while deleting the todo from the database");
    }
});
const updateSubTodo = asyncHandler(async(req,res,next)=>{
    try {
        const {id,subtodo,completed} = req.body;
        if(!id || !subtodo)throw new apiError(401,"provide subtodo content and majorTodoId to create a new todo");
        const existing = await subTodo.findById(id);
        if(!existing)throw new apiError(500,"subtodo with given id does not exists");
        existing.content = subtodo;
        existing.complete = completed;
        await existing.save();
        res.status(200).json(new apiResponse(200,{
            data:existing
        },"Todo updated successfully"))
    } catch (error) {
        throw new apiError(500,"Error occured while updating the todo into database");
    }
});

export {getSubTodos,addSubTodo,deleteSubTodo,updateSubTodo};