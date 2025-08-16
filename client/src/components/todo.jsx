import React, { useMemo, useRef } from 'react'
import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, X, Circle, Play, CheckCircle, ChevronDown, ChevronUp, FileText, Plus, Edit3 } from "lucide-react";
import { format } from "date-fns";
import SubTodo from "./TodoComps/todo"


const Todo = () => {
    const { theme, user, setTheme } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const socketRef = useRef(null);
    const URI = window.location.href.split("/");
    const Id = URI[URI.length - 1];
    const [todos, setTodos] = useState([]);
    const [team,setTeam] = useState([]);
    
    
    
    // Collapsible sections state
    const [collapsedSections, setCollapsedSections] = useState({
        pending: false,
        'in-progress': false,
        completed: false
    });
    
    const location = useLocation();
    const state = location.state;

    // Get counts for different statuses
    const pendingTodos = todos.filter(todo => todo.status === 'pending');
    const inProgressTodos = todos.filter(todo => todo.status === 'in-progress');
    const completedTodos = todos.filter(todo => todo.status === 'completed');

    useEffect(() => {
        socketRef.current = io(apiURL, { withCredentials: true });
        const fetchData = async () => {
            try {
                console.log(Id);
                const response = await fetch(`${apiURL}/api/v1/subTodos/getSubTodos/${Id}`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.data.data);
                    setTodos(data?.data?.data);
                } else {
                    throw new Error("failed to fetch Todos");
                }
            } catch (error) {
                console.log(error);
            }
        }
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${apiURL}/api/v1/todos/getTeam/${Id}`, {
                    method: "GET",
                    credentials: "include"
                });
                if(response.ok){
                    const data = await response.json();
                    setTeam(data.data.team);
                }else{
                    throw new Error(response.message);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
        fetchTeam();
        const handleNewTodo = (newTodo) => {
            setTodos((currentTodo) => [ ...currentTodo,newTodo]);
        };
        socketRef.current.on('subtodo_added', handleNewTodo);

        const handleUpdatedTodo = (updatedTodo) => {
            setTodos((currentTodo) =>
                currentTodo.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
            );
        };
        socketRef.current.on('subtodo_updated', handleUpdatedTodo);

        const handleDeletedTodo = (deletedTodo) => {
            setTodos((currentTodo) =>
                currentTodo.filter((todo) => todo._id !== deletedTodo._id)
            );
        };
        socketRef.current.on('subtodo_deleted', handleDeletedTodo);

        return () => {
            socketRef.current.off('subtodo_added', handleNewTodo);
            socketRef.current.off('subtodo_deleted', handleDeletedTodo);
            socketRef.current.off('subtodo_updated', handleUpdatedTodo);
        };
    }, []);

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const getUserName = (userId) => {
        return availableUsers.find(user => user.id === userId)?.name || 'Unknown User';
    };

    const formatNoteTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'MMM dd, yyyy HH:mm');
    };

    

    

    // Collapsible Section Component
    const CollapsibleSection = ({ title, status, count, icon, children, isEmpty = false }) => {
        const isCollapsed = collapsedSections[status];
        
        const getSectionColors = () => {
            switch(status) {
                case 'pending':
                    return {
                        bg: theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/10',
                        border: theme === 'light' ? 'border-yellow-200' : 'border-yellow-800',
                        text: theme === 'light' ? 'text-yellow-800' : 'text-yellow-200',
                        iconColor: 'text-yellow-500'
                    };
                case 'in-progress':
                    return {
                        bg: theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/10',
                        border: theme === 'light' ? 'border-blue-200' : 'border-blue-800',
                        text: theme === 'light' ? 'text-blue-800' : 'text-blue-200',
                        iconColor: 'text-blue-500'
                    };
                case 'completed':
                    return {
                        bg: theme === 'light' ? 'bg-green-50' : 'bg-green-900/10',
                        border: theme === 'light' ? 'border-green-200' : 'border-green-800',
                        text: theme === 'light' ? 'text-green-800' : 'text-green-200',
                        iconColor: 'text-green-500'
                    };
                default:
                    return {
                        bg: theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/10',
                        border: theme === 'light' ? 'border-gray-200' : 'border-gray-800',
                        text: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
                        iconColor: 'text-gray-500'
                    };
            }
        };

        const colors = getSectionColors();

        return (
            <Card className={`mb-6 overflow-hidden transition-all duration-300 ${colors.bg} ${colors.border} border-2`}>
                <CardHeader 
                    className={`p-4 cursor-pointer hover:opacity-80 transition-opacity ${colors.bg}`}
                    onClick={() => toggleSection(status)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={colors.iconColor}>
                                {icon}
                            </div>
                            <h3 className={`text-2xl font-bold ${colors.text}`}>
                                {title}
                            </h3>
                            <Badge variant="secondary" className={`ml-2 ${colors.text}`}>
                                {count}
                            </Badge>
                        </div>
                        <div className={`transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'} ${colors.text}`}>
                            <ChevronDown className="h-5 w-5" />
                        </div>
                    </div>
                </CardHeader>
                
                <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-none'}`}>
                    <CardContent className="p-4 pt-0">
                        {isEmpty ? (
                            <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {/* <div className={`${colors.text} opacity-50 mb-2`}>
                                    {icon}
                                </div> */}
                                <p className="text-lg">No {title.toLowerCase()} tasks</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {children}
                            </div>
                        )}
                    </CardContent>
                </div>
            </Card>
        );
    };

    return (
        <>
            <div className='flex gap-1 h-dvh overflow-y-hidden'>
                {/* Enhanced Sidebar */}
                <Card className={`w-[27dvw] rounded-lg h-[100dvh] ${theme == "light" ? "bg-gradient-to-b from-neutral-50 to-neutral-100 border-r-2 border-neutral-200" : "bg-gradient-to-b from-neutral-900 to-lightGrey border-neutral-700"} pt-10 flex-col items-center border-0 border-r-2 shadow-lg`}>
                    <div className='flex justify-center w-full px-2 mb-8'>
                        <img src="/iHaveToDo.svg" className={`h-12 ${theme == "light" ? "invert-100" : ""}`} alt="" />
                    </div>
                    <div className='flex-col w-[27dvw] px-4'>
                        <div className='pb-6'>
                            <h2 className={`text-xl font-bold ${theme == "light" ? "text-neutral-700" : "text-neutral-200"}`}>Task Overview</h2>
                            <Separator className={`mt-3 ${theme == "light" ? "bg-gray-300" : "bg-neutral-600"}`} />
                        </div>
                        
                        <div className='space-y-4'>
                            <Card className={`p-4 ${theme == "light" ? "bg-yellow-100 border-yellow-300" : "bg-yellow-900/30 border-yellow-700"} transition-all hover:shadow-md`}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-3'>
                                        <Circle className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                                        <span className={`font-semibold ${theme == "light" ? "text-yellow-800" : "text-yellow-200"}`}>Pending</span>
                                    </div>
                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                        {pendingTodos.length}
                                    </Badge>
                                </div>
                            </Card>
                            
                            <Card className={`p-4 ${theme == "light" ? "bg-blue-100 border-blue-300" : "bg-blue-900/30 border-blue-700"} transition-all hover:shadow-md`}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-3'>
                                        <Play className="h-6 w-6 text-blue-500 fill-blue-500" />
                                        <span className={`font-semibold ${theme == "light" ? "text-blue-800" : "text-blue-200"}`}>In Progress</span>
                                    </div>
                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                        {inProgressTodos.length}
                                    </Badge>
                                </div>
                            </Card>
                            
                            <Card className={`p-4 ${theme == "light" ? "bg-green-100 border-green-300" : "bg-green-900/30 border-green-700"} transition-all hover:shadow-md`}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-3'>
                                        <CheckCircle className="h-6 w-6 text-green-500 fill-green-500" />
                                        <span className={`font-semibold ${theme == "light" ? "text-green-800" : "text-green-200"}`}>Completed</span>
                                    </div>
                                    <Badge variant="secondary" className="text-lg px-3 py-1">
                                        {completedTodos.length}
                                    </Badge>
                                </div>
                            </Card>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-8">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        setCollapsedSections({
                                            pending: false,
                                            'in-progress': false,
                                            completed: false
                                        });
                                    }}
                                >
                                    Expand All Sections
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        setCollapsedSections({
                                            pending: true,
                                            'in-progress': true,
                                            completed: true
                                        });
                                    }}
                                >
                                    Collapse All Sections
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Content */}
                {todos.length == 0 ?
                    <div className='flex-1 flex items-center justify-center'>
                        <div className="text-center">
                            <div className={`mb-6 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Circle className="h-24 w-24 mx-auto mb-4" />
                            </div>
                            <h2 className={`text-4xl font-bold mb-4 ${theme == "light" ? "text-gray-900" : "text-zinc-100"}`}>
                                {`${state.title}`}
                            </h2>
                            <p className={`text-xl ${theme == "light" ? "text-gray-600" : "text-zinc-400"}`}>
                                Add your first task by clicking on the add button
                            </p>
                        </div>
                    </div>
                    :
                    <div className='flex-1 flex flex-col'>
                        <div className={`p-6 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900'} border-b ${theme === 'light' ? 'border-gray-200' : 'border-neutral-700'}`}>
                            <h1 className={`text-4xl font-bold ${theme == "light" ? "text-gray-900" : "text-zinc-100"}`}>
                                {`${state.title}`}
                            </h1>
                            <p className={`text-lg mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                Manage your tasks efficiently
                            </p>
                        </div>
                        
                        <div className='flex-1 p-6 overflow-y-auto'>
                            {/* Collapsible Sections */}
                            <CollapsibleSection
                                title="Pending"
                                status="pending"
                                count={pendingTodos.length}
                                icon={<Circle className="h-6 w-6" />}
                                isEmpty={pendingTodos.length === 0}
                            >
                                {todos.map((item, index) => <SubTodo
                                todos = {todos} 
                                setTodos = {setTodos}
                                item = {item}
                                index = {index}
                                TodoId = {Id}
                                reqstatus = "pending"
                                key={item._id}
                                users = {team}
                                />)}
                            </CollapsibleSection>

                            <CollapsibleSection
                                title="In Progress"
                                status="in-progress"
                                count={inProgressTodos.length}
                                icon={<Play className="h-6 w-6" />}
                                isEmpty={inProgressTodos.length === 0}
                            >
                                {todos.map((item, index) => <SubTodo
                                todos = {todos} 
                                setTodos = {setTodos}
                                item = {todos[index]}
                                index = {index}
                                TodoId = {Id}
                                reqstatus = "in-progress"
                                key={item._id}
                                users = {team}
                                />)}
                            </CollapsibleSection>

                            <CollapsibleSection
                                title="Completed"
                                status="completed"
                                count={completedTodos.length}
                                icon={<CheckCircle className="h-6 w-6" />}
                                isEmpty={completedTodos.length === 0}
                            >
                                {todos.map((item, index) => <SubTodo
                                todos = {todos} 
                                setTodos = {setTodos}
                                item = {todos[index]}
                                index = {index}
                                TodoId = {Id}
                                reqstatus = "completed"
                                key={item._id}
                                users = {team}
                                />)}
                            </CollapsibleSection>

                            <div className='h-20'></div>
                        </div>
                    </div>
                }
            </div>

            {/* Enhanced Floating Add Button */}
            <Button 
                className={`fixed bottom-8 right-8 ${theme == "light" ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"} rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 h-16 w-16`}
                onClick={(e) => {
                    e.stopPropagation();
                    if(todos.some((item)=>item._id === 0))return;
                    const todo = {
                        _id: 0,
                        content: "",
                        status: "pending",
                        deadline: "",
                        assignedTo: [],
                        notes: [],
                        MajorTodoId: Id
                    }
                    const arr = [...todos, todo];
                    setTodos(arr);
                }}
            >
                <img src="/plusIcon.png" alt="" className='h-8 w-8' />
            </Button>
        </>
    )
}

export default Todo
