import React, { useMemo, useRef } from 'react'
import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const Todo = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const socket = io(apiURL);
    const URI = window.location.href.split("/");
    const Id = URI[URI.length - 1];
    const prev = useRef({});
    const [todos, setTodos] = useState([]);
    const [view, setView] = useState(-1);
    const [title, setTitle] = useState("");
    const [pending, setPending] = useState(0);
    const location = useLocation();
    const state = location.state;
    // console.log(state);
    useEffect(() => {
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
        fetchData();

        // Listener for when a new task is added
        const handleNewTodo = (newTodo) => {
            setTodos((currentTodo) => [newTodo, ...currentTodo]);
            setView(-1);
        };
        socket.on('subtodo_added', handleNewTodo);

        // Listener for when a task is updated
        const handleUpdatedTodo = (updatedTodo) => {
            setTodos((currentTodo) =>
                currentTodo.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
            );
            setView(-1);
        };
        socket.on('subtodo_updated', handleUpdatedTodo);

        // Listener for when a task is deleted
        const handleDeletedTodo = (deletedTodo) => {
            setTodos((currentTodo) =>
                currentTodo.filter((todo) => todo._id !== deletedTodo._id)
            );
            setView(-1);
        };
        socket.on('subtodo_deleted', handleDeletedTodo);

        // Clean up the listeners when the component unmounts (Important to avoid memory leaks)
        return () => {
            socket.off('subtodo_added', handleNewTodo);
            socket.off('subtodo_deleted', handleDeletedTodo);
            socket.off('subtodo_updated', handleUpdatedTodo);
        };
    }, []);

    useEffect(() => {
        let cnt = 0;
        todos.forEach((item) => {
            if (!item.complete) cnt++;
        })
        setPending(cnt);
    }, [todos])

    //save or update a todo
    const save = async (index) => {
        try {
            if(!todos[index]._id)setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
            const todo = todos[index];
            todo.content = title;
            console.log(todo);
            if (todo?._id) {
                //update todo
                const response = await fetch(`${apiURL}/api/v1/subTodos/updateSubTodo`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(todo)
                })
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                } else {
                    throw new Error("Error occured while updating todo");
                }

            } else {
                //save new todo
                const response = await fetch(`${apiURL}/api/v1/subTodos/addSubTodo`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(todo)
                })
                if (response.ok) {
                    const data = await response.json();
                    // const arr = [...todos];
                    // arr[index] = data.data.data;
                    // setTodos(arr);
                } else {
                    throw new Error("Error occured while saving todo");
                }
            }
            setView(-1);
        } catch (error) {
            console.log(error);
        }
    }

    //Delete todo
    const deleteTodo = async (index) => {
        try {
            const todo = todos[index];
            const response = await fetch(`${apiURL}/api/v1/subTodos/deleteSubTodo`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    id: todo?._id
                })
            })
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                // const arr = [...todos];
                // arr.splice(index, 1);
                // setTodos(arr)
            } else {
                throw new Error("Error occured while deleting todo");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toggleTodo = async (index) => {
        try {
            const arr = [...todos];
            const todo = todos[index];
            if (!todo._id || index == view) {
                alert("Save todo first before saving");
                return;
            }
            //update todo
            todo.complete = !todo.complete;
            const response = await fetch(`${apiURL}/api/v1/subTodos/updateSubTodo`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(todo)
            })
            if (response.ok) {
                const data = await response.json();
                // arr[index].complete = todo.complete;
                // setTodos(arr);
                // console.log(data);
            } else {
                throw new Error("Error occured while updating todo");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='flex gap-1 h-dvh overflow-y-hidden'>
                <div className={`w-[27dvw] rounded-lg h-[100dvh] ${theme == "light" ? " bg-neutral-100 border-r-2 border-neutral-200 " : " bg-lightGrey "} pt-10 flex-col items-center`}>
                    <div className='flex justify-center w-full px-2'><img src="/iHaveToDo.svg" className={`h-10 ${theme == "light" ? " invert-100 " : " "}`} alt="" /></div>
                    <div className='flex-col w-[27dvw]'>
                        <div className='m-3 pt-10 border-b-2 border-gray-200'>
                            <p className={`text-2xl ${theme == "light" ? " text-neutral-600 " : " text-neutral-300 "}`}>#Remaining Tasks</p>
                        </div>
                        {todos.length == 0 ? <div className={`pl-3 text-lg ${theme == "light" ? " text-black " : " text-white "}`}>Create your first todo</div>
                            :
                            pending == 0 ? <div className={`pl-3 text-lg ${theme == "light" ? " text-black " : " text-white "}`}>No remaining tasks</div>
                                : <div className={`flex-col h-[75dvh] rounded-md overflow-y-scroll no-scrollbar `}>
                                    {todos.map((item, index) => {
                                        return item.complete ? "" : <div key={index} className={`m-3 px-2 py-1.5 h-fit ${theme == "light" ? " bg-gray-300 " : " bg-neutral-700 text-gray-200"}  text-md flex items-center justify-between rounded-md`}>
                                            <p className='text-lg'>{item.content}</p>
                                        </div>
                                    })}
                                </div>
                        }
                    </div>
                </div>
                {
                    todos.length == 0 ?
                        <div className='mt-15 w-full ${theme=="light"?"":"text-white "}'>
                            <div className={`pt-3 border-b-2 mx-8 ${theme == "light" ? " border-neutral-400 " : " border-neutral-200 "}`}>
                                <p className={`${theme == "light" ? "" : "text-zinc-100 "}text-5xl font-semibold font-sans`}>{`${state.title}`}</p>
                            </div>
                            <div className={`p-10 ${theme == "light" ? "" : "text-zinc-100 "} text-xl font-sans`}>
                                Add your first task by clicking on the add button
                            </div>
                        </div>
                        :
                        <div className='mt-15 ${theme=="light"?"":"text-white"}'>
                            <div className={`pt-3 border-b-2 mx-8 ${theme == "light" ? " border-neutral-400 " : " border-neutral-200 "}`}>
                                <p className={`${theme == "light" ? "" : "text-zinc-100 "}text-5xl font-semibold font-sans`}>{`${state.title}`}</p>
                            </div>
                            <div className='flex w-[72dvw] h-[84dvh] mt-3 flex-col items-start p-8 gap-3 overflow-y-scroll'>
                                <div className='mt-6 mx-8 w-full'>
                                    <p className={`${theme == "light" ? " border-neutral-400 " : "text-zinc-100 border-neutral-200 "}text-4xl border-b-1 mr-6 font-semibold font-sans`}>{`${"Remaining"}`}</p>
                                </div>
                                {pending == 0 ?
                                    <div className={`pl-12 pt-2 ${theme == "light" ? " border-neutral-400 " : "text-zinc-100 "}text-xl font-sans`}>No remaining task</div>
                                    :
                                    <div className='cards flex-col w-full p-2 gap-3'>
                                        {todos.map((item, index) => {
                                            return item.complete ? "" : <div key={index} className='flex gap-2 m-2 w-full items-center'>
                                                <img src="/check.svg" alt="" className={`h-7 w-7 ${theme == "light" ? "invert-100" : ""} cursor-pointer`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTodo(index);
                                                    }}
                                                />
                                                {view != index ? <div className={`flex rounded-sm p-2 w-full justify-between items-center ${theme == "light" ? "bg-blue-200" : "bg-neutral-700 text-white"}`}>
                                                    <p>{item.content}</p>
                                                    <div className='flex gap-2'>
                                                        <img src="/edit.png" alt="" className={`h-7 cursor-pointer ${theme == "light" ? "invert-100" : ""}`}
                                                            onClick={(e) => {
                                                                console.log(item.content, index);
                                                                e.stopPropagation();
                                                                prev.current = item;
                                                                setTitle(item.content);
                                                                setView(index);
                                                            }}
                                                        />
                                                        <img src="/delete.png" alt="" className={`h-7 cursor-pointer ${theme == "light" ? "invert-100" : ""}`}
                                                            onClick={(e) => { e.stopPropagation(); deleteTodo(index) }}
                                                        />
                                                    </div>
                                                </div> :
                                                    <div className='flex gap-2 rounded-sm p-2 w-full justify-between items-center'>
                                                        <input type="text" className={` w-full border-2 rounded-lg p-1 ${theme == "light" ? "bg-blue-200 text-black border-black " : " text-white bg-neutral-700 border-white "}`} value={title} onClick={(e) => { e.stopPropagation() }} onChange={(e) => {
                                                            e.stopPropagation()
                                                            setTitle(e.target.value);
                                                        }} />
                                                        <button type="button" className={`w-30 border-2 rounded-3xl p-2 ${theme == "light" ? "bg-blue-200 border-black" : "bg-neutral-600 border-white text-white"} cursor-pointer`} onClick={(e) => { e.stopPropagation(); save(index); }}>Save</button>
                                                        <button type="button" className={`w-30 border-2 rounded-3xl p-2 ${theme == "light" ? "bg-blue-200 border-black" : "bg-neutral-600 border-white text-white"} cursor-pointer`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!todos[index]._id) {
                                                                    todos.pop();
                                                                    const arr = [...todos];
                                                                    setTodos(arr);
                                                                    setView(-1);
                                                                    return;
                                                                }
                                                                const arr = [...todos];
                                                                arr[index] = prev.current;
                                                                setTodos(arr);
                                                                setView(-1);
                                                            }}
                                                        >Cancel</button>
                                                    </div>
                                                }
                                            </div>
                                        })}
                                    </div>
                                }
                                <div className='mt-6 mx-8 w-full'>
                                    <p className={`${theme == "light" ? " border-neutral-400 " : "text-zinc-100 "}text-4xl border-b-1 mr-6 font-semibold font-sans`}>{`${"Completed"}`}</p>
                                </div>
                                {pending == todos.length ?
                                    <div className={`pl-12 pt-2 ${theme == "light" ? "" : "text-zinc-100 "}text-xl font-sans`}>No Completed task</div>
                                    :
                                    <div className='cards flex-col p-2 w-full gap-3'>
                                        {todos.map((item, index) => {
                                            return item.complete ? <div key={index} className='flex gap-2 m-2 w-full items-center'>
                                                <img src="/chk_green.svg" alt="" className={`h-7 w-7 ${theme == "light" ? "" : ""} cursor-pointer`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTodo(index);
                                                    }}
                                                />
                                                <div className={`flex rounded-sm p-2 w-full justify-between items-center ${theme == "light" ? "bg-green-300" : "bg-neutral-700 text-white"}`}>
                                                    <p>{item.content}</p>
                                                    <div className='flex gap-2'>
                                                        <img src="/delete.png" alt="" className={`h-7 cursor-pointer ${theme == "light" ? "invert-100" : ""}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteTodo(index);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div> : ""
                                        })}
                                        <div className='h-20'></div>
                                    </div>
                                }
                            </div>
                        </div>
                }
            </div>
            <div className={`absolute bottom-5 right-13 ${theme == "light" ? "invert-100 bg-neutral-800" : "bg-neutral-700"} rounded-full cursor-pointer`}>
                <img src="/plusIcon.png" alt="" className='h-20'
                    onClick={(e) => {
                        e.stopPropagation();
                        setTitle("");
                        const todo = {
                            content: "",
                            complete: false,
                            MajorTodoId: Id
                        }
                        const arr = [...todos, todo];
                        setTodos(arr);
                        setView(arr.length - 1);
                    }}
                />
            </div>
        </>
    )
}

export default Todo