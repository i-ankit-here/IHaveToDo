import { subTodo } from "../models/subTodo.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.models.js"

const getSubTodos = asyncHandler(async (req, res, next) => {
    try {
        const { majorTodoId } = req.params;
        if (!majorTodoId) throw new apiError("provide majortodo Id")
        console.log(majorTodoId);
        const subTodos = await subTodo.find({ parent: majorTodoId });
        res.status(200).json(new apiResponse(200, {
            data: subTodos
        }, "Data sent successfully"));
    } catch (error) {
        throw new apiError(500, "Error while fetching data from server");
    }
});
const addSubTodo = asyncHandler(async (req, res, next) => {
    try {
        const { content, MajorTodoId } = req.body;
        console.log(content, MajorTodoId);
        if (!content || !MajorTodoId) throw new apiError(401, "provide subtodo content and majorTodoId to create a new todo");
        const createdSubTodo = await subTodo.create({
            content: content,
            parent: MajorTodoId,
            complete: false,
            createdBy: req.user?._id
        })
        if (!createdSubTodo) throw new apiError(500, "Error occured while saving the todo into database");
        const majorTodo = await Todo.findById(createdSubTodo.parent);
        if (!majorTodo) {
            throw new apiError(500, "Error while updating majorTodo");
        }
        majorTodo.total += 1;
        if (createdSubTodo.complete) majorTodo.completed += 1;
        await majorTodo.save();
        res.status(200).json(new apiResponse(200, {
            data: createdSubTodo
        }, "Todo saved successfully"))
    } catch (error) {
        throw new apiError(500, "Error occured while saving the todo into database");
    }
});
const deleteSubTodo = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id){ throw new apiError(401, "Provide Id of the todo to be deleted"); }
        const subtodo = await subTodo.findById(id);
        const deletedSubTodo = await subTodo.deleteOne({ _id: id });
        if (!deletedSubTodo) throw new apiError(500, "Error occured while deleting the todo from the database");
        console.log(deletedSubTodo);
        console.log(subtodo);
        const majorTodo = await Todo.findById(subtodo.parent);
        if (!majorTodo) {
            throw new apiError(500, "Error while updating majorTodo");
        }
        majorTodo.total -= 1;
        if (subtodo.complete) majorTodo.completed -= 1;
        await majorTodo.save();
        
        res.status(200).json(new apiResponse(200, {
            data: deletedSubTodo
        }, "Todo deleted successfully"));
    } catch (error) {
        throw new apiError(500, "Error occured while deleting the todo from the database");
    }
});
const updateSubTodo = asyncHandler(async (req, res, next) => {
    try {
        const { _id, content, complete } = req.body;
        console.log(req.body);
        if (!_id || !content) throw new apiError(401, "provide subtodo content and majorTodoId to create a new todo");
        const existing = await subTodo.findById(_id);
        const prev = existing.complete;
        const nxt = complete;
        if (!existing) throw new apiError(500, "subtodo with given id does not exists");
        existing.content = content;
        existing.complete = complete;
        await existing.save();
        // console.log(existing);
        if (nxt != prev) {
            const majorTodo = await Todo.findById(existing.parent);
            console.log(majorTodo);
            if (!majorTodo) {
                throw new apiError(500, "Error while updating majorTodo");
            }
            if (prev) { majorTodo.completed -= 1; }
            else { majorTodo.completed += 1; }
            await majorTodo.save();
        }
        
        res.status(200).json(new apiResponse(200, {
            data: existing
        }, "Todo updated successfully"))

    } catch (error) {
        throw new apiError(500, "Error occured while updating the todo into database");
    }
});

export { getSubTodos, addSubTodo, deleteSubTodo, updateSubTodo };