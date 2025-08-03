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
    const { content, MajorTodoId } = req.body;

    if (!content || !MajorTodoId) {
        throw new apiError(401, "Provide subtodo content and majorTodoId");
    }

    // Create the new sub-todo
    const createdSubTodo = await subTodo.create({
        content: content,
        parent: MajorTodoId,
        complete: false,
        createdBy: req.user?._id
    });

    if (!createdSubTodo) {
        throw new apiError(500, "Failed to save the sub-todo into the database");
    }
    
    // Find and update the parent todo's counters
    const majorTodo = await Todo.findById(createdSubTodo.parent);
    if (!majorTodo) {
        // This is a more specific error
        throw new apiError(404, "Parent todo not found to update");
    }

    majorTodo.total += 1;
    // No need to check for complete here, since we set it to false above
    await majorTodo.save({ validateBeforeSave: false }); // Optimization: skip validation on parent

    // ✅ Emit the event AFTER all database operations are successful
    req.io.emit('subtodo_added', createdSubTodo);

    return res.status(200).json(new apiResponse(200, {
        data: createdSubTodo
    }, "Sub-todo saved successfully"));
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

        req.io.emit('subtodo_deleted', subtodo);
        res.status(200).json(new apiResponse(200, {
            data: deletedSubTodo
        }, "Todo deleted successfully"));
    } catch (error) {
        throw new apiError(500, "Error occured while deleting the todo from the database");
    }
});
const updateSubTodo = asyncHandler(async (req, res, next) => {
    try {
        const { _id, content, status } = req.body;
        console.log(req.body);
        if (!_id || !content) throw new apiError(401, "provide subtodo content and majorTodoId to create a new todo");
        const existing = await subTodo.findById(_id);
        const prev = existing.status;
        const nxt = status;
        if (!existing) throw new apiError(500, "subtodo with given id does not exists");
        existing.content = content;
        existing.status = status;
        // console.log(existing);
        const updated = await existing.save();
        if (nxt != prev) {
            const majorTodo = await Todo.findById(existing.parent);
            console.log(majorTodo);
            if (!majorTodo) {
                throw new apiError(500, "Error while updating majorTodo");
            }
            if (prev === "completed") { majorTodo.completed -= 1; }
            if (nxt === "completed") { majorTodo.completed += 1; }
            await majorTodo.save();
        }
        console.log(req.io)
        req.io.emit('subtodo_updated', updated);
        console.log("Emitted subtodo_updated",updated);
        res.status(200).json(new apiResponse(200, {
            data: existing
        }, "Todo updated successfully"))

    } catch (error) {
        throw new apiError(500, "Error occured while updating the todo into database");
    }
});

export { getSubTodos, addSubTodo, deleteSubTodo, updateSubTodo };