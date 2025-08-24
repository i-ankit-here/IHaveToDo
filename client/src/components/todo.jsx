import React, { useRef, useState, useEffect, useContext } from 'react'
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Button } from "@/components/ui/button";
import Sidebar from './sidebar';
import AllTasks from './allTasks';
import MyTasks from './myTasks';
import ChatWindow from './chat';

const Todo = () => {
    const { theme, user } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const socketRef = useRef(null);
    const URI = window.location.href.split("/");
    const Id = URI[URI.length - 1];
    const [todos, setTodos] = useState([]);
    const [team, setTeam] = useState([]);
    const [activeView, setActiveView] = useState('all-tasks');
    const [directMessages, setDirectMessages] = useState([]);
    const [groupChat, setGroupChat] = useState([]);
    const [users, setUsers] = useState({});

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
                    fetchConversations(data.data.team);
                    const userMap = new Map(data.data.team.map(user => [user._id, user]));
                    setUsers(userMap);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                console.log(error)
            }
        }

        const fetchConversations = async (details) => {
            try {
                const response = await fetch(`${apiURL}/api/v1/conversations/${Id}/${user._id}`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("direct Messages", data)
                    const arr = data.data.conversations.map(conv => {
                        if (conv.isGroupChat) {
                            return {
                                _id: conv._id,
                                name: "Group Chat",
                            };
                        }
                        const convParticipantId = conv.participants[0] === user._id ? conv.participants[1] : conv.participants[0];
                        const item = details?.find(u => u._id === convParticipantId);
                        return {
                            _id: conv._id,
                            name: item?.firstname || "Unknown User",
                            avatar: item?.avatar || "/userimg.jpg"
                        }
                    });
                    setDirectMessages(arr.filter((item) => item.name !== "Group Chat"));
                    setGroupChat(arr.filter((item) => item.name === "Group Chat"));
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

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
                    groupChat={groupChat}
                />
                <div className='flex flex-col w-full'>
                    <div className={`p-6 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900'} border-b ${theme === 'light' ? 'border-gray-200' : 'border-neutral-700'}`}>
                        <h1 className={`text-4xl font-bold ${theme == "light" ? "text-gray-900" : "text-zinc-100"}`}>
                            {`${state?.title}`}
                        </h1>
                        <p className={`text-lg mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Manage your tasks efficiently
                        </p>
                    </div>
                    {activeView === 'all-tasks' && (todos.length == 0 ?
                        <div className='flex-1 flex items-center justify-center w-full'>
                            <div className="w-full">
                                <p className={`text-xl text-center w-full ${theme == "light" ? "text-gray-600" : "text-zinc-400"}`}>
                                    Add your first task by clicking on the add button
                                </p>
                            </div>
                        </div>
                        :
                        <AllTasks
                            todos={todos}
                            setTodos={setTodos}
                            pendingTodos={pendingTodos}
                            inProgressTodos={inProgressTodos}
                            completedTodos={completedTodos}
                            toggleSection={toggleSection}
                            collapsedSections={collapsedSections}
                            Id={Id}
                            team={team}
                        />)
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

                    {
                        activeView.split('-')[0] === 'chat' && <ChatWindow
                            socket={socketRef.current}
                            conversationId={activeView.split('-')[1]}
                            currentUserId={user._id}
                            users={users}
                        />
                    }
                </div >
                {
                    activeView === 'all-tasks' && <Button
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
                }
            </div>
        </>
    )
}

export default Todo
