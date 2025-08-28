import React, { useState, useEffect, useContext } from 'react';
import ThemeContext from '../../themeContext';
import getEnvironment from '../../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarIcon, Users, X, Circle, Play, CheckCircle, FileText, Edit3, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import Notes from './notes';

function Todo({ todos, setTodos, item, index, reqstatus, users }) {
    if (reqstatus !== item.status) return null;

    const { theme } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const [editing, setEditing] = useState(item._id === 0);
    const [title, setTitle] = useState(item.content || "");
    const [deadline, setDeadline] = useState(item.deadline);
    const [deadlineTime, setDeadlineTime] = useState(item.deadlineTime || "");
    const [assignedUsers, setAssignedUsers] = useState(item.assignedTo || []);
    const [availableUsers, setAvailableUsers] = useState(users.filter((u) => !assignedUsers.some((id) => id === u._id)));
    const [status, setStatus] = useState(item.status);
    const [openNotesDialog, setOpenNotesDialog] = useState(false);

    const save = async () => {
        try {
            const todo = item;
            todo.content = title;
            todo.status = status;
            todo.assignedTo = assignedUsers;
            const attendees = assignedUsers.map(id => ({ email: users.find(u => u._id === id)?.email }));

            if (deadline && deadlineTime) {
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
                if (!response.ok) throw new Error("Error occurred while updating todo");
            } else {
                const response = await fetch(`${apiURL}/api/v1/subTodos/addSubTodo`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(todo)
                });
                if (!response.ok) throw new Error("Error occurred while saving todo");
            }

        } catch (error) {
            console.log(error);
        } finally {
            setEditing(false);
            setTodos((prevTodos) => prevTodos.filter((t) => t._id !== 0));
        }
    };

    const deleteTodo = async () => {
        try {
            if (item._id === 0) return;
            const response = await fetch(`${apiURL}/api/v1/subTodos/deleteSubTodo`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ id: item._id })
            });
            if (!response.ok) throw new Error("Error occurred while deleting todo");
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const arr = [...todos];
            const todo = arr[index];
            if (todo._id === 0) {
                alert("Save todo first before updating status");
                return;
            }
            todo.status = newStatus;
            setTodos(arr);
            const response = await fetch(`${apiURL}/api/v1/subTodos/updateSubTodo`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo)
            });
            if (!response.ok) throw new Error("Error occurred while updating todo");
        } catch (error) {
            console.log(error);
        }
    };

    const addUserToAssigned = (user) => {
        if (!assignedUsers.find(u => u === user._id)) {
            const newAssignedUsers = [...assignedUsers, user._id];
            setAssignedUsers(newAssignedUsers);
            setAvailableUsers(users.filter((u) => !newAssignedUsers.some((id) => id === u._id)));
        }
    };

    const removeUserFromAssigned = (userId) => {
        const newAssignedUsers = assignedUsers.filter(u => u !== userId);
        setAssignedUsers(newAssignedUsers);
        setAvailableUsers(users.filter((u) => !newAssignedUsers.some((id) => id === u._id)));
    };

    const StatusIcon = ({ currentStatus, onStatusChange, disabled = false }) => {
        const getStatusIcon = (status) => {
            switch (status) {
                case 'pending': return <Circle className="h-6 w-6 text-yellow-500" />;
                case 'in-progress': return <Play className="h-6 w-6 text-blue-500" />;
                case 'completed': return <CheckCircle className="h-6 w-6 text-green-500" />;
                default: return <Circle className={`h-6 w-6 ${theme === 'light' ? 'text-gray-400' : 'text-neutral-500'}`} />;
            }
        };

        if (disabled) {
            return <div className="cursor-not-allowed opacity-50">{getStatusIcon(currentStatus)}</div>;
        }

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer hover:opacity-70 transition-opacity">
                        {getStatusIcon(currentStatus)}
                    </div>
                </PopoverTrigger>
                <PopoverContent className={`w-48 p-2 ${theme === 'light' ? 'bg-white' : 'bg-neutral-800 border-neutral-700'}`}>
                    <div className="space-y-1">
                        <div className={`flex items-center gap-3 p-2 rounded cursor-pointer ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'} transition-colors`} onClick={() => onStatusChange('pending')}>
                            <Circle className="h-5 w-5 text-yellow-500" />
                            <span className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Pending</span>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded cursor-pointer ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'} transition-colors`} onClick={() => onStatusChange('in-progress')}>
                            <Play className="h-5 w-5 text-blue-500" />
                            <span className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>In Progress</span>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded cursor-pointer ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'} transition-colors`} onClick={() => onStatusChange('completed')}>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Completed</span>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return '';
        const date = new Date(deadline);
        return `${format(date, 'MMM dd, yyyy')} at ${format(date, 'HH:mm')}`;
    };

    const getUserNames = (userIds) => {
        return userIds.map(id => users.find(u => u._id === id)?.firstname).filter(Boolean).join(', ');
    };

    return (
        <>
            <Card key={item._id} className={`mb-3 overflow-hidden transition-all duration-200 ${theme === 'light' ? 'bg-white border-gray-200 hover:shadow-md' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'}`}>
                <CardContent className={"px-4"}>
                    <div className='flex gap-4 items-start'>
                        <div className='mt-1'>
                            <StatusIcon
                                currentStatus={item.status}
                                onStatusChange={updateStatus}
                                disabled={editing}
                            />
                        </div>

                        {!editing ? (
                            <div className="flex-1 flex justify-between items-start">
                                <div className='flex-1 pr-4'>
                                    <h3 className={`font-semibold text-lg mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{item.content}</h3>
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
                                    </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Button variant="ghost" className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'}`} onClick={(e) => { e.stopPropagation(); setOpenNotesDialog(true); }}>
                                        <FileText className={`h-5 w-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </Button>
                                    <Button variant="ghost" className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'}`} onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.deadline) {
                                            const date = new Date(item.deadline);
                                            setDeadline(format(date, 'yyyy-MM-dd'));
                                            setDeadlineTime(format(date, 'HH:mm'));
                                        }
                                        setEditing(true);
                                    }}>
                                        <Edit3 className={`h-5 w-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </Button>
                                    <Button variant="ghost" className={`h-8 w-8 p-0 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-700'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTodo(item);
                                        }}>
                                        <Trash2 className={`h-5 w-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <div className='space-y-4'>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Enter task title..."
                                        className={`w-full text-lg font-semibold ${theme === 'light' ? 'bg-gray-50' : 'bg-neutral-700'}`}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <Input type="date" className={`w-full ${theme === 'light' ? 'bg-gray-50' : 'bg-neutral-700 input-dark'}`} value={deadline || ""} onChange={(e) => setDeadline(e.target.value)} />
                                        <Input type="time" className={`w-full ${theme === 'light' ? 'bg-gray-50' : 'bg-neutral-700 input-dark'}`} value={deadlineTime} onChange={(e) => setDeadlineTime(e.target.value)} />
                                    </div>
                                    <div>
                                        <Select onValueChange={(value) => {
                                            const userToAdd = users.find(u => u._id === value);
                                            if (userToAdd) addUserToAssigned(userToAdd);
                                        }}>
                                            <SelectTrigger className={`w-full ${theme === 'light' ? 'bg-gray-50' : 'bg-neutral-700'}`}><SelectValue placeholder="Assign to a team member..." /></SelectTrigger>
                                            <SelectContent>
                                                {availableUsers.map(u => (<SelectItem key={u._id} value={u?._id?.toString()}>{u?.firstname} ({u?.email})</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <div className='flex flex-wrap gap-2 mt-2'>
                                            {assignedUsers.map(id => {
                                                const assignedUser = users.find(u => u._id === id);
                                                return (
                                                    <Badge key={assignedUser?._id} variant="secondary" className="pl-2 pr-1">
                                                        {assignedUser?.firstname}
                                                        <button className="ml-1 rounded-full hover:bg-black/10" onClick={() => removeUserFromAssigned(assignedUser._id)}><X className='h-3 w-3' /></button>
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className={`flex justify-end gap-2 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-neutral-700'}`}>
                                        <Button variant="outline" onClick={() => {
                                            if (item._id === 0) setTodos((prev) => prev.slice(0, -1));
                                            setEditing(false);
                                        }}>Cancel</Button>
                                        <Button onClick={save}>Save Task</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Notes openNotesDialog={openNotesDialog} setOpenNotesDialog={setOpenNotesDialog} item={item} users={users} />
        </>
    );
}

export default Todo;