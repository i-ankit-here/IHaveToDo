import { subTodo } from "../models/subTodo.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.models.js"
import { setEvent, updateEvent, deleteEvent } from "./calendar.controller.js";

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
    const { status,content, MajorTodoId , assignedTo, deadline} = req.body;
    let createdEvent = null;
    if(deadline){
        req.body.description = content;
        req.body.summary = content;
        req.body.startDateTime = deadline;
        req.body.endDateTime = deadline;
        createdEvent = await setEvent(req, res);
    }
    if(!createdEvent){
        throw new apiError(500, "Error while creating event for subTodo");
    }
    if (!content || !MajorTodoId) {
        throw new apiError(401, "Provide subtodo content and majorTodoId");
    }

    // Create the new sub-todo
    const createdSubTodo = await subTodo.create({
        content: content,
        parent: MajorTodoId,
        status: status,
        createdBy: req.user?._id,
        notes:[],
        assignedTo:assignedTo,
        deadline:deadline,
        eventId: createdEvent?.id
    });

    if (!createdSubTodo) {
        throw new apiError(500, "Failed to save the sub-todo into the database");
    }
    
    // Find and update the parent todo's counters
    const majorTodo = await Todo.findById(createdSubTodo.parent);
    if (!majorTodo) {
        throw new apiError(404, "Parent todo not found to update");
    }

    majorTodo.total += 1;
    await majorTodo.save({ validateBeforeSave: false }); 

    req.io.emit('subtodo_added', createdSubTodo);

    return res.status(200).json(new apiResponse(200, {
        data: createdSubTodo
    }, "Sub-todo saved successfully"));
});

const deleteSubTodo = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.body;
        console.log(id)
        if (!id){ throw new apiError(401, "Provide Id of the todo to be deleted"); }
        const subtodo = await subTodo.findById(id);
        if (!subtodo) throw new apiError(404, "SubTodo with given id does not exists");
        if(subtodo.eventId){
            req.body.eventId = subtodo.eventId;
            const deletedEvent = await deleteEvent(req, res);
            console.log("deletedEvent: ",deletedEvent);
            if(!deletedEvent) throw new apiError(500, "Error while deleting event for subTodo");
        }
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
        const { _id, content, status , assignedTo, deadline } = req.body;
    
        if (!_id || !content) throw new apiError(401, "provide subtodo content and majorTodoId to create a new todo");
        const existing = await subTodo.findById(_id);

        if (!existing) {
            throw new apiError(500, "subtodo with given id does not exists");
        }

        if(existing.eventId && deadline){
            req.body.summary = content;
            req.body.description = content;
            req.body.startDateTime = deadline;
            req.body.endDateTime = deadline;
            const updatedEvent = await updateEvent(req, res);
            console.log(updatedEvent);
            if(!updatedEvent) {
                throw new apiError(500, "Error while updating event for subTodo");
            }
            existing.eventId = updatedEvent.id;
        }
        const prev = existing.status;
        const nxt = status;
        existing.content = content;
        existing.status = status;
        existing.assignedTo = assignedTo;
        existing.deadline = deadline;
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
        req.io.emit('subtodo_updated', updated);
        res.status(200).json(new apiResponse(200, {
            data: existing
        }, "Todo updated successfully"))

    } catch (error) {
        throw new apiError(500, "Error occured while updating the todo into database");
    }
});


const setNotes = asyncHandler(async (req, res, next) => {
    try {
        const { _id, notes } = req.body;
        console.log(_id,notes)
        if (!_id || !notes) throw new apiError(401, "provide notes and subTodo id to update notes");
        const existing = await subTodo.findById(_id);
        if(!existing)throw new apiError(401,"Wrong subTodo Id")
        existing.notes = notes;
        const updated = await existing.save();
        res.status(200).json(new apiResponse(200, {
            data: existing
        }, "Todo updated successfully"))

    } catch (error) {
        throw new apiError(500, "Error occured while updating the todo into database");
    }
});

export { getSubTodos, addSubTodo, deleteSubTodo, updateSubTodo, setNotes };