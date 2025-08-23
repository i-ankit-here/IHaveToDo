import React, { useRef,useState, useEffect, useContext } from 'react'
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Button } from "@/components/ui/button";
import Sidebar from './sidebar';
import AllTasks from './allTasks';
import MyTasks from './myTasks';

const Todo = () => {
    const { theme, user } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const socketRef = useRef(null);
    const URI = window.location.href.split("/");
    const Id = URI[URI.length - 1];
    const [todos, setTodos] = useState([]);
    const [team, setTeam] = useState([]);
    const [activeView, setActiveView] = useState('all-tasks');

    const directMessages = [
        { id: 'user-1', name: 'Alice Johnson', avatar: 'https://github.com/alice.png' },
        { id: 'user-2', name: 'Bob Williams', avatar: 'https://github.com/bob.png' },
        { id: 'user-3', name: 'Charlie Brown', avatar: 'https://github.com/charlie.png' }
    ];
    
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
                if (response.ok) {
                    const data = await response.json();
                    setTeam(data.data.team);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
        fetchTeam();
        const handleNewTodo = (newTodo) => {
            setTodos((currentTodo) => [...currentTodo, newTodo]);
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


    return (
        <>
            <div className='flex gap-1 h-dvh overflow-y-hidden'>
                <Sidebar 
                activeView={activeView}
                setActiveView={setActiveView}
                directMessages={directMessages}
                />
                {todos.length == 0 ?
                    <div className='flex flex-col w-full'>
                        <div className={`p-6 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900'} border-b ${theme === 'light' ? 'border-gray-200' : 'border-neutral-700'}`}>
                            <h1 className={`text-4xl font-bold ${theme == "light" ? "text-gray-900" : "text-zinc-100"}`}>
                                {`${state?.title}`}
                            </h1>
                            <p className={`text-lg mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                Manage your tasks efficiently
                            </p>
                        </div>
                        <div className='flex-1 flex items-center justify-center w-full'>
                            <div className="w-full">
                                <p className={`text-xl text-center w-full ${theme == "light" ? "text-gray-600" : "text-zinc-400"}`}>
                                    Add your first task by clicking on the add button
                                </p>
                            </div>
                        </div>
                    </div >
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
                        {
                            activeView === 'all-tasks' && <AllTasks
                                todos={todos}
                                setTodos={setTodos}
                                pendingTodos={pendingTodos}
                                inProgressTodos={inProgressTodos}
                                completedTodos={completedTodos}
                                toggleSection={toggleSection}
                                collapsedSections={collapsedSections}
                                Id={Id}
                                team={team}
                            />
                        }
                        {
                            activeView === 'my-tasks' && <MyTasks
                                todos={todos}
                                setTodos={setTodos}
                                pendingTodos={pendingTodos}
                                inProgressTodos={inProgressTodos}
                                completedTodos={completedTodos}
                                toggleSection={toggleSection}
                                collapsedSections={collapsedSections}
                                Id={Id}
                                team={team}
                                userId={user._id} 
                            />
                        }
                    </div>
                }
            </div>

            <Button
                className={`fixed bottom-8 right-8 ${theme == "light" ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"} rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 h-16 w-16`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (todos.some((item) => item._id === 0)) return;
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
