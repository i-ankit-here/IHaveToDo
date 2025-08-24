import React, { useMemo, useRef } from 'react'
import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../../themeContext';
import getEnvironment from '../../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, X, Circle, Play, CheckCircle, ChevronDown, ChevronUp, FileText, Plus, Edit3 } from "lucide-react";
import { format } from "date-fns";
import Notes from './notes';


function Todo({ todos, setTodos, item, index, TodoId, reqstatus, users }) {
    if (reqstatus != item.status) return null;
    const { theme, setTheme, user } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const [editing, setEditing] = useState(item._id === 0);
    const [title, setTitle] = useState(item.content || "");
    const [deadline, setDeadline] = useState(item.deadline);
    const [deadlineTime, setDeadlineTime] = useState(item.deadlineTime || "");
    const [assignedUsers, setAssignedUsers] = useState(item.assignedTo || []);
    const [availableUsers, setAvailableUsers] = useState(users.filter((item) => !assignedUsers.some((it) => it == item._id)));
    const [status, setStatus] = useState(item.status);
    const [openNotesDialog, setOpenNotesDialog] = useState(false)

    const save = async () => {
        try {
            const todo = item;
            todo.content = title;
            todo.status = status;
            todo.assignedTo = assignedUsers
            const attendees = assignedUsers.map(id => {return {email: users.find(user => user._id === id)?.email}});
            console.log(attendees);

            if (deadline && deadlineTime) {
                console.log("Setting deadline:", { deadline, deadlineTime });
                todo.deadline = new Date(`${deadline}T${deadlineTime}`).toISOString();
            } else if (deadline) {
                todo.deadline = new Date(deadline).toISOString();
            }

            todo.attendees = attendees;

            if (todo._id !== 0) {
                const response = await fetch(`${apiURL}/api/v1/subTodos/updateSubTodo`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(todo)
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                } else {
                    throw new Error("Error occurred while updating todo");
                }
            } else {
                const response = await fetch(`${apiURL}/api/v1/subTodos/addSubTodo`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(todo)
                });
                if (response.ok) {
                    const data = await response.json();
                } else {
                    throw new Error("Error occurred while saving todo");
                }
                setTodos((prevTodos) => prevTodos.filter((item, i) => item._id !== 0));
            }
            setEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTodo = async () => {
        try {
            if (item._id === 0) return;
            const response = await fetch(`${apiURL}/api/v1/subTodos/deleteSubTodo`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    id: item._id
                })
            });
            if (response.ok) {
                const data = await response.json();
            } else {
                throw new Error("Error occurred while deleting todo");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateStatus = async (index, newStatus) => {
        try {
            const arr = [...todos];
            const todo = todos[index];
            if (todo._id == 0) {
                alert("Save todo first before updating status");
                return;
            }

            // Update local state first
            arr[index].status = newStatus;
            setTodos(arr);

            // Your original update API call
            todo.status = newStatus;
            const response = await fetch(`${apiURL}/api/v1/subTodos/updateSubTodo`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo)
            });
            if (response.ok) {
                const data = await response.json();
            } else {
                throw new Error("Error occurred while updating todo");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Status icon component with dropdown
    const StatusIcon = ({ currentStatus, onStatusChange, disabled = false }) => {
        const getStatusIcon = (status) => {
            switch (status) {
                case 'pending':
                    return <Circle className="h-6 w-6 text-yellow-700 " />;
                case 'in-progress':
                    return <Play className="h-6 w-6 text-blue-700 " />;
                case 'completed':
                    return <CheckCircle className="h-6 w-6 text-green-700 " />;
                default:
                    return <Circle className="h-6 w-6 text-gray-500" />;
            }
        };

        if (disabled) {
            return <div className="cursor-not-allowed opacity-50">{getStatusIcon(currentStatus)}</div>;
        }

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer hover:opacity-80 transition-opacity">
                        {getStatusIcon(currentStatus)}
                    </div>
                </PopoverTrigger>
                <PopoverContent className={`w-48 p-2 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-800 border-neutral-600'}`}>
                    <div className="space-y-1">
                        <div
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:${theme === 'light' ? 'bg-gray-100' : 'bg-neutral-700'} transition-colors`}
                            onClick={() => onStatusChange('pending')}
                        >
                            <Circle className="h-5 w-5 text-yellow-500" />
                            <span className={theme === 'light' ? 'text-gray-900' : 'text-gray-100'}>Pending</span>
                        </div>
                        <div
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:${theme === 'light' ? 'bg-gray-100' : 'bg-neutral-700'} transition-colors`}
                            onClick={() => onStatusChange('in-progress')}
                        >
                            <Play className="h-5 w-5 text-blue-500" />
                            <span className={theme === 'light' ? 'text-gray-900' : 'text-gray-100'}>In Progress</span>
                        </div>
                        <div
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:${theme === 'light' ? 'bg-gray-100' : 'bg-neutral-700'} transition-colors`}
                            onClick={() => onStatusChange('completed')}
                        >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className={theme === 'light' ? 'text-gray-900' : 'text-gray-100'}>Completed</span>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    const addUserToAssigned = (user) => {
        if (!assignedUsers.find(u => u === user._id)) {
            const newAssignedUsers = [...assignedUsers, user._id];
            setAssignedUsers(newAssignedUsers);
            setAvailableUsers(users.filter((item) => !newAssignedUsers.some((it) => it == item._id)));
        }
    };

    const removeUserFromAssigned = (userId) => {
        const newAssignedUsers = assignedUsers.filter(user => user !== userId);
        setAssignedUsers(newAssignedUsers);
        setAvailableUsers(users.filter((item) => !newAssignedUsers.some((it) => it == item._id)));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return theme === 'light' ? 'bg-yellow-200 border-yellow-300 shadow-sm' : 'bg-yellow-900/20 border-yellow-600';
            case 'in-progress': return theme === 'light' ? 'bg-blue-200 border-blue-300 shadow-sm' : 'bg-blue-900/20 border-blue-600';
            case 'completed': return theme === 'light' ? 'bg-green-200 border-green-300 shadow-sm' : 'bg-green-900/20 border-green-600';
            default: return theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/20 border-gray-600';
        }
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return '';
        const date = new Date(deadline);
        return `${format(date, 'MMM dd, yyyy')} at ${format(date, 'HH:mm')}`;
    };

    const getUserNames = (userIds) => {
        return userIds.map(id => users.find(user => user._id === id)?.firstname).filter(Boolean).join(', ');
    };


    return (
        <>
            <Card key={item._id} className={`mb-3 pt-3 pb-3 overflow-hidden transition-all duration-200 hover:shadow-md ${getStatusColor(item.status)}`}>
                <CardContent className={"p-0"}>
                    <div className='flex gap-3 pl-4 pr-4 items-start'>
                        {/* Status Icon */}
                        <div className='flex flex-col gap-1 mt-1'>
                            <StatusIcon
                                currentStatus={item.status}
                                onStatusChange={(newStatus) => updateStatus(index, newStatus)}
                                disabled={editing}
                            />
                        </div>

                        {!editing ? (
                            <div className="flex-1">
                                <div className='flex justify-between items-start'>
                                    <div className='flex-1 pr-4'>
                                        <h3 className={`font-semibold text-lg mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                                            {item.content}
                                        </h3>

                                        <div className="space-y-2">
                                            {item.deadline && (
                                                <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    <CalendarIcon className='h-4 w-4' />
                                                    <span>{formatDeadline(item.deadline)}</span>
                                                </div>
                                            )}

                                            {item.assignedTo && item.assignedTo.length > 0 && (
                                                <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    <Users className='h-4 w-4' />
                                                    <span>{getUserNames(item.assignedTo)}</span>
                                                </div>
                                            )}

                                            {/* Notes indicator */}
                                            {item.notes && item.notes.length > 0 && (
                                                <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    <FileText className='h-6 w-6' />
                                                    <span>{item.notes.length} note{item.notes.length > 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex p-0 gap-2'>
                                        <Button
                                            variant="ghost"
                                            className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-blue-900/20'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenNotesDialog(true);
                                            }}
                                        >
                                            <FileText className={`h-6 w-6 p-0 ${theme == "light" ? "" : "invert-100"}`} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.deadline) {
                                                    const date = new Date(item.deadline);
                                                    setDeadline(format(date, 'yyyy-MM-dd'));
                                                    setDeadlineTime(format(date, 'HH:mm'));
                                                }
                                                setEditing(true);
                                            }}
                                        >
                                            <img
                                                src="/edit.png"
                                                alt="Edit"
                                                className={`h-5 w-5 ${theme == "light" ? "invert-100" : ""}`}
                                            />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-red-100' : 'hover:bg-red-900/20'}`}
                                            onClick={(e) => { e.stopPropagation(); deleteTodo(index) }}
                                        >
                                            <img
                                                src="/delete.png"
                                                alt="Delete"
                                                className={`h-5 w-5 ${theme == "light" ? "invert-100" : ""}`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <div className='space-y-2'>
                                    {/* Title Input */}
                                    <div>
                                        <label id="label_for_titlee" htmlFor="title" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Task Title
                                        </label>
                                        <Input
                                            id="title"
                                            type="text"
                                            className={`w-full ${theme == "light" ? "bg-white text-black border-gray-300" : "text-white bg-neutral-700 border-neutral-500"}`}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    {/* Status Select */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Status
                                        </label>
                                        <Select id="status" value={status} onValueChange={setStatus}>
                                            <SelectTrigger className={`w-full ${theme === 'light' ? 'bg-white' : 'bg-neutral-700 border-neutral-500'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    <div className="flex items-center gap-2">
                                                        <Circle className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                        Pending
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="in-progress">
                                                    <div className="flex items-center gap-2">
                                                        <Play className="h-4 w-4 text-blue-500 fill-blue-500" />
                                                        In Progress
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-500 fill-green-500" />
                                                        Completed
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Deadline Date and Time */}
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label htmlFor='date' className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                Deadline Date
                                            </label>
                                            <Input
                                                id="date"
                                                type="date"
                                                className={`w-full ${theme == "light" ? "bg-white text-black border-gray-300" : "text-white bg-neutral-700 border-neutral-500"}`}
                                                value={deadline || ""}
                                                onChange={(e) => setDeadline(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor='time' className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                Deadline Time
                                            </label>
                                            <Input
                                                id="time"
                                                type="time"
                                                className={`w-full ${theme == "light" ? "bg-white text-black border-gray-300" : "text-white bg-neutral-700 border-neutral-500"}`}
                                                value={deadlineTime}
                                                onChange={(e) => setDeadlineTime(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Assigned Users */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Assign to Users
                                        </label>
                                        <Select onValueChange={(value) => {
                                            const user = availableUsers.find(u => u._id === value);
                                            if (user) addUserToAssigned(user);
                                        }}>
                                            <SelectTrigger className={`w-full ${theme === 'light' ? 'bg-white' : 'bg-neutral-700 border-neutral-500'}`}>
                                                <SelectValue placeholder="Select users..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableUsers.map(user => (
                                                    <SelectItem key={user._id} value={user?._id?.toString()}>
                                                        {user?.firstname} ({user?.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className='flex flex-wrap relative gap-2 mt-2'>
                                            {assignedUsers.map(id => {
                                                const user = users.find(u => u._id == id);
                                                return (
                                                    <Badge key={user?._id} variant="secondary" className='flex items-center gap-1'>
                                                        <p>{user?.firstname}</p>
                                                        <X
                                                            className='h-3 w-3 cursor-pointer relative'
                                                            onClick={(e) => { e.stopPropagation(); console.log("clicked"); removeUserFromAssigned(user._id) }}
                                                        />
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex gap-2 pt-2'>
                                        <Button
                                            type="button"
                                            className={`${theme == "light" ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-500"} text-white`}
                                            onClick={(e) => { e.stopPropagation(); save(index); }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={`${theme == "light" ? "border-gray-300 hover:bg-gray-50" : "border-neutral-500 hover:bg-neutral-700"}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (todos[index]._id == 0) {
                                                    setTodos((prev) => prev.slice(0, -1));
                                                    setEditing(false);
                                                    return;
                                                }
                                                setEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </CardContent>
            </Card>
            <Notes
                openNotesDialog={openNotesDialog}
                setOpenNotesDialog={setOpenNotesDialog}
                item={item}
                users={users}
            />
        </>
    )
}

export default Todo
